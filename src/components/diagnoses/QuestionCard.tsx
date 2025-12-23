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
      className={`rounded-xl border p-3 text-white ${
        isAnswered 
          ? "border-white/25 bg-[#ff006e]/15" 
          : "border-white/8 bg-white/3"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="text-base font-black leading-snug flex-1">
          {question.text}
        </h2>
        <span className="ml-1 flex-shrink-0 rounded border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] font-black text-white">
          {index + 1}
        </span>
      </div>

      {/* MBTIスタイルの5つの丸選択 */}
      <div className="mt-3">
        {/* ラベル */}
        <div className="mb-2 flex items-center justify-between text-[10px] font-black text-white/60">
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
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#ff006e] bg-[#ff006e] shadow-lg shadow-[#ff006e]/50"
                        : "border-white/30 bg-white/5 active:border-white/50 active:bg-white/10"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white" />
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





