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
      <div className={`inline-flex items-center rounded-[16px] border border-black bg-[#e2bef1] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${isMobile ? "gap-1.5 px-3 py-1" : "gap-2 px-6 py-2"}`}>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-sm" : "text-lg"}`}>
          {stepLabel}
        </span>
        <span className={`font-['Coming_Soon:Regular',sans-serif] font-normal bg-white rounded-[16px] border border-black text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-[10px] px-1.5 py-0.5" : "text-sm px-3 py-1"}`}>
          {stepNumber}
        </span>
      </div>
    </div>
  );
});

