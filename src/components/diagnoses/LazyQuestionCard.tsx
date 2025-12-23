import { memo, useState, useEffect } from "react";
import { QuestionCard } from "./QuestionCard";
import type { Question, Score } from "@/lib/types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface LazyQuestionCardProps {
  question: Question;
  index: number;
  currentAnswer: Score | null;
  isAnswered: boolean;
  onAnswer: (questionId: number, score: Score) => void;
  step: "user" | "partner";
  priority?: boolean; // 優先的にレンダリングするか
}

export const LazyQuestionCard = memo(function LazyQuestionCard({
  question,
  index,
  currentAnswer,
  isAnswered,
  onAnswer,
  step,
  priority = false,
}: LazyQuestionCardProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.01,
    rootMargin: "200px", // 200px手前からレンダリング開始
    enabled: !priority,
  });

  const [shouldRender, setShouldRender] = useState(priority || index < 5); // 最初の5問は即座にレンダリング

  useEffect(() => {
    if (priority || isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(true);
    }
  }, [isVisible, priority]);

  // プレースホルダー（高さを保持）
  if (!shouldRender) {
    return (
      <div
        ref={ref}
        className="rounded-[16px] border border-black bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        style={{ minHeight: "150px" }}
      />
    );
  }

  return (
    <div ref={ref}>
      <QuestionCard
        question={question}
        index={index}
        currentAnswer={currentAnswer}
        isAnswered={isAnswered}
        onAnswer={onAnswer}
        step={step}
      />
    </div>
  );
});





