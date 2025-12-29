"use client";
/* eslint-disable @next/next/no-img-element */

import { forwardRef, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getCompatibilityRank, getRankImagePath } from "@/lib/calculate";
import { shareOrDownloadImage, downloadImage } from "@/lib/share-image-generator";
import { toBlob } from "html-to-image";
import type { PersonalityTypeCode } from "@/lib/types";
import { getCharacterImagePath } from "@/lib/character-image-mapping";

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

  // 画像を全体表示（上下が切れないように、少し上に配置）
  return (
    <div className="relative w-full h-full" style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
      <img
        src={imagePath}
        alt={alt}
        className="w-full h-full object-contain"
        style={{
          objectPosition: "center center",
          width: "100%",
          height: "100%",
          transform: "translateY(-5%)",
        }}
        loading="eager"
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
  userTypeCode?: PersonalityTypeCode; // ユーザーのタイプコード
  partnerTypeCode?: PersonalityTypeCode; // パートナーのタイプコード
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
  userTypeCode?: PersonalityTypeCode; // ユーザーのタイプコード
  partnerTypeCode?: PersonalityTypeCode; // パートナーのタイプコード
}

// ランクに応じたカード背景色を取得
function getCardBgColor(rank: string): string {
  const colors: Record<string, string> = {
    SS: "#FFD700", // ゴールド
    S: "#FFA500", // オレンジ
    A: "#FF7F7F", // コーラル
    B: "#40E0D0", // ターコイズ
    C: "#E6E6FA", // ラベンダー
    D: "#D3D3D3", // ライトグレー
    E: "#D3D3D3",
    F: "#D3D3D3",
    G: "#D3D3D3",
  };
  return colors[rank] || colors.G;
}

