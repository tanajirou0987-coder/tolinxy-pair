"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "../../../../../data/diagnoses/compatibility-18/questions.json";
import type { Question, Answer, Score } from "@/lib/types";
import { calculateScores, getPersonalityType } from "@/lib/calculate";
import { QuestionCard } from "@/components/diagnoses/QuestionCard";
import { Button } from "@/components/ui/button";

const TOTAL_QUESTIONS = 18;
type Step = "user" | "partner";

export default function Compatibility18QuestionsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("user");
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);
  const [questions] = useState<Question[]>(questionsData as Question[]);

  const currentAnswers = step === "user" ? userAnswers : partnerAnswers;
  const answeredCount = currentAnswers.length;
  const progress = (answeredCount / TOTAL_QUESTIONS) * 100;

  const handleAnswer = (questionId: number, score: Score) => {
    const existingAnswerIndex = currentAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    const newAnswer: Answer = {
      questionId,
      score,
    };

    const newAnswers =
      existingAnswerIndex >= 0
        ? currentAnswers.map((a, i) => (i === existingAnswerIndex ? newAnswer : a))
        : [...currentAnswers, newAnswer];

    if (step === "user") {
      setUserAnswers(newAnswers);
    } else {
      setPartnerAnswers(newAnswers);
    }
  };
  
  const handleComplete = () => {
    if (answeredCount === TOTAL_QUESTIONS) {
      if (step === "user") {
        setStep("partner");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        calculateResult(userAnswers, partnerAnswers);
      }
    }
  };

  const calculateResult = (userFinalAnswers: Answer[], partnerFinalAnswers: Answer[]) => {
    try {
      const userScores = calculateScores(userFinalAnswers, 18);
      const userType = getPersonalityType(
        userScores.axis1,
        userScores.axis2,
        userScores.axis3,
        "18"
      );

      const partnerScores = calculateScores(partnerFinalAnswers, 18);
      const partnerType = getPersonalityType(
        partnerScores.axis1,
        partnerScores.axis2,
        partnerScores.axis3,
        "18"
      );

      const params = new URLSearchParams({
        type: userType.type,
        score1: userScores.axis1.toString(),
        score2: userScores.axis2.toString(),
        score3: userScores.axis3.toString(),
        partnerType: partnerType.type,
        partnerScore1: partnerScores.axis1.toString(),
        partnerScore2: partnerScores.axis2.toString(),
        partnerScore3: partnerScores.axis3.toString(),
        diagnosis: "compatibility-18",
      });

      router.push(`/diagnoses/compatibility-18/result?${params.toString()}`);
    } catch (error) {
      console.error("Error calculating result:", error);
      router.push("/diagnoses/compatibility-18");
    }
  };

  const getAnswerForQuestion = (questionId: number): Score | null => {
    const answer = currentAnswers.find((a) => a.questionId === questionId);
    return answer ? answer.score : null;
  };

  return (
    <div className="relative min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      {/* トップページに戻るボタン */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end px-6 pt-6">
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="pointer-events-auto rounded-[16px] border border-black bg-white px-5 py-2 text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-gray-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          トップに戻る
        </Button>
      </div>

      {/* スマホ用レイアウト */}
      <div className="relative mx-auto w-full max-w-md space-y-10 md:hidden">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-[16px] border border-black bg-[#fbf7d5] px-6 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step === "user" ? "自分の回答" : "パートナーの回答"}</span>
            <span className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal bg-white px-3 py-1 rounded-[16px] border border-black text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step === "user" ? "1/2" : "2/2"}</span>
          </div>
        </div>

        <div className="sticky top-0 z-20 -mx-4 border-b border-black bg-white px-4 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <div className="mb-3 flex items-center justify-between text-lg">
            <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              回答済み {answeredCount} / {TOTAL_QUESTIONS}
            </span>
            <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full border border-black bg-white">
            <div
              className="h-full rounded-full bg-[#e2bef1] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`space-y-2.5 ${answeredCount === TOTAL_QUESTIONS ? "pb-32" : "pb-10"}`}>
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;

            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                currentAnswer={currentAnswer}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
                step={step}
              />
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-wider text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            クイック診断（18問・約3分）
          </p>
        </div>

        {answeredCount === TOTAL_QUESTIONS && (
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
              <div className="mx-auto max-w-md px-4 py-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {step === "user"
                            ? "自分の回答が完了しました！"
                            : "すべての質問に回答しました！"}
                        </p>
                        <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {step === "user" ? "次はパートナーの回答です" : "結果を確認しましょう"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleComplete}
                    className="rounded-[16px] border border-black bg-[#e2bef1] px-8 py-4 text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition-all shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:scale-105"
                  >
                    {step === "user" ? "次へ進む →" : "結果を見る"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* PC用レイアウト */}
      <div className="hidden md:block relative mx-auto w-full max-w-7xl space-y-10">
        {/* トップページに戻るボタン（PC用） */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end px-8 pt-8">
          <Button
            type="button"
            onClick={() => router.push("/")}
            className="pointer-events-auto rounded-[16px] border border-black bg-white px-6 py-3 text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-gray-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          >
            トップに戻る
          </Button>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-[16px] border border-black bg-[#fbf7d5] px-8 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step === "user" ? "自分の回答" : "パートナーの回答"}</span>
            <span className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal bg-white px-4 py-2 rounded-[16px] border border-black text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step === "user" ? "ステップ 1/2" : "ステップ 2/2"}</span>
          </div>
        </div>

        <div className="sticky top-0 z-20 border-b border-black bg-white px-8 py-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <div className="mb-4 flex items-center justify-between text-xl">
            <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              回答済み {answeredCount} / {TOTAL_QUESTIONS}
            </span>
            <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{Math.round(progress)}%</span>
          </div>
          <div className="h-6 w-full overflow-hidden rounded-full border border-black bg-white">
            <div
              className="h-full rounded-full bg-[#e2bef1] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`space-y-4 ${answeredCount === TOTAL_QUESTIONS ? "pb-32" : "pb-10"}`}>
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;

            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                currentAnswer={currentAnswer}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
                step={step}
              />
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-wider text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            クイック診断（18問・約3分）
          </p>
        </div>

        {answeredCount === TOTAL_QUESTIONS && (
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
              <div className="mx-auto max-w-7xl px-8 py-8">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {step === "user"
                            ? "自分の回答が完了しました！"
                            : "すべての質問に回答しました！"}
                        </p>
                        <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {step === "user" ? "次はパートナーの回答です" : "結果を確認しましょう"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleComplete}
                    className="rounded-[16px] border border-black bg-[#e2bef1] px-12 py-6 text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition-all shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:scale-105"
                  >
                    {step === "user" ? "次へ進む →" : "結果を見る"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
