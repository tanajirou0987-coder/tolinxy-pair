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

    if (step === 1) {
      // 新しい診断は毎回空の状態からスタート
      sessionStorage.removeItem(STORAGE_KEY);
      // setAnswersはマウント時に一度だけ呼ぶため、ルールを無効化
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers([]);
      return;
    }

    // 進行中の診断のみセッションストレージから回答を復元
    const savedAnswers = sessionStorage.getItem(STORAGE_KEY);
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers) as Answer[];
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error("Failed to parse saved answers:", error);
      }
    } else {
      setAnswers([]);
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
      <div className="flex min-h-screen items-center justify-center text-foreground">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/15 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-6 top-24 h-64 w-64 rounded-full bg-[#7ff6f225] blur-[150px]" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-72 w-72 rounded-full bg-[#9a8cff20] blur-[160px]" />

      <div className="relative mx-auto w-full max-w-3xl space-y-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <span className="text-[0.75rem] font-semibold text-white">quick scan</span>
            <span>
              {step}/{TOTAL_QUESTIONS}
            </span>
          </span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between text-sm text-white">
            <div className="font-semibold">
              質問 {step} / {TOTAL_QUESTIONS}
            </div>
            <div className="text-muted-foreground">{Math.round(progress)}%</div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-[#7ff6f2] to-[#9a8cff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={`rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] transition-opacity duration-300 sm:p-8 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-accent">balance board</p>
              <h2 className="serif-heading mt-2 text-2xl font-semibold text-white sm:text-3xl">{currentQuestion.text}</h2>
            </div>
            <span className="flex-shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Q{step}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.08] px-4 py-3 text-xs text-muted-foreground">
            サクッと終わるエンタメ診断。音色カードのようなUIで集中を途切れさせません。
          </div>
        </div>

        <p className="text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
          entertainment mode / 18 questions
        </p>
      </div>
    </div>
  );
}

export default function Compatibility18QuestionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-foreground">
          <p>読み込み中...</p>
        </div>
      }
    >
      <Compatibility18QuestionContent />
    </Suspense>
  );
}
