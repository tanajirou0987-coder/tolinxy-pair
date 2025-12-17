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
      className={`rounded-[40px] border-4 p-6 text-white transition-all duration-200 ${
        isAnswered 
          ? "border-white/40 bg-gradient-to-br from-[#ff006e]/30 to-[#8338ec]/30" 
          : "border-white/20 bg-gradient-to-br from-white/10 to-white/5"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-2xl font-black sm:text-3xl leading-tight">
          {question.text}
        </h2>
        <span className="ml-4 flex-shrink-0 rounded-full border-2 border-white/30 bg-gradient-to-r from-[#ff006e] to-[#8338ec] px-4 py-2 text-xs font-black text-white">
          Q{index + 1}
        </span>
      </div>

      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = currentAnswer === option.score;

          return (
            <button
              key={optionIndex}
              onClick={() => onAnswer(question.id, option.score)}
              className={`w-full rounded-[30px] border-4 px-6 py-4 text-left text-base font-black transition-all duration-200 ${
                isSelected
                  ? "border-white/50 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white"
                  : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

