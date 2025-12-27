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
        <div className={`rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl shadow-[0px_24px_64px_rgba(0,0,0,0.12),0px_12px_32px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)] ${isMobile ? "space-y-6 p-6 sm:p-8" : "space-y-8 p-12"}`}>
          <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_2px_4px_rgba(0,0,0,0.1)] leading-relaxed ${isMobile ? "text-sm sm:text-base" : "text-base"}`}>
            自分の回答がそろいました！内容に間違いがないか確認してからパートナーに渡してください。
          </p>
          <button
            onClick={onConfirm}
            disabled={isTransitioning}
            className={`inline-flex w-full items-center justify-center rounded-[32px] border border-white/60 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_12px_40px_rgba(255,182,193,0.4),0px_6px_20px_rgba(255,182,193,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(255,182,193,0.5),0px_8px_25px_rgba(255,182,193,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)] ${isMobile ? "px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base" : "px-12 py-6 text-base"}`}
          >
            パートナーの回答に進む →
          </button>
        </div>
      );
    }
    return (
      <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-shadow-[0px_2px_4px_rgba(0,0,0,0.1)] leading-relaxed ${isMobile ? "text-xs sm:text-sm px-2" : "text-base px-4"}`}>
        すべて回答するとパートナーにバトンタッチできます
      </p>
    );
  }

  // Partner step
  if (isComplete) {
    return (
      <div className={`rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl shadow-[0px_24px_64px_rgba(0,0,0,0.12),0px_12px_32px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)] ${isMobile ? "space-y-6 p-6 sm:p-8" : "space-y-8 p-12"}`}>
        <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_2px_4px_rgba(0,0,0,0.1)] leading-relaxed ${isMobile ? "text-sm sm:text-base" : "text-base"}`}>
          2人分の回答がそろいました！診断結果を作成します
        </p>
        <button
          onClick={onConfirm}
          disabled={isCalculating}
          className={`inline-flex w-full items-center justify-center rounded-[32px] border border-white/60 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_12px_40px_rgba(255,182,193,0.4),0px_6px_20px_rgba(255,182,193,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(255,182,193,0.5),0px_8px_25px_rgba(255,182,193,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)] ${isMobile ? "px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base" : "px-12 py-6 text-base"}`}
        >
          結果を表示
        </button>
      </div>
    );
  }

  return (
    <p className={`font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-relaxed ${isMobile ? "text-xs sm:text-sm px-2" : "text-base px-4"}`}>
      パートナーの回答をすべて埋めてから結果へ進めます
    </p>
  );
});


