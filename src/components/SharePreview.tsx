"use client";
/* eslint-disable @next/next/no-img-element */

import { forwardRef, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getCompatibilityRank, getRankImagePath } from "@/lib/calculate";
import { QRCodeCanvas } from "qrcode.react";
import { generateShareImageBlob, shareOrDownloadImage } from "@/lib/share-image-generator";

// ランク画像コンポーネント（エラーハンドリング付き）
const RankImageDisplay: React.FC<{ imagePath: string; alt: string; fallbackText?: string }> = ({
  imagePath,
  alt,
  fallbackText,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white/5">
        <span className="text-5xl font-black text-white/70">{fallbackText || alt}</span>
      </div>
    );
  }

  // シンプルにimgタグを使用（Next.js Imageコンポーネントはhtml-to-imageで問題が起きる可能性があるため）
  return (
    <img
      src={imagePath}
      alt={alt}
      className="w-full h-full object-contain max-w-full max-h-full"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
      crossOrigin="anonymous"
      onError={() => {
        console.error("画像の読み込みエラー:", imagePath);
        setHasError(true);
      }}
    />
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

export const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(function ShareImageCard(
  { score, percentileDisplay, userNickname, partnerNickname, rankInfo, rankImagePath, className = "", message },
  ref
) {
  const shareMessage = message?.trim();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const isDownload = className === ""; // ダウンロード用かどうかを判定

  const gradients: Record<string, string> = {
    SS: "from-yellow-300/30 via-zinc-900 to-zinc-900",
    S: "from-purple-400/30 via-zinc-900 to-zinc-900",
    A: "from-blue-400/30 via-zinc-900 to-zinc-900",
    B: "from-green-400/30 via-zinc-900 to-zinc-900",
    C: "from-orange-400/30 via-zinc-900 to-zinc-900",
    DEFAULT: "from-gray-500/30 via-zinc-900 to-zinc-900",
  };
  const gradientClass = gradients[rankInfo.rank] || gradients.DEFAULT;
  const baseStyles = isDownload
    ? { width: 1080, height: 1920 }
    : { width: "100%", height: "100%" };

  const scaleValue = (downloadValue: number, previewValue: number) =>
    isDownload ? downloadValue : previewValue;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col overflow-hidden rounded-none bg-zinc-900 text-white ${className}`}
      style={{
        ...baseStyles,
        padding: isDownload ? "32px 40px 28px" : "24px 20px",
        backgroundColor: "#0a0a0a",
        position: "relative",
      }}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${gradientClass}`}
        style={{
          opacity: 0.6,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />
      <div
        className="relative flex flex-col"
        style={{ 
          gap: scaleValue(18, 14),
          height: "100%",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{ 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: scaleValue(6, 4),
          }}
        >
          <p
            style={{ 
              fontSize: scaleValue(14, 10),
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: scaleValue(4, 2),
              color: "rgba(255, 255, 255, 0.5)",
              margin: 0,
            }}
          >
            Pairly Lab
          </p>
          <p
            style={{ 
              fontSize: scaleValue(64, 40),
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {userNickname} × {partnerNickname}
          </p>
          <p
            style={{ 
              fontSize: scaleValue(16, 12),
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: scaleValue(0.5, 0.3),
              margin: 0,
            }}
          >
            Matching Rhythm Report
          </p>
        </div>

        {/* スコア */}
        <div
          style={{ 
            borderRadius: scaleValue(24, 18),
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            textAlign: "center",
            padding: `${scaleValue(24, 18)}px ${scaleValue(20, 16)}px`,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            style={{ 
              fontSize: scaleValue(12, 9),
              textTransform: "uppercase",
              letterSpacing: scaleValue(3, 2),
              color: "rgba(255, 255, 255, 0.5)",
              margin: `0 0 ${scaleValue(10, 6)}px 0`,
              fontWeight: 600,
            }}
          >
            Compatibility Score
          </p>
          <div style={{ 
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: scaleValue(10, 6),
            marginBottom: scaleValue(8, 6),
          }}>
            <p
              style={{ 
                fontSize: scaleValue(140, 88),
                fontWeight: 800,
                background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                margin: 0,
                letterSpacing: "-0.04em",
              }}
            >
              {score}
            </p>
            <span
              style={{ 
                fontSize: scaleValue(36, 24),
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.5)",
                marginBottom: scaleValue(6, 3),
              }}
            >
              pts
            </span>
          </div>
          <p
            style={{ 
              fontSize: scaleValue(32, 20),
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.85)",
              margin: 0,
            }}
          >
            {percentileDisplay}
          </p>
        </div>

        {/* ランク情報 */}
        <div
          style={{ 
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: scaleValue(24, 18),
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)",
            padding: `${scaleValue(24, 18)}px ${scaleValue(20, 16)}px`,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            gap: scaleValue(18, 12),
            minHeight: 0,
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: scaleValue(24, 16),
          }}>
            <div
              style={{ 
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: scaleValue(24, 18),
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
                width: scaleValue(260, 160),
                height: scaleValue(260, 160),
                flexShrink: 0,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <RankImageDisplay imagePath={rankImagePath} alt={rankInfo.tier} fallbackText={rankInfo.rank} />
            </div>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: scaleValue(8, 6),
              flex: 1,
            }}>
              <p
                style={{ 
                  fontSize: scaleValue(12, 9),
                  textTransform: "uppercase",
                  letterSpacing: scaleValue(3, 2),
                  color: "rgba(255, 255, 255, 0.4)",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Pair Rank
              </p>
              <p
                style={{ 
                  fontSize: scaleValue(72, 48),
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.05,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {rankInfo.bandName}
              </p>
              <p
                style={{ 
                  fontSize: scaleValue(28, 18),
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.75)",
                  margin: 0,
                }}
              >
                ランク: {rankInfo.rank}
              </p>
            </div>
          </div>
          {shareMessage && (
            <div
              style={{ 
                borderRadius: scaleValue(18, 14),
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.04)",
                padding: scaleValue(16, 12),
                fontSize: scaleValue(26, 18),
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.9)",
                whiteSpace: "pre-line",
                textAlign: "center",
              }}
            >
              {shareMessage}
            </div>
          )}
        </div>

        {/* フッター */}
        <div style={{ 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: scaleValue(18, 12),
          marginTop: "auto",
        }}>
          <div>
            <p
              style={{ 
                fontSize: scaleValue(10, 8),
                textTransform: "uppercase",
                letterSpacing: scaleValue(3, 2),
                color: "rgba(255, 255, 255, 0.4)",
                margin: `0 0 ${scaleValue(3, 2)}px 0`,
                fontWeight: 600,
              }}
            >
              pairly lab
            </p>
            <p
              style={{ 
                fontSize: scaleValue(18, 14),
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.7)",
                margin: 0,
              }}
            >
              2人のリズムを科学する診断
            </p>
          </div>
          <div style={{ 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: scaleValue(8, 6),
          }}>
            <div
              style={{ 
                borderRadius: scaleValue(18, 12),
                backgroundColor: "#ffffff",
                padding: scaleValue(10, 7),
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            >
              <QRCodeCanvas
                value={shareUrl}
                size={scaleValue(104, 72)}
                bgColor="#ffffff"
                fgColor="#18181b"
                level="M"
              />
            </div>
            <p
              style={{ 
                fontSize: scaleValue(11, 8),
                textTransform: "uppercase",
                letterSpacing: scaleValue(3, 2),
                color: "rgba(255, 255, 255, 0.6)",
                margin: 0,
                fontWeight: 600,
              }}
            >
              Scan to try
            </p>
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
  const roundedPercentile = Math.round(percentile);
  const displayPercentile = roundedPercentile;
  const percentileDisplay = `上位${displayPercentile}%`;
  const rankInfo = getCompatibilityRank(displayPercentile);
  const rankImagePath = getRankImagePath(rankInfo.rank);

  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      
      // 非表示canvasで画像を生成（UIに影響なし）
      const blob = await generateShareImageBlob({
        userNickname,
        partnerNickname,
        score,
        percentileDisplay,
        rankInfo,
        rankImagePath,
        message,
        shareUrl: typeof window !== "undefined" ? window.location.href : "",
      });
      
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
              <div className="w-full max-w-[320px] mx-auto">
                <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
                  <ShareImageCard
                    score={score}
                    percentileDisplay={percentileDisplay}
                    userNickname={userNickname}
                    partnerNickname={partnerNickname}
                    rankInfo={rankInfo}
                    rankImagePath={rankImagePath}
                    message={message}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
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
