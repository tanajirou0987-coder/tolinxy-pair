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
    <div className={`sticky top-0 z-20 border-b border-black bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${isMobile ? "-mx-4 px-4 py-2" : "px-8 py-4"}`}>
      <div className={`flex items-center justify-between ${isMobile ? "mb-1.5 text-sm" : "mb-3 text-lg"}`}>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-xs" : ""}`}>
          {answeredCount} / {totalQuestions}
        </span>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-lg" : "text-2xl"}`}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className={`w-full overflow-hidden rounded-full border border-black bg-white ${isMobile ? "h-1.5" : "h-5"}`}>
        <div
          className="h-full rounded-full bg-[#e2bef1] transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});


