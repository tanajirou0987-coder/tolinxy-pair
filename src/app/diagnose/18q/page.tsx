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
              質問 {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
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
