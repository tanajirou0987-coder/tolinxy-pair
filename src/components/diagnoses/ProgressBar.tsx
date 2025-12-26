import { memo } from "react";

interface ProgressBarProps {
  answeredCount: number;
  totalQuestions: number;
  variant?: "mobile" | "desktop";
}

export const ProgressBar = memo(function ProgressBar({
  answeredCount,
  totalQuestions,
  variant = "mobile",
}: ProgressBarProps) {
  const progress = (answeredCount / totalQuestions) * 100;
  const isMobile = variant === "mobile";

  return (
    <div className={`sticky top-0 z-20 border-b border-white/70 bg-white/90 backdrop-blur-2xl shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)] ${isMobile ? "-mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 sm:py-3" : "px-8 py-5"}`}>
      <div className={`flex items-center justify-between ${isMobile ? "mb-1.5 sm:mb-2" : "mb-3"}`}>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] ${isMobile ? "text-[10px] sm:text-xs" : "text-base"}`}>
          {answeredCount} / {totalQuestions}
        </span>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] ${isMobile ? "text-base sm:text-lg" : "text-2xl"}`}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className={`w-full overflow-hidden rounded-full border border-white/70 bg-white/80 backdrop-blur-sm ${isMobile ? "h-1.5 sm:h-2" : "h-6"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-300/90 via-pink-200/90 to-pink-300/90 transition-all duration-300 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});



