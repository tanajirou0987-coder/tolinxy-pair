import { memo } from "react";

interface StepHeaderProps {
  step: "user" | "partner";
  variant?: "mobile" | "desktop";
}

export const StepHeader = memo(function StepHeader({
  step,
  variant = "mobile",
}: StepHeaderProps) {
  const isMobile = variant === "mobile";
  const stepLabel = step === "user" ? "自分の回答" : "パートナーの回答";
  const stepNumber = step === "user" ? "1/2" : "2/2";

  return (
    <div className="text-center">
      <div className={`inline-flex items-center rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border border-white/70 bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90 backdrop-blur-md shadow-[0px_12px_32px_rgba(255,182,193,0.3),0px_6px_16px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)] ${isMobile ? "gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5" : "gap-3 px-8 py-3"}`}>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)] ${isMobile ? "text-xs sm:text-sm" : "text-lg"}`}>
          {stepLabel}
        </span>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-semibold bg-white/95 rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border border-white/80 text-gray-900 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] ${isMobile ? "text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5" : "text-sm px-3 py-1"}`}>
          {stepNumber}
        </span>
      </div>
    </div>
  );
});


