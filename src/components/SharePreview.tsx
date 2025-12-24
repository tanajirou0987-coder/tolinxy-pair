"use client";
/* eslint-disable @next/next/no-img-element */

import { forwardRef, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getCompatibilityRank, getRankImagePath } from "@/lib/calculate";
import { shareOrDownloadImage } from "@/lib/share-image-generator";
import { toBlob } from "html-to-image";

// ランク画像コンポーネント（エラーハンドリング付き、正方形にクロップ）
const RankImageDisplay: React.FC<{ imagePath: string; alt: string; fallbackText?: string }> = ({
  imagePath,
  alt,
  fallbackText,
}) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // 画像の幅を基準に正方形にする
    const size = img.naturalWidth;
    setImageSize({ width: size, height: size });
    setImageLoaded(true);
  };

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white/5">
        <span className="text-5xl font-black text-white/70">{fallbackText || alt}</span>
      </div>
    );
  }

  // 画像を正方形にクロップ（横の長さを維持し、上を少し切り取って下を伸ばす）
  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1", overflow: "hidden" }}>
      <img
        src={imagePath}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          objectPosition: "center bottom", // 下を基準に配置
          width: "100%",
          height: "auto",
          minHeight: "100%",
          transform: "translateY(-10%)", // 上を10%切り取る
        }}
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
        onError={() => {
          console.error("画像の読み込みエラー:", imagePath);
          setHasError(true);
        }}
      />
    </div>
  );
};

interface SharePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  percentile: number;
  userNickname: string;
  partnerNickname: string;
  message: string;
}

interface ShareImageCardProps {
  score: number;
  percentileDisplay: string;
  userNickname: string;
  partnerNickname: string;
  rankInfo: { rank: string; rankName: string; tier: string; bandName: string };
  rankImagePath: string;
  className?: string;
  message?: string;
}

// ランクに応じたカード背景色を取得
function getCardBgColor(rank: string): string {
  const colors: Record<string, string> = {
    SS: "#564eb3", // 紫
    S: "#f1dd02", // 黄色
    A: "#ff84c5", // ピンク
    B: "#d4ff4e", // ライム
    C: "#746ae1", // ライトパープル
    D: "#949494", // グレー
    E: "#949494",
    F: "#949494",
    G: "#949494",
  };
  return colors[rank] || colors.G;
}