export const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(function ShareImageCard(
  { score, percentileDisplay, userNickname, partnerNickname, rankInfo, rankImagePath, className = "", message, userTypeCode, partnerTypeCode },
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
            backgroundColor: "#E6E6FA",
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
            backgroundColor: "#E6E6FA",
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
            backgroundColor: "#E6E6FA",
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
        {/* 画像エリア（2つの画像を合わせて正方形になるように、右寄せ） */}
        <div className="relative" style={{ width: scaleValue(400, "100%"), height: scaleValue(400, "auto") }}>
          {/* 画像フレームの影（外側） */}
          <div
            className="absolute rounded-3xl border border-black"
            style={{
              left: scaleValue(-26, -13),
              top: scaleValue(-24, -12),
              width: `calc(100% + ${scaleValue(52, 26)}px)`,
              height: `calc(100% + ${scaleValue(48, 24)}px)`,
              backgroundColor: "#FF7F7F",
            }}
          />
          {/* 画像フレーム（内側） - 正方形になるように */}
          <div
            className="relative rounded-3xl border border-black bg-[#FFB6C1]"
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              padding: scaleValue(24, 12),
              display: "flex",
              flexDirection: "row",
              gap: scaleValue(8, 4),
            }}
          >
            {/* 2つのタイプ画像を横に並べて表示 - 合わせて正方形 */}
            {/* あなたのタイプ画像 */}
            {userTypeCode && (
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-black bg-black" style={{ borderRadius: scaleValue(16, 8), height: "100%" }}>
                <RankImageDisplay 
                  imagePath={getCharacterImagePath({
                    rank: rankInfo.rank,
                    userTypeCode,
                    preferTypeIndividual: true,
                  })} 
                  alt={`${userNickname}のタイプ`} 
                  fallbackText={userNickname.charAt(0)} 
                />
              </div>
            )}
            {/* パートナーのタイプ画像 */}
            {partnerTypeCode && (
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-black bg-black" style={{ borderRadius: scaleValue(16, 8), height: "100%" }}>
                <RankImageDisplay 
                  imagePath={getCharacterImagePath({
                    rank: rankInfo.rank,
                    userTypeCode: partnerTypeCode,
                    preferTypeIndividual: true,
                  })} 
                  alt={`${partnerNickname}のタイプ`} 
                  fallbackText={partnerNickname.charAt(0)} 
                />
              </div>
            )}
            {/* フォールバック: タイプコードがない場合はランク画像を表示 */}
            {!userTypeCode && !partnerTypeCode && (
              <div className="relative z-10 h-full overflow-hidden rounded-2xl" style={{ borderRadius: scaleValue(16, 8), width: "100%" }}>
                <RankImageDisplay 
                  imagePath={rankImagePath} 
                  alt={rankInfo.tier} 
                  fallbackText={rankInfo.rank} 
                />
              </div>
            )}
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
                  className="absolute rounded-full border border-black bg-[#FFA500] flex items-center justify-center"
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
                      className="font-normal text-black"
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
  userTypeCode,
  partnerTypeCode,
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
      
      // フォントの読み込みを待つ
      await document.fonts.ready;
      
      // 画像の読み込みを確実に待つ
      const images = cardRef.current.querySelectorAll('img');
      const imagePromises = Array.from(images).map((img) => {
        return new Promise<void>((resolve) => {
          // 既に読み込み済みで有効な画像の場合
          if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
            // さらに少し待ってから解決（レンダリングを確実にする）
            setTimeout(() => resolve(), 200);
            return;
          }
          
          let resolved = false;
          
          const resolveOnce = () => {
            if (!resolved) {
              resolved = true;
              // 画像が読み込まれた後、少し待ってから解決
              setTimeout(() => resolve(), 200);
            }
          };
          
          // 読み込み成功
          img.onload = () => {
            // 画像が実際に読み込まれたか確認
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              resolveOnce();
            } else {
              // 画像サイズが0の場合は再試行
              setTimeout(() => {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  resolveOnce();
                } else {
                  console.warn("画像のサイズが0です:", img.src);
                  resolveOnce(); // エラーでも続行
                }
              }, 500);
            }
          };
          
          // エラーでも続行（フォールバック画像が表示される）
          img.onerror = () => {
            console.warn("画像の読み込みエラー:", img.src);
            resolveOnce();
          };
          
          // タイムアウト（10秒に延長）
          setTimeout(() => {
            if (!resolved) {
              console.warn("画像の読み込みタイムアウト:", img.src);
              resolveOnce();
            }
          }, 10000);
          
          // 画像が既に読み込み済みの場合でも、サイズを確認
          if (img.complete) {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setTimeout(() => resolveOnce(), 200);
            } else {
              // サイズが0の場合は、読み込みイベントを待つ
              setTimeout(() => {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  resolveOnce();
                } else {
                  console.warn("画像が読み込み済みですがサイズが0です:", img.src);
                  resolveOnce(); // エラーでも続行
                }
              }, 1000);
            }
          }
        });
      });
      
      await Promise.all(imagePromises);
      
      // レンダリング完了を待つ（画像が確実に表示されるまで）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 画像が実際に表示されているか確認
      const allImagesLoaded = Array.from(images).every(img => {
        const isLoaded = img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        if (!isLoaded) {
          console.warn("画像がまだ読み込まれていません:", img.src, {
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
        }
        return isLoaded;
      });
      
      if (!allImagesLoaded) {
        console.warn("一部の画像が読み込まれていませんが、続行します");
        // さらに1秒待つ
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // プレビュー画像のDOM要素をそのまま画像化
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2, // 高解像度
        quality: 1.0,
        cacheBust: true,
      });
      
      if (!blob) {
        throw new Error("画像の生成に失敗しました");
      }
      
      // 画像のダウンロードまたは共有
      const filename = `pairlylab-${userNickname}-${partnerNickname}-${rankInfo.rank}.png`;
      
      try {
        await shareOrDownloadImage(blob, filename, {
          title: `${userNickname} × ${partnerNickname} の相性診断結果`,
          text: `${rankInfo.tier} - ${percentileDisplay}`,
        });
      } catch (error) {
        console.error("画像の共有/ダウンロードに失敗しました:", error);
        // フォールバック: 直接ダウンロードを試みる
        downloadImage(blob, filename);
      }
      
    } catch (error) {
      console.error("Failed to generate share image", error);
      alert("画像の生成に失敗しました。\n\nもう一度お試しください。");
    } finally {
      setIsDownloading(false);
    }
  };

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <>
      {/* ダウンロード用の非表示DOMは不要（canvasで直接生成するため） */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed inset-0 z-50 bg-black backdrop-blur-md overflow-y-auto ${
              isMobile ? 'p-0' : 'flex items-center justify-center p-4'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <motion.div
              className={`relative w-full ${
                isMobile 
                  ? 'min-h-screen py-4 px-2' 
                  : 'max-w-md my-auto rounded-2xl bg-black/90'
              }`}
              initial={{ scale: isMobile ? 1 : 0.95, y: isMobile ? 0 : 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: isMobile ? 1 : 0.95, y: isMobile ? 0 : 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 右上の×ボタン */}
              <button
                onClick={onClose}
                className={`fixed top-4 right-4 rounded-full bg-black/70 p-3 text-white/90 shadow-lg hover:bg-black/80 z-50 transition-all ${
                  isMobile ? 'bg-white/20 backdrop-blur-md' : ''
                }`}
                aria-label="シェア画面を閉じる"
              >
                <X className="h-6 w-6" />
              </button>

              {!isMobile && (
                <div className="flex flex-col items-center gap-3 py-6 px-4">
                  <p className="text-xs uppercase tracking-[0.45em] text-white/70">Share Card Preview</p>
                  <h3 className="text-2xl font-semibold text-white sm:text-3xl">シェア画像</h3>
                </div>
              )}
              
              <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-[350px]'} mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
                <div className="relative w-full" style={{ aspectRatio: "700 / 1080" }}>
                  {/* プレビュー表示用（このDOMを直接画像化） */}
                  <div ref={cardRef} className="absolute inset-0 h-full w-full">
                    <ShareImageCard
                      score={score}
                      percentileDisplay={percentileDisplay}
                      userNickname={userNickname}
                      partnerNickname={partnerNickname}
                      rankInfo={rankInfo}
                      rankImagePath={rankImagePath}
                      message={message}
                      userTypeCode={userTypeCode}
                      partnerTypeCode={partnerTypeCode}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className={`${isMobile ? 'my-8 px-4 pb-8' : 'my-6 px-4 pb-4'} flex items-center justify-center gap-3`}>
                <Button
                  type="button"
                  onClick={handleDownloadImage}
                  className={`rounded-full bg-white/90 px-8 text-zinc-900 font-bold shadow-lg hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${
                    isMobile ? 'w-full py-6 text-lg' : ''
                  }`}
                  size={isMobile ? "lg" : "lg"}
                  disabled={isDownloading}
                >
                  {isDownloading ? "生成中..." : "画像をダウンロード"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
