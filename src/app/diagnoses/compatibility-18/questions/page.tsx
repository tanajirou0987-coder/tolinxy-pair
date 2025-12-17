"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import questionsData from "../../../../../data/diagnoses/compatibility-18/questions.json";
import type { Question, Answer, Score } from "@/lib/types";
import { calculateScores, getPersonalityType } from "@/lib/calculate";

const TOTAL_QUESTIONS = 18;
type Step = "user" | "partner";

export default function Compatibility18QuestionsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("user");
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);
  const [questions] = useState<Question[]>(questionsData as Question[]);

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
    } else {
      setPartnerAnswers(newAnswers);
    }

    // 回答完了の処理は「回答完了」ボタンで行うため、ここでは自動遷移しない
  };
  
  const handleComplete = () => {
    if (answeredCount === TOTAL_QUESTIONS) {
      if (step === "user") {
        // ユーザーの回答完了 → パートナーのステップへ
        setStep("partner");
        // パートナーのステップにスクロール
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // パートナーの回答完了 → 結果を計算
        calculateResult(userAnswers, partnerAnswers);
      }
    }
  };

  const calculateResult = (userFinalAnswers: Answer[], partnerFinalAnswers: Answer[]) => {
    try {
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
      router.push("/diagnoses/compatibility-18");
    }
  };

  const getAnswerForQuestion = (questionId: number): Score | null => {
    const answer = currentAnswers.find((a) => a.questionId === questionId);
    return answer ? answer.score : null;
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-3xl space-y-10">
        {/* ステップ表示 */}
        <motion.div
          className="text-center"
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-foreground shadow-sm"
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="text-sm font-semibold"
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {step === "user" ? "自分の回答" : "パートナーの回答"}
            </motion.span>
            <motion.span
              className="text-xs text-muted-foreground"
              key={`step-${step}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {step === "user" ? "ステップ 1/2" : "ステップ 2/2"}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* プログレスバー */}
        <motion.div
          className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-2 flex items-center justify-between text-sm text-foreground">
            <motion.span
              className="font-semibold"
              key={`answered-count-${answeredCount}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              回答済み {answeredCount} / {TOTAL_QUESTIONS}
            </motion.span>
            <motion.span
              className="text-muted-foreground"
              key={`progress-${Math.round(progress)}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-dashed border-border bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="font-semibold text-foreground">回答方法</p>
          <p className="mt-2">このモードは1台の端末を交互に操作する仕様です。別々の端末で同時に進めたい場合は54問モードをご利用ください。</p>
        </motion.div>

        {/* すべての質問を表示 */}
        <div className={`space-y-6 ${answeredCount === TOTAL_QUESTIONS ? "pb-32" : "pb-10"}`}>
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-3xl border bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 ${
                  isAnswered ? "border-primary/50" : "border-border"
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <h2 className="serif-heading text-xl font-semibold text-foreground sm:text-2xl">
                    {question.text}
                  </h2>
                  <motion.span
                    className="ml-2 flex-shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                  >
                    質問 {index + 1}
                  </motion.span>
                </div>

                {/* 選択肢 */}
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = currentAnswer === option.score;

                    return (
                      <motion.button
                        key={optionIndex}
                        onClick={() => handleAnswer(question.id, option.score)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.05 + optionIndex * 0.05,
                          duration: 0.2,
                        }}
                        className={`w-full rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "border-transparent bg-primary text-primary-foreground shadow-md"
                            : "border-border bg-background/50 text-foreground hover:border-primary/50 hover:bg-secondary"
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* フッター */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            クイック診断（18問・約3分）
          </p>
        </motion.div>

        {/* 回答完了タブ */}
        <AnimatePresence>
          {answeredCount === TOTAL_QUESTIONS && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg"
            >
              <div className="mx-auto max-w-3xl px-4 py-4">
                <div className="flex items-center justify-between gap-4 text-foreground">
                  <div className="flex-1">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold uppercase tracking-[0.2em]">
                        step
                      </span>
                      <div>
                        <p className="text-sm font-semibold">
                          {step === "user"
                            ? "自分の回答が完了しました！"
                            : "すべての質問に回答しました！"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step === "user" ? "次はパートナーの回答です" : "結果を確認しましょう"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  <motion.button
                    onClick={handleComplete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/80"
                  >
                    {step === "user" ? "次へ進む" : "結果を見る"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