export const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(function ShareImageCard(
  { score, percentileDisplay, userNickname, partnerNickname, rankInfo, rankImagePath, className = "", message },
  ref
) {
  const shareMessage = message?.trim();
  const isDownload = className === ""; // ダウンロード用かどうかを判定

  const cardBgColor = getCardBgColor(rankInfo.rank);
  // Figmaのトレーディングカードサイズ: 700 x 1080
  const baseStyles = isDownload
    ? { width: 700, height: 1080 }
    : { width: "100%", height: "100%" };

  const scaleValue = (downloadValue: number, previewValue: number | string): number | string =>
    isDownload ? downloadValue : previewValue;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col overflow-hidden ${className}`}
      style={{
        ...baseStyles,
        backgroundColor: cardBgColor,
        position: "relative",
      }}
    >
      {/* 装飾的な背景要素（Figmaスタイル） */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 上部の花のような装飾 */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            left: "50%",
            top: "-158px",
            transform: "translateX(-50%)",
            width: scaleValue(344, 230),
            height: scaleValue(344, 230),
            backgroundColor: "#746ae1",
          }}
        />
        {/* 左下のプラネットのような装飾 */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            left: scaleValue(33, 22),
            bottom: scaleValue(201, 134),
            width: scaleValue(224, 149),
            height: scaleValue(224, 149),
            backgroundColor: "#746ae1",
          }}
        />
        {/* 右下のハートのような装飾 */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            right: 0,
            bottom: scaleValue(-100, -67),
            width: scaleValue(416, 277),
            height: scaleValue(416, 277),
            backgroundColor: "#746ae1",
          }}
        />
      </div>
      {/* メインカード（Figmaのレイアウト通り） */}
      <div
        className="relative mx-auto rounded-[64px] border border-black shadow-2xl"
        style={{
          width: scaleValue(700, "100%"),
          height: scaleValue(1080, "auto"),
          padding: `${scaleValue(48, 24)}px ${scaleValue(64, 32)}px ${scaleValue(64, 32)}px ${scaleValue(56, 28)}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: scaleValue(24, 12),
          backgroundColor: cardBgColor,
          zIndex: 10,
        }}
      >
        {/* 画像エリア（400×400px、右寄せ） */}
        <div className="relative" style={{ width: scaleValue(400, "100%"), height: scaleValue(400, "auto") }}>
          {/* 画像フレームの影（外側） */}
          <div
            className="absolute rounded-3xl border border-black"
            style={{
              left: scaleValue(-26, -13),
              top: scaleValue(-24, -12),
              width: `calc(100% + ${scaleValue(52, 26)}px)`,
              height: `calc(100% + ${scaleValue(48, 24)}px)`,
              backgroundColor: "#ff84c5",
            }}
          />
          {/* 画像フレーム（内側） */}
          <div
            className="relative rounded-3xl border border-black bg-[#ffa5d4]"
            style={{
              width: "100%",
              height: "100%",
              padding: scaleValue(24, 12),
            }}
          >
            {/* 画像背景（黄色、角丸） */}
            <div
              className="absolute border border-black bg-[#f1dd02] rounded-2xl"
              style={{
                left: scaleValue(24, 12),
                top: scaleValue(24, 12),
                width: `calc(100% - ${scaleValue(48, 24)}px)`,
                height: `calc(100% - ${scaleValue(48, 24)}px)`,
                borderRadius: scaleValue(16, 8),
              }}
            />
            <div className="relative z-10 h-full overflow-hidden rounded-2xl" style={{ borderRadius: scaleValue(16, 8) }}>
              <RankImageDisplay imagePath={rankImagePath} alt={rankInfo.tier} fallbackText={rankInfo.rank} />
            </div>
          </div>
          
          {/* 上部の名前（カードの外側、左側、中央寄せに調整） */}
          <div
            className="absolute text-white uppercase font-normal"
            style={{
              left: scaleValue(-80, -40),
              top: scaleValue(-48.5, -24),
              fontSize: scaleValue(64, 42),
              lineHeight: scaleValue(72, 48),
            }}
          >
            {userNickname}
          </div>
          
          {/* 下部の名前（画像フレームの下、左側、中央寄せに調整） */}
          <div
            className="absolute text-white uppercase font-normal"
            style={{
              left: scaleValue(-80, -40),
              top: `calc(100% + ${scaleValue(0.5, 0.25)}px)`,
              fontSize: scaleValue(64, 42),
              lineHeight: scaleValue(72, 48),
            }}
          >
            {partnerNickname}
          </div>
          
          {/* 星のアイコン（右上） */}
          <div
            className="absolute z-20"
            style={{
              right: scaleValue(-64, -32),
              top: scaleValue(28, 14),
              width: scaleValue(64, 42),
              height: scaleValue(64, 42),
            }}
          >
            <img src="/sparkle-filled.svg" alt="" className="w-full h-full" />
          </div>
          
          {/* 星のアイコン（左下）- 写真の前面に表示 */}
          <div
            className="absolute z-20"
            style={{
              left: scaleValue(-53, -27),
              bottom: scaleValue(13.23, 7),
              width: scaleValue(88, 58),
              height: scaleValue(88, 58),
            }}
          >
            <img src="/sparkle-filled.svg" alt="" className="w-full h-full" />
          </div>
        </div>

        {/* 下部セクション（BIOとFun fact、左右均等、gap: 24px） */}
        <div className="flex" style={{ gap: scaleValue(64, 32), width: "100%" }}>
          {/* 左側: BIOセクション */}
          <div className="relative flex-1" style={{ height: scaleValue(225, 150) }}>
            {/* BIOボックス（後ろに配置） */}
            <div
              className="absolute rounded-2xl border border-black bg-white"
              style={{
                left: scaleValue(16, 8),
                top: scaleValue(16, 8),
                right: 0,
                bottom: 0,
                padding: scaleValue(16, 8),
                paddingTop: scaleValue(80, 40), // 64から80に変更してBIOタグとの間隔を広げる
                zIndex: 1,
              }}
            >
              <p
                className="font-semibold text-black"
                style={{ fontSize: scaleValue(16, 10), lineHeight: 1.5 }}
              >
                {userNickname} × {partnerNickname}
              </p>
              {/* ポイント（スコア） */}
              <p
                className="font-semibold text-black mt-2"
                style={{ fontSize: scaleValue(16, 10), lineHeight: 1.5 }}
              >
                {score} pts
              </p>
            </div>
            {/* BIOタイトル（3層の黄色タグ、前面に配置） */}
            <div className="absolute top-0 left-0" style={{ zIndex: 2 }}>
              {[2, 1, 0].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-black bg-[#f1dd02] flex items-center justify-center"
                  style={{
                    left: i === 0 ? 0 : i === 1 ? "4.83%" : "9.66%",
                    top: i === 0 ? 0 : i === 1 ? "7.58%" : "15.15%",
                    width: i === 0 ? scaleValue(145, 97) : i === 1 ? "90.34%" : "80.68%",
                    height: i === 0 ? scaleValue(66, 44) : i === 1 ? "84.85%" : "69.7%",
                    padding: scaleValue(4, 2),
                  }}
                >
                  {i === 0 && (
                    <span
                      className="font-normal text-[#564eb3]"
                      style={{ fontSize: scaleValue(32, 21) }} // フォントサイズを40から32に縮小
                    >
                      result
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右側: Fun factセクション */}
          <div className="flex-1 relative" style={{ height: scaleValue(225, 150) }}>
            <div
              className="rounded-2xl border border-black bg-white h-full relative"
              style={{ padding: scaleValue(16, 8) }}
            >
              {/* Fun factタイトル（上部） */}
              <p
                className="font-normal text-[#564eb3] mb-2"
                style={{ fontSize: scaleValue(16, 10) }}
              >
                Fun fact!
              </p>
              
              {/* ランク表示（上部） */}
              <p
                className="font-black text-black"
                style={{ fontSize: scaleValue(48, 32), lineHeight: 1 }}
              >
                {rankInfo.rank}
              </p>
              
              {/* ランク帯名（ランクの下） */}
              <p
                className="font-semibold text-black mb-5"
                style={{ fontSize: scaleValue(20, 14), lineHeight: 1.5 }}
              >
                {rankInfo.bandName}
              </p>
              
              {/* パーセンタイル表示（ランク帯名の下、中央） */}
              <p
                className="font-semibold text-black text-center"
                style={{
                  fontSize: scaleValue(16, 10),
                  lineHeight: 1.5,
                }}
              >
                {percentileDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
});

export default function SharePreview({
  isOpen,
  onClose,
  score,
  percentile,
  userNickname,
  partnerNickname,
  message,
}: SharePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const roundedPercentile = Math.round(percentile);
  const displayPercentile = roundedPercentile;
  const percentileDisplay = `上位${displayPercentile}%`;
  const rankInfo = getCompatibilityRank(displayPercentile);
  const rankImagePath = getRankImagePath(rankInfo.rank);

  const handleDownloadImage = async () => {
    if (!cardRef.current) {
      alert("画像の生成に失敗しました。");
      return;
    }

    try {
      setIsDownloading(true);
      
      // 画像の読み込みを確実に待つ
      const images = cardRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve();
          }
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // エラーでも続行
            setTimeout(() => resolve(), 3000); // タイムアウト
          });
        })
      );
      
      // レンダリング完了を待つ
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 非表示DOM要素（700x1080サイズ）をそのまま画像化
      // 元のサイズそのままで画像化するため、width/heightオプションは指定しない
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2, // 高解像度
        quality: 1.0,
        cacheBust: true,
      });
      
      if (!blob) {
        throw new Error("画像の生成に失敗しました");
      }
      
      // 共有またはダウンロード
      const filename = `pairlylab-${userNickname}-${partnerNickname}-${rankInfo.rank}.png`;
      await shareOrDownloadImage(blob, filename, {
        title: `${userNickname} × ${partnerNickname} の相性診断結果`,
        text: `${rankInfo.tier} - ${percentileDisplay}`,
      });
      
    } catch (error) {
      console.error("Failed to generate share image", error);
      alert("画像の生成に失敗しました。\n\nもう一度お試しください。");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* ダウンロード用の非表示DOMは不要（canvasで直接生成するため） */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-md max-h-[95vh] overflow-y-auto rounded-2xl"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-3 py-6">
                  <p className="text-xs uppercase tracking-[0.45em] text-white/70">Share Card Preview</p>
                  <h3 className="text-2xl font-semibold text-white sm:text-3xl">シェア画像</h3>
                </div>
              <div className="w-full max-w-[350px] mx-auto">
                <div className="relative w-full" style={{ aspectRatio: "700 / 1080" }}>
                  {/* プレビュー表示用 */}
                  <div className="absolute inset-0 h-full w-full">
                    <ShareImageCard
                      score={score}
                      percentileDisplay={percentileDisplay}
                      userNickname={userNickname}
                      partnerNickname={partnerNickname}
                      rankInfo={rankInfo}
                      rankImagePath={rankImagePath}
                      message={message}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
              {/* ダウンロード用の非表示DOM（700x1080サイズ、元のサイズそのまま） */}
              <div 
                ref={cardRef} 
                className="fixed left-[-9999px] top-0 pointer-events-none"
                style={{ 
                  width: "700px", 
                  height: "1080px",
                }}
              >
                <ShareImageCard
                  score={score}
                  percentileDisplay={percentileDisplay}
                  userNickname={userNickname}
                  partnerNickname={partnerNickname}
                  rankInfo={rankInfo}
                  rankImagePath={rankImagePath}
                  message={message}
                  className=""
                />
              </div>
              <div className="my-6 flex items-center justify-center gap-3">
                <Button
                  type="button"
                  onClick={handleDownloadImage}
                  className="rounded-full bg-white/90 px-8 text-zinc-900 font-bold shadow-lg hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  size="lg"
                  disabled={isDownloading}
                >
                  {isDownloading ? "生成中..." : "画像をダウンロード"}
                </Button>
              </div>
              <button
                  onClick={onClose}
                  className="absolute top-0 right-0 m-4 rounded-full bg-black/50 p-2 text-white/80 shadow-md hover:bg-black/70"
                  aria-label="シェア画面を閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
