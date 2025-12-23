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
      className={`rounded-[16px] border border-black p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${
        isAnswered 
          ? "bg-[#e2bef1]" 
          : "bg-white"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-base md:text-lg font-['Coming_Soon:Regular',sans-serif] font-normal leading-snug flex-1 text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          {question.text}
        </h2>
        <span className="ml-1 flex-shrink-0 rounded-[16px] border border-black bg-white px-2 py-1 text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          {index + 1}
        </span>
      </div>

      {/* MBTIスタイルの5つの丸選択 */}
      <div className="mt-4">
        {/* ラベル */}
        <div className="mb-3 flex items-center justify-between text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
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
                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-black flex items-center justify-center transition-all shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${
                      isSelected
                        ? "bg-[#e2bef1]"
                        : "bg-white active:bg-gray-100"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-black" />
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






