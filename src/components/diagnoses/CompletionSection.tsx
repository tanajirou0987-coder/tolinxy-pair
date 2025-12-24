import { memo } from "react";

interface CompletionSectionProps {
  step: "user" | "partner";
  answeredCount: number;
  totalQuestions: number;
  onConfirm: () => void;
  isTransitioning?: boolean;
  isCalculating?: boolean;
  variant?: "mobile" | "desktop";
}

export const CompletionSection = memo(function CompletionSection({
  step,
  answeredCount,
  totalQuestions,
  onConfirm,
  isTransitioning = false,
  isCalculating = false,
  variant = "mobile",
}: CompletionSectionProps) {
  const isMobile = variant === "mobile";
  const isComplete = answeredCount === totalQuestions;

  if (step === "user") {
    if (isComplete) {
      return (
        <div className={`rounded-[16px] border border-black bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${isMobile ? "space-y-3 p-6" : "space-y-4 p-8"}`}>
          <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-base" : "text-lg"}`}>
            自分の回答がそろいました！<br />
            内容に間違いがないか確認してからパートナーに渡してください。
          </p>
          <button
            onClick={onConfirm}
            disabled={isTransitioning}
            className={`inline-flex w-full items-center justify-center rounded-[16px] border border-black bg-[#e2bef1] font-['Coming_Soon:Regular',sans-serif] font-normal text-black disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:scale-105 ${isMobile ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"}`}
          >
            パートナーの回答に進む →
          </button>
        </div>
      );
    }
    return (
      <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-xs" : "text-sm"}`}>
        すべて回答するとパートナーにバトンタッチできます
      </p>
    );
  }

  // Partner step
  if (isComplete) {
    return (
      <div className={`rounded-[16px] border border-black bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${isMobile ? "space-y-3 p-6" : "space-y-4 p-8"}`}>
        <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-base" : "text-lg"}`}>
          2人分の回答がそろいました！<br />診断結果を作成します
        </p>
        <button
          onClick={onConfirm}
          disabled={isCalculating}
          className={`inline-flex w-full items-center justify-center rounded-[16px] border border-black bg-[#e2bef1] font-['Coming_Soon:Regular',sans-serif] font-normal text-black disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:scale-105 ${isMobile ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"}`}
        >
          結果を表示
        </button>
      </div>
    );
  }

  return (
    <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "text-xs" : "text-sm"}`}>
      パートナーの回答をすべて埋めてから結果へ進めます
    </p>
  );
});

