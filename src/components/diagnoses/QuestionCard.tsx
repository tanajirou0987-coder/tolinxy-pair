import { memo } from "react";
import type { Question, Score } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  index: number;
  currentAnswer: Score | null;
  isAnswered: boolean;
  onAnswer: (questionId: number, score: Score) => void;
  step: "user" | "partner";
}

export const QuestionCard = memo(function QuestionCard({
  question,
  index,
  currentAnswer,
  isAnswered,
  onAnswer,
  step,
}: QuestionCardProps) {
  return (
    <div
      key={`${step}-${question.id}`}
      className={`rounded-[32px] border border-white/70 p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] backdrop-blur-lg transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12),0px_8px_20px_rgba(0,0,0,0.08)] ${
        isAnswered 
          ? "bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90" 
          : "bg-white/90"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-base md:text-lg font-['Coming_Soon:Regular',sans-serif] font-normal leading-snug flex-1 text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          {question.text}
        </h2>
        <span className="ml-1 flex-shrink-0 rounded-[20px] border border-white/80 bg-white/95 px-2 py-1 text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
          {index + 1}
        </span>
      </div>

      {/* MBTIスタイルの5つの丸選択 */}
      <div className="mt-4">
        {/* ラベル */}
        <div className="mb-3 flex items-center justify-between text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-600 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
          <span>当てはまる</span>
          <span>当てはまらない</span>
        </div>
        
        {/* 5つの丸（score順: 2, 1, 0, -1, -2） */}
        <div className="flex items-center justify-between gap-2 px-1">
          {[...question.options]
            .sort((a, b) => b.score - a.score) // score降順（2→1→0→-1→-2）
            .map((option) => {
              const isSelected = currentAnswer === option.score;

              return (
                <button
                  key={option.score}
                  onClick={() => onAnswer(question.id, option.score)}
                  className={`flex-1 flex items-center justify-center py-2 transition-all active:scale-95 ${
                    isSelected
                      ? "scale-110"
                      : ""
                  }`}
                  aria-label={`選択肢 score: ${option.score}`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white/80 flex items-center justify-center transition-all shadow-[0px_8px_24px_rgba(0,0,0,0.08),0px_4px_12px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] ${
                      isSelected
                        ? "bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90"
                        : "bg-white/95 backdrop-blur-sm active:bg-white/80"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gray-900 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2)]" />
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
});






