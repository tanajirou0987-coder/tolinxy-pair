"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import questionsData from "../../../../../data/diagnoses/compatibility-18/questions.json";
import type { Question, Answer, Score } from "@/lib/types";
import { calculateScores, getPersonalityType } from "@/lib/calculate";

const TOTAL_QUESTIONS = 18;

function Compatibility18QuestionContent() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string, 10);
  const questionIndex = step - 1;

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions] = useState<Question[]>(questionsData as Question[]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[questionIndex];
  const progress = (step / TOTAL_QUESTIONS) * 100;
  const STORAGE_KEY = "compatibility-18-answers";

  useEffect(() => {
    // ステップが範囲外の場合は開始ページにリダイレクト
    if (isNaN(step) || step < 1 || step > TOTAL_QUESTIONS) {
      router.push("/diagnoses/compatibility-18");
      return;
    }

    // セッションストレージから回答を読み込む
    const savedAnswers = sessionStorage.getItem(STORAGE_KEY);
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers) as Answer[];
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error("Failed to parse saved answers:", error);
      }
    }
  }, [step, router]);

  useEffect(() => {
    // 回答をセッションストレージに保存
    if (answers.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers]);

  const handleAnswer = (score: Score) => {
    if (isAnimating || !currentQuestion) return;

    // 既存の回答を確認し、同じ質問IDの回答があれば上書き
    const existingAnswerIndex = answers.findIndex(
      (a) => a.questionId === currentQuestion.id
    );

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      score,
    };

    const newAnswers =
      existingAnswerIndex >= 0
        ? answers.map((a, i) => (i === existingAnswerIndex ? newAnswer : a))
        : [...answers, newAnswer];

    setAnswers(newAnswers);

    // アニメーション
    setIsAnimating(true);

    // 次の質問へ
    setTimeout(() => {
      if (step < TOTAL_QUESTIONS) {
        router.push(`/diagnoses/compatibility-18/${step + 1}`);
        setIsAnimating(false);
      } else {
        // 最後の質問が終わったら結果を計算
        calculateResult([...answers, newAnswer]);
      }
    }, 300);
  };

  const calculateResult = (finalAnswers: Answer[]) => {
    try {
      // セッションストレージをクリア
      sessionStorage.removeItem(STORAGE_KEY);

      const scores = calculateScores(finalAnswers);
      const personalityType = getPersonalityType(
        scores.axis1,
        scores.axis2,
        scores.axis3
      );

      // 結果ページへ遷移
      const params = new URLSearchParams({
        type: personalityType.type,
        score1: scores.axis1.toString(),
        score2: scores.axis2.toString(),
        score3: scores.axis3.toString(),
        diagnosis: "compatibility-18",
      });

      router.push(`/diagnoses/compatibility-18/result?${params.toString()}`);
    } catch (error) {
      console.error("Error calculating result:", error);
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/diagnoses/compatibility-18");
    }
  };

  if (!currentQuestion || isNaN(step) || step < 1 || step > TOTAL_QUESTIONS) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#2C3E50]">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-[#2C3E50]">
            <span className="font-semibold">
              質問 {step} / {TOTAL_QUESTIONS}
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

        {/* 質問カード */}
        <div
          className={`mb-8 transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="rounded-lg border-2 border-[#2C3E50]/20 bg-white p-6 shadow-lg sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#2C3E50] sm:text-2xl">
              {currentQuestion.text}
            </h2>

            {/* 選択肢 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full rounded-lg border-2 border-[#2C3E50]/20 bg-white px-6 py-4 text-left text-[#2C3E50] transition-all duration-200 hover:border-[#F39C12] hover:bg-[#F39C12]/5 hover:shadow-md active:scale-95"
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-sm text-[#2C3E50]/60">
          エンタメ診断（18問・約3分）
        </p>
      </div>
    </div>
  );
}

export default function Compatibility18QuestionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[#2C3E50]">読み込み中...</p>
        </div>
      }
    >
      <Compatibility18QuestionContent />
    </Suspense>
  );
}

