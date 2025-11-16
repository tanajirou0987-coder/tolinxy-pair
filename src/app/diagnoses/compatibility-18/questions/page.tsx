"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import questionsData from "../../../../../data/diagnoses/compatibility-18/questions.json";
import type { Question, Answer, Score } from "@/lib/types";
import { calculateScores, getPersonalityType } from "@/lib/calculate";

const TOTAL_QUESTIONS = 18;
const STORAGE_KEY_USER = "compatibility-18-answers-user";
const STORAGE_KEY_PARTNER = "compatibility-18-answers-partner";

type Step = "user" | "partner";

export default function Compatibility18QuestionsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("user");
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);
  const [questions] = useState<Question[]>(questionsData as Question[]);

  // セッションストレージから回答を復元
  useEffect(() => {
    const savedUserAnswers = sessionStorage.getItem(STORAGE_KEY_USER);
    const savedPartnerAnswers = sessionStorage.getItem(STORAGE_KEY_PARTNER);
    
    if (savedUserAnswers) {
      try {
        const parsed = JSON.parse(savedUserAnswers) as Answer[];
        setUserAnswers(parsed);
        // ユーザーの回答が完了している場合は、パートナーのステップへ
        if (parsed.length === TOTAL_QUESTIONS) {
          setStep("partner");
        }
      } catch (error) {
        console.error("Failed to parse saved user answers:", error);
      }
    }
    
    if (savedPartnerAnswers) {
      try {
        const parsed = JSON.parse(savedPartnerAnswers) as Answer[];
        setPartnerAnswers(parsed);
      } catch (error) {
        console.error("Failed to parse saved partner answers:", error);
      }
    }
  }, []);

  // 現在のステップの回答
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

    // ステップに応じて回答を更新
    if (step === "user") {
      setUserAnswers(newAnswers);
      sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newAnswers));
    } else {
      setPartnerAnswers(newAnswers);
      sessionStorage.setItem(STORAGE_KEY_PARTNER, JSON.stringify(newAnswers));
    }

    // すべての質問に回答したら次のステップへ、または結果を計算
    if (newAnswers.length === TOTAL_QUESTIONS) {
      if (step === "user") {
        // ユーザーの回答完了 → パートナーのステップへ
        setTimeout(() => {
          setStep("partner");
        }, 300);
      } else {
        // パートナーの回答完了 → 結果を計算
        setTimeout(() => {
          calculateResult(userAnswers, newAnswers);
        }, 300);
      }
    }
  };

  const calculateResult = (userFinalAnswers: Answer[], partnerFinalAnswers: Answer[]) => {
    try {
      // セッションストレージをクリア
      sessionStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem(STORAGE_KEY_PARTNER);

      // ユーザーのスコアとタイプを計算
      const userScores = calculateScores(userFinalAnswers, 18);
      const userType = getPersonalityType(
        userScores.axis1,
        userScores.axis2,
        userScores.axis3,
        "18"
      );

      // パートナーのスコアとタイプを計算
      const partnerScores = calculateScores(partnerFinalAnswers, 18);
      const partnerType = getPersonalityType(
        partnerScores.axis1,
        partnerScores.axis2,
        partnerScores.axis3,
        "18"
      );

      // 結果ページへ遷移
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
      sessionStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem(STORAGE_KEY_PARTNER);
      router.push("/diagnoses/compatibility-18");
    }
  };

  const getAnswerForQuestion = (questionId: number): Score | null => {
    const answer = currentAnswers.find((a) => a.questionId === questionId);
    return answer ? answer.score : null;
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* ステップ表示 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2C3E50]/10 px-4 py-2">
            <span className="text-sm font-medium text-[#2C3E50]">
              {step === "user" ? "あなたの回答" : "相手の回答"}
            </span>
            <span className="text-xs text-[#2C3E50]/60">
              {step === "user" ? "ステップ 1/2" : "ステップ 2/2"}
            </span>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-8 sticky top-0 bg-white z-10 pt-4 pb-4 border-b border-[#2C3E50]/10">
          <div className="mb-2 flex items-center justify-between text-sm text-[#2C3E50]">
            <span className="font-semibold">
              回答済み {answeredCount} / {TOTAL_QUESTIONS}
            </span>
            <span className="text-[#2C3E50]/60">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#2C3E50]/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* すべての質問を表示 */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;

            return (
              <div
                key={question.id}
                className={`rounded-lg border-2 bg-white p-6 shadow-lg transition-all duration-200 ${
                  isAnswered
                    ? "border-[#F39C12] bg-[#F39C12]/5"
                    : "border-[#2C3E50]/20"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-[#2C3E50] sm:text-xl">
                    {question.text}
                  </h2>
                  <span className="ml-4 flex-shrink-0 rounded-full bg-[#2C3E50]/10 px-3 py-1 text-xs font-medium text-[#2C3E50]">
                    質問 {index + 1}
                  </span>
                </div>

                {/* 選択肢 */}
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = currentAnswer === option.score;

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(question.id, option.score)}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-[#F39C12] bg-[#F39C12] text-white shadow-md"
                            : "border-[#2C3E50]/20 bg-white text-[#2C3E50] hover:border-[#F39C12] hover:bg-[#F39C12]/5"
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* フッター */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#2C3E50]/60">
            クイック診断（18問・約3分）
          </p>
          {answeredCount === TOTAL_QUESTIONS && step === "user" && (
            <p className="mt-2 text-sm font-medium text-[#F39C12]">
              あなたの回答が完了しました。次は相手の回答です。
            </p>
          )}
          {answeredCount === TOTAL_QUESTIONS && step === "partner" && (
            <p className="mt-2 text-sm font-medium text-[#F39C12]">
              すべての質問に回答しました。結果を計算中...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

