"use client";

import { forwardRef, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getCompatibilityRank } from "@/lib/calculate";
import { toPng } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";

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
  rankInfo: { rank: string; tier: string };
  className?: string;
  message?: string;
}

export const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(function ShareImageCard(
  { score, percentileDisplay, userNickname, partnerNickname, rankInfo, className = "", message },
  ref
) {
  const shareMessage = message?.trim();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const gradients: Record<string, string> = {
    SS: "from-yellow-300/30 via-zinc-900 to-zinc-900",
    S: "from-purple-400/30 via-zinc-900 to-zinc-900",
    A: "from-blue-400/30 via-zinc-900 to-zinc-900",
    B: "from-green-400/30 via-zinc-900 to-zinc-900",
    C: "from-orange-400/30 via-zinc-900 to-zinc-900",
    DEFAULT: "from-gray-500/30 via-zinc-900 to-zinc-900",
  };
  const gradientClass = gradients[rankInfo.rank] || gradients.DEFAULT;

  return (
    <div
      ref={ref}
      className={`relative flex aspect-[9/16] w-full flex-col overflow-hidden rounded-none bg-zinc-900 text-white ${className}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradientClass} opacity-70`}
      />
      <div className="relative z-10 flex h-full flex-col p-8">
        <div className="text-center">
          <p className="font-semibold tracking-wider">Pairly Lab</p>
          <p className="text-xs text-white/70">{userNickname} × {partnerNickname}</p>
        </div>

        <div className="my-4 flex flex-1 items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-6xl font-bold mb-2">{rankInfo.rank}</div>
            <div className="text-2xl font-semibold">{rankInfo.tier}</div>
          </div>
        </div>

        <div className="space-y-2 text-left mb-4">
          <h2 className="text-3xl font-bold leading-tight">{rankInfo.tier}</h2>
          <p className="text-base text-white/80">ランク: {rankInfo.rank}</p>
        </div>

        <div className="flex items-end gap-4 border-t border-white/10 pt-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-bold">{score}</p>
              <p className="text-lg font-medium text-white/80">pts</p>
            </div>
            <p className="mt-1 text-sm font-medium text-white/70">{percentileDisplay}</p>
            {shareMessage && (
              <p className="mt-2 line-clamp-2 text-xs text-white/60">{shareMessage}</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="rounded-lg bg-white p-1">
              <QRCodeCanvas
                value={shareUrl}
                size={72}
                bgColor="#ffffff"
                fgColor="#18181b" // zinc-900
                level="L"
              />
            </div>
            <p className="text-[0.5rem] uppercase tracking-widest text-white/60">Scan to try</p>
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
  const downloadCardRef = useRef<HTMLDivElement>(null);
  const roundedPercentile = Math.round(percentile);
  const displayPercentile = roundedPercentile;
  const percentileDisplay = `上位${displayPercentile}%`;
  const rankInfo = getCompatibilityRank(displayPercentile);

  const handleDownloadImage = async () => {
    if (!downloadCardRef.current) return;
    try {
      setIsDownloading(true);
      
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(downloadCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 1080,
        height: 1920,
        canvasWidth: 1080,
        canvasHeight: 1920,
        backgroundColor: "#18181b", // bg-zinc-900
        quality: 1.0,
      });
      
      const newWindow = window.open(dataUrl, '_blank');
      if (newWindow) {
        newWindow.focus();
        alert("画像を新しいタブで開きました。新しいタブで右クリック（または長押し）し、「名前を付けて画像を保存」を選択して、保存先を選んでください。");
      } else {
        // ポップアップブロッカーなどで開けない場合、フォールバックとして直接ダウンロードを試みる
        alert("画像を新しいタブで開けませんでした。ポップアップブロッカーを無効にして再試行するか、ダウンロードボタンを長押しして保存してください。\n\n自動でダウンロードを試みます。");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `pairlylab-${userNickname}-${partnerNickname}-${rankInfo.rank}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
    } catch (error) {
      console.error("Failed to export share card", error);
      alert("画像の生成に失敗しました。\n\n画像が読み込まれるまで少し待ってから再度お試しください。");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div
        className="pointer-events-none fixed left-[-9999px] top-0"
        aria-hidden="true"
      >
        <div
          ref={downloadCardRef}
          style={{ width: 1080, height: 1920 }}
        >
          <ShareImageCard
            score={score}
            percentileDisplay={percentileDisplay}
            userNickname={userNickname}
            partnerNickname={partnerNickname}
            rankInfo={rankInfo}
            message={message}
            className="h-full w-full"
          />
        </div>
      </div>
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


