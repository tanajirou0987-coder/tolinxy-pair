"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "../../../../data/questions.json";
import type { Question, Answer, Score } from "@/lib/types";

const TOTAL_QUESTIONS = 18;

export default function Diagnose18QPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions] = useState<Question[]>(questionsData as Question[]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;

  const handleAnswer = (score: Score) => {
    if (isAnimating) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      score,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // アニメーション
    setIsAnimating(true);

    // 次の質問へ
    setTimeout(() => {
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
      } else {
        // 最後の質問が終わったら結果を計算
        calculateResult(newAnswers);
      }
    }, 300);
  };

  const calculateResult = (finalAnswers: Answer[]) => {
    // 各軸のスコアを計算
    const communicationScore = finalAnswers
      .filter((a) => a.questionId >= 1 && a.questionId <= 6)
      .reduce((sum, a) => sum + a.score, 0);

    const decisionScore = finalAnswers
      .filter((a) => a.questionId >= 7 && a.questionId <= 12)
      .reduce((sum, a) => sum + a.score, 0);

    const relationshipScore = finalAnswers
      .filter((a) => a.questionId >= 13 && a.questionId <= 18)
      .reduce((sum, a) => sum + a.score, 0);

    // タイプを決定（簡易版：後でtypes_18q.jsonから取得する実装に変更）
    // とりあえずスコアから簡易的にタイプを決定
    const type = determineType(communicationScore, decisionScore, relationshipScore);

    // 結果ページへ遷移
    const params = new URLSearchParams({
      type,
      score1: communicationScore.toString(),
      score2: decisionScore.toString(),
      score3: relationshipScore.toString(),
    });

    router.push(`/result?${params.toString()}`);
  };

  // 簡易的なタイプ決定ロジック（後でtypes_18q.jsonから取得する実装に変更）
  const determineType = (
    commScore: number,
    decScore: number,
    relScore: number
  ): string => {
    // 各軸の傾向を判定
    const commType = commScore > 3 ? "積極" : commScore < -3 ? "受容" : "バランス";
    const decType = decScore > 3 ? "論理" : decScore < -3 ? "感情" : "ハイブリッド";
    const relType = relScore > 3 ? "リード" : relScore < -3 ? "寄り添い" : "対等";

    // タイプコードを生成（簡易版）
    return `type_${commType}_${decType}_${relType}`;
  };

  if (!currentQuestion) {
    return (
      <div className="pairly-legacy flex min-h-screen items-center justify-center bg-[#fefcf8]">
        <p className="text-[#2f2722]">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="pairly-legacy relative min-h-screen overflow-hidden bg-[#fefcf8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-4 top-12 h-32 rounded-3xl border border-white/70 bg-white/70 shadow-[0_25px_70px_rgba(187,106,147,0.14)] backdrop-blur" />
      <div className="pointer-events-none absolute left-[-20px] top-16 h-48 w-48 rounded-full bg-[#ffe0ef]/70 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-10px] top-6 h-44 w-44 rounded-full bg-[#c3f5ea]/70 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-3xl space-y-8">
        {/* プログレスバー */}
        <div className="rounded-3xl border border-[#f3dbe8] bg-white/95 px-5 py-4 shadow-[0_20px_60px_rgba(187,106,147,0.12)]">
          <div className="flex items-center justify-between text-sm text-[#2f2722]">
            <span className="font-semibold">
              質問 {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
            </span>
            <span className="text-[#8c857a]">{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#f0e7db]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d9b49c] via-[#e7d8c8] to-[#c3d4ce]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div
          className={`rounded-[32px] border border-[#f3dbe8] bg-white/95 p-6 shadow-[0_25px_70px_rgba(187,106,147,0.12)] transition-opacity duration-300 sm:p-8 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#c06286]">balance board</p>
              <h2 className="serif-heading mt-2 text-2xl font-semibold text-[#2f2722] sm:text-3xl">
                {currentQuestion.text}
              </h2>
            </div>
            <span className="flex-shrink-0 rounded-full border border-[#f5dcec] bg-[#fff0f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#c06286]">
              Q{currentQuestionIndex + 1}
            </span>
          </div>

          {/* 選択肢 */}
          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className="w-full rounded-2xl border border-[#ede3d8] bg-white/90 px-5 py-4 text-left text-sm font-semibold text-[#2f2722] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9b49c] hover:bg-[#f9f4ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b49c]"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-[#f3dbe8] bg-[#fff1f7] px-4 py-3 text-xs text-[#b04d77]">
            回答ごとに2人の気分メモがたまっていくので、あとで見返しても思い出しやすい設計です。
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-xs uppercase tracking-[0.35em] text-[#c06286]">
          entertainment mode / 18 questions
        </p>
      </div>
    </div>
  );
}
