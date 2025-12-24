import { useState, useCallback, useMemo } from "react";
import type { Answer, Score } from "@/lib/types";

export function useAnswerManagement() {
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);

  const updateAnswer = useCallback((step: "user" | "partner", questionId: number, score: Score) => {
    const updateAnswers = (prev: Answer[]) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingIndex >= 0) {
        return prev.map((a, i) => (i === existingIndex ? { questionId, score } : a));
      }
      return [...prev, { questionId, score }];
    };

    if (step === "user") {
      setUserAnswers(updateAnswers);
    } else {
      setPartnerAnswers(updateAnswers);
    }
  }, []);

  const getAnswersMap = useCallback((answers: Answer[]) => {
    const map = new Map<number, Score>();
    answers.forEach((a) => {
      map.set(a.questionId, a.score);
    });
    return map;
  }, []);

  const getAnswerForQuestion = useCallback(
    (answers: Answer[], questionId: number): Score | null => {
      const map = getAnswersMap(answers);
      return map.get(questionId) ?? null;
    },
    [getAnswersMap]
  );

  return {
    userAnswers,
    partnerAnswers,
    updateAnswer,
    getAnswerForQuestion,
  };
}


