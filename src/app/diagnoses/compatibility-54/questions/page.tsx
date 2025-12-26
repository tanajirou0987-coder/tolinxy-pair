"use client";

import { useCallback, useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import questionsData from "../../../../../data/diagnoses/compatibility-54/questions.json";
import type { Question, Answer, Score } from "@/lib/types";
import { calculateScores, getPersonalityType } from "@/lib/calculate";
import type { ParticipantRole, SessionResponsePayload } from "@/lib/session-store";
import { copyToClipboard } from "@/lib/clipboard";
import { useSessionAssignment } from "@/hooks/useSessionAssignment";
import { BackgroundEffect } from "@/components/diagnoses/BackgroundEffect";
import { LazyQuestionCard } from "@/components/diagnoses/LazyQuestionCard";
import { ProgressBar } from "@/components/diagnoses/ProgressBar";
import { StepHeader } from "@/components/diagnoses/StepHeader";
import { CompletionSection } from "@/components/diagnoses/CompletionSection";
import { useAnswerManagement } from "@/hooks/useAnswerManagement";
import { Button } from "@/components/ui/button";

const TOTAL_QUESTIONS = 54;
type Step = "user" | "partner";

function Compatibility54QuestionsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const participant = searchParams.get("role") as ParticipantRole | null;

  const { isAssigning, isValidParticipant } = useSessionAssignment({
    sessionId,
    participant,
  });

  if (sessionId && isValidParticipant && participant) {
    return (
      <MultiDeviceQuestions
        sessionId={sessionId}
        participant={participant}
      />
    );
  }

  // 役割割り当て中の表示
  if (sessionId && isAssigning) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BackgroundEffect />
        <div className="text-center relative z-10">
          <p className="text-white text-lg font-black mb-2">参加中...</p>
          <p className="text-white/70 text-sm">役割を割り当てています</p>
        </div>
      </div>
    );
  }

  return <SingleDeviceQuestions />;
}

export default function Compatibility54QuestionsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white">読み込み中...</p>
      </div>
    }>
      <Compatibility54QuestionsContent />
    </Suspense>
  );
}

function SingleDeviceQuestions() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("user");
  const { userAnswers, partnerAnswers, updateAnswer, getAnswerForQuestion } = useAnswerManagement();
  // 質問データをメモ化（ビルド時に最適化される）
  const questions = useMemo(() => questionsData as Question[], []);
  const [isTransitioningStep, setIsTransitioningStep] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // トランジション中は前のステップの回答数を保持
  const currentAnswers = step === "user" ? userAnswers : partnerAnswers;
  const answeredCount = currentAnswers.length;

  const handleAnswer = useCallback((questionId: number, score: Score) => {
    updateAnswer(step, questionId, score);
  }, [step, updateAnswer]);

  const calculateResult = (userFinalAnswers: Answer[], partnerFinalAnswers: Answer[]) => {
    try {
      const userScores = calculateScores(userFinalAnswers, 54);
      const userType = getPersonalityType(
        userScores.axis1,
        userScores.axis2,
        userScores.axis3,
        "54"
      );

      const partnerScores = calculateScores(partnerFinalAnswers, 54);
      const partnerType = getPersonalityType(
        partnerScores.axis1,
        partnerScores.axis2,
        partnerScores.axis3,
        "54"
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
        diagnosis: "compatibility-54",
      });

      router.push(`/diagnoses/compatibility-54/result?${params.toString()}`);
    } catch (error) {
      console.error("Error calculating result:", error);
      router.push("/diagnoses/compatibility-54");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleConfirmStep = () => {
    if (step === "user") {
      if (userAnswers.length !== TOTAL_QUESTIONS || isTransitioningStep) return;
      setIsTransitioningStep(true);
      // まず即座にトップにスクロール
      window.scrollTo({ top: 0, behavior: "instant" });
      // スクロール完了を待ってからステップを変更
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStep("partner");
          // ステップ変更後、レンダリング完了を待ってからトップにスクロール
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            // スクロール完了後にトランジション状態を解除
            setTimeout(() => {
              setIsTransitioningStep(false);
            }, 500);
          }, 50);
        });
      });
    } else {
      if (partnerAnswers.length !== TOTAL_QUESTIONS || isCalculating) return;
      setIsCalculating(true);
      calculateResult(userAnswers, partnerAnswers);
    }
  };

  // ステップが変更されたときに確実にトップにスクロール
  useEffect(() => {
    if (step === "partner") {
      // レンダリング完了後に確実にトップにスクロール
      const timer1 = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 0);
      const timer2 = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [step]);


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* 装飾的な背景要素 - Soft UIスタイル */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>
      {/* トップに戻るボタン */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end px-4 pt-4 md:px-8 md:pt-8">
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="pointer-events-auto rounded-[16px] border border-black bg-white px-5 py-2 text-sm md:px-6 md:py-3 md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-gray-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          トップに戻る
        </Button>
      </div>
      {/* スマホ用レイアウト */}
      <div className="relative z-10 mx-auto w-full max-w-md space-y-10 md:hidden">
        <StepHeader step={step} variant="mobile" />
        <ProgressBar answeredCount={answeredCount} totalQuestions={TOTAL_QUESTIONS} variant="mobile" />

        <div className="space-y-2.5 pb-8">
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(currentAnswers, question.id);
            const isAnswered = currentAnswer !== null;
            // 最初の5問と回答済みの質問は優先的にレンダリング
            const priority = index < 5 || isAnswered;

            return (
              <LazyQuestionCard
                key={`${step}-${question.id}`}
                question={question}
                index={index}
                currentAnswer={currentAnswer}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
                step={step}
                priority={priority}
              />
            );
          })}
        </div>

        <div className="mt-12 space-y-4 text-center">
          <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-wider text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">徹底診断（54問・約7分）</p>
          <CompletionSection
            step={step}
            answeredCount={step === "user" ? userAnswers.length : partnerAnswers.length}
            totalQuestions={TOTAL_QUESTIONS}
            onConfirm={handleConfirmStep}
            isTransitioning={isTransitioningStep}
            isCalculating={isCalculating}
            variant="mobile"
          />
        </div>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden md:block relative z-10 mx-auto w-full max-w-7xl space-y-10">
        <StepHeader step={step} variant="desktop" />
        <ProgressBar answeredCount={answeredCount} totalQuestions={TOTAL_QUESTIONS} variant="desktop" />

        <div className="space-y-4 pb-8">
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(currentAnswers, question.id);
            const isAnswered = currentAnswer !== null;
            const priority = index < 5 || isAnswered;

            return (
              <LazyQuestionCard
                key={`${step}-${question.id}`}
                question={question}
                index={index}
                currentAnswer={currentAnswer}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
                step={step}
                priority={priority}
              />
            );
          })}
        </div>

        <div className="mt-12 space-y-4 text-center">
          <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-wider text-black/60 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">徹底診断（54問・約7分）</p>
          <CompletionSection
            step={step}
            answeredCount={step === "user" ? userAnswers.length : partnerAnswers.length}
            totalQuestions={TOTAL_QUESTIONS}
            onConfirm={handleConfirmStep}
            isTransitioning={isTransitioningStep}
            isCalculating={isCalculating}
            variant="desktop"
          />
        </div>
      </div>
    </div>
  );
}

function MultiDeviceQuestions({ sessionId, participant }: { sessionId: string; participant: ParticipantRole }) {
  const router = useRouter();
  // 質問データをメモ化（ビルド時に最適化される）
  const questions = useMemo(() => questionsData as Question[], []);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sessionData, setSessionData] = useState<SessionResponsePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [isSubmittingComplete, setIsSubmittingComplete] = useState(false);

  const partnerRole: ParticipantRole = participant === "user" ? "partner" : "user";
  const answeredCount = answers.length;
  const progress = (answeredCount / TOTAL_QUESTIONS) * 100;
  const partnerAnsweredCount = sessionData?.participants[partnerRole].answers.length ?? 0;
  const partnerProgress = (partnerAnsweredCount / TOTAL_QUESTIONS) * 100;

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/diagnoses/compatibility-54/questions?sessionId=${sessionId}&role=${partnerRole}`
      : "";

  // 回答をMapに変換して高速検索
  const answersMap = useMemo(() => {
    const map = new Map<number, Score>();
    answers.forEach((a) => {
      map.set(a.questionId, a.score);
    });
    return map;
  }, [answers]);

  const getAnswerForQuestion = useCallback((questionId: number): Score | null => {
    return answersMap.get(questionId) ?? null;
  }, [answersMap]);

  const fetchSession = useCallback(
    async (quiet = false) => {
      if (!quiet) setSyncing(true);
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error("セッションの取得に失敗しました");
        }
        const data: SessionResponsePayload = await response.json();
        setSessionData(data);
        setAnswers(data.participants[participant].answers);
        setError(null);

        if (data.readyForResult && data.resultParams) {
          router.push(`/diagnoses/compatibility-54/result?${data.resultParams}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "同期に失敗しました");
      } finally {
        if (!quiet) setSyncing(false);
      }
    },
    [participant, router, sessionId]
  );

  useEffect(() => {
    fetchSession();
    const interval = setInterval(() => {
      fetchSession(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchSession]);

  const handleAnswer = useCallback(async (questionId: number, score: Score) => {
    // 楽観的更新（UIを即座に更新）
    setAnswers((prev) => {
      const next = [...prev];
      const index = next.findIndex((answer) => answer.questionId === questionId);
      const answer: Answer = { questionId, score };
      if (index >= 0) {
        next[index] = answer;
      } else {
        next.push(answer);
      }
      next.sort((a, b) => a.questionId - b.questionId);
      return next;
    });

    // サーバーに保存
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant, questionId, score }),
      });
      if (!response.ok) {
        throw new Error("回答の保存に失敗しました");
      }
      const data: SessionResponsePayload = await response.json();
      setSessionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "回答を保存できませんでした");
    }
  }, [sessionId, participant]);

  const handleComplete = async () => {
    if (answers.length !== TOTAL_QUESTIONS || isSubmittingComplete) return;
    setIsSubmittingComplete(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant, completed: true }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || "回答の同期に失敗しました");
      }
      const data: SessionResponsePayload = await response.json();
      setSessionData(data);
      if (data.readyForResult && data.resultParams) {
        router.push(`/diagnoses/compatibility-54/result?${data.resultParams}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "回答の同期に失敗しました");
    } finally {
      setIsSubmittingComplete(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareLink) return;
    const copied = await copyToClipboard(shareLink);
    if (!copied) {
      alert("コピーに失敗しました。リンクを長押ししてください。");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* 装飾的な背景要素 - Soft UIスタイル */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>
      {/* トップに戻るボタン */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end px-4 pt-4 md:px-8 md:pt-8">
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="pointer-events-auto rounded-[16px] border border-black bg-white px-5 py-2 text-sm md:px-6 md:py-3 md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-gray-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          トップに戻る
        </Button>
      </div>
      {/* スマホ用レイアウト */}
      <div className="relative z-10 mx-auto w-full max-w-md space-y-10 md:hidden">
        <div className="rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-2xl p-4 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]">
          <div className="flex flex-col gap-3 text-center mb-4">
            <div className="inline-flex items-center justify-center gap-2 rounded-[32px] border border-white/70 bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90 backdrop-blur-md px-4 py-2 shadow-[0px_12px_32px_rgba(255,182,193,0.3),0px_6px_16px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]">
              <span className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">{participant === "user" ? "あなた" : "パートナー"}</span>
              <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold bg-white/95 rounded-[20px] border border-white/80 text-gray-900 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] px-2 py-0.5">ID {sessionId.slice(0, 6)}</span>
            </div>
            <button
              onClick={handleCopyShareLink}
              className="rounded-[24px] border border-white/70 bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 hover:bg-white/95 shadow-[0px_8px_24px_rgba(0,0,0,0.08),0px_4px_12px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] transition-all duration-300 hover:scale-105"
            >
              URLコピー
            </button>
          </div>
          <div className="grid gap-3 grid-cols-2">
            <div className="rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-lg p-4 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
              <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-600 mb-1 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">あなたの進捗</p>
              <p className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-1 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{Math.round(progress)}%</p>
              <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{answeredCount} / {TOTAL_QUESTIONS}</p>
              <div className="h-2 w-full overflow-hidden rounded-full border border-white/70 bg-white/80 backdrop-blur-sm">
                <div className="h-full rounded-full bg-gradient-to-r from-pink-300/90 via-pink-200/90 to-pink-300/90 transition-all duration-300 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6)]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-lg p-4 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
              <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-600 mb-1 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">パートナーの進捗</p>
              <p className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-1 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{Math.round(partnerProgress)}%</p>
              <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{partnerAnsweredCount} / {TOTAL_QUESTIONS}</p>
              <div className="h-2 w-full overflow-hidden rounded-full border border-white/70 bg-white/80 backdrop-blur-sm">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-300/90 via-sky-200/90 to-sky-300/90 transition-all duration-300 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6)]" style={{ width: `${partnerProgress}%` }}></div>
              </div>
              <p className="mt-1 text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                {sessionData?.participants[partnerRole].completed ? "完了" : "回答中"}
              </p>
            </div>
          </div>
          {error && (
            <p className="mt-3 text-center text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 bg-red-100/90 backdrop-blur-sm border border-red-300/70 rounded-[24px] px-3 py-2 shadow-[0px_8px_24px_rgba(239,68,68,0.15),0px_4px_12px_rgba(239,68,68,0.1),inset_0px_1px_0px_rgba(255,255,255,0.6)] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
              {error}
            </p>
          )}
          {syncing && (
            <p className="mt-3 text-center text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-600 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">同期中...</p>
          )}
        </div>

        <div className="space-y-2.5 pb-8">
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;
            // 最初の5問と回答済みの質問は優先的にレンダリング
            const priority = index < 5 || isAnswered;

            return (
              <LazyQuestionCard
                key={question.id}
                question={question}
                index={index}
                currentAnswer={currentAnswer}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
                step={participant === "user" ? "user" : "partner"}
                priority={priority}
              />
            );
          })}
        </div>

        <div className="mt-12 space-y-4 rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90 backdrop-blur-2xl p-8 text-center shadow-[0px_24px_64px_rgba(255,182,193,0.25),0px_12px_32px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]">
          <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.3em] text-gray-600 mb-4 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">相性診断（54問） / セッション同期モード</p>
          {answers.length === TOTAL_QUESTIONS ? (
            <button
              onClick={handleComplete}
              disabled={isSubmittingComplete}
              className="inline-flex w-full items-center justify-center rounded-[32px] border border-white/60 bg-white/95 backdrop-blur-md px-6 py-3 text-base font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_12px_40px_rgba(0,0,0,0.12),0px_6px_20px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_16px_50px_rgba(0,0,0,0.16),0px_8px_25px_rgba(0,0,0,0.12),inset_0px_1px_0px_rgba(255,255,255,1)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
            >
              {isSubmittingComplete ? "送信中..." : "回答を確定する"}
            </button>
          ) : (
            <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">すべて回答すると自動で相手と同期されます。</p>
          )}
          {sessionData?.participants[participant].completed && !sessionData.readyForResult && (
            <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mt-2 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">パートナーの回答を待っています...</p>
          )}
        </div>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden md:block relative z-10 mx-auto w-full max-w-7xl space-y-10">
        <div className="rounded-[32px] border border-white/70 bg-white/85 backdrop-blur-lg p-6 shadow-[0px_16px_48px_rgba(0,0,0,0.1),0px_8px_24px_rgba(0,0,0,0.06),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="inline-flex items-center justify-center gap-2 rounded-[32px] border border-white/70 bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90 backdrop-blur-md px-6 py-3 shadow-[0px_12px_32px_rgba(255,182,193,0.3),0px_6px_16px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]">
              <span className="text-base font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">{participant === "user" ? "あなた" : "パートナー"}</span>
              <span className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold bg-white/95 rounded-[20px] border border-white/80 text-gray-900 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] px-3 py-1">ID {sessionId.slice(0, 6)}</span>
            </div>
            <button
              onClick={handleCopyShareLink}
              className="rounded-[24px] border border-white/70 bg-white/90 backdrop-blur-md px-4 py-2 text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 hover:bg-white/95 shadow-[0px_8px_24px_rgba(0,0,0,0.08),0px_4px_12px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] transition-all duration-300 hover:scale-105"
            >
              URLコピー
            </button>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-lg p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-600 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">あなたの進捗</p>
              <p className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{Math.round(progress)}%</p>
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mb-3 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{answeredCount} / {TOTAL_QUESTIONS}</p>
              <div className="h-3 w-full overflow-hidden rounded-full border border-white/70 bg-white/80 backdrop-blur-sm">
                <div className="h-full rounded-full bg-gradient-to-r from-pink-300/90 via-pink-200/90 to-pink-300/90 transition-all duration-300 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6)]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-lg p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-600 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">パートナーの進捗</p>
              <p className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{Math.round(partnerProgress)}%</p>
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mb-3 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{partnerAnsweredCount} / {TOTAL_QUESTIONS}</p>
              <div className="h-3 w-full overflow-hidden rounded-full border border-white/70 bg-white/80 backdrop-blur-sm">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-300/90 via-sky-200/90 to-sky-300/90 transition-all duration-300 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6)]" style={{ width: `${partnerProgress}%` }}></div>
              </div>
              <p className="mt-2 text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                {sessionData?.participants[partnerRole].completed ? "完了" : "回答中"}
              </p>
            </div>
          </div>
          {error && (
            <p className="mt-4 text-center text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 bg-red-100/90 backdrop-blur-sm border border-red-300/70 rounded-[24px] px-4 py-3 shadow-[0px_8px_24px_rgba(239,68,68,0.15),0px_4px_12px_rgba(239,68,68,0.1),inset_0px_1px_0px_rgba(255,255,255,0.6)] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
              {error}
            </p>
          )}
          {syncing && (
            <p className="mt-4 text-center text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-600 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">同期中...</p>
          )}
        </div>

        <div className="space-y-4 pb-8">
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;
            const priority = index < 5 || isAnswered;

            return (
              <LazyQuestionCard
                key={question.id}
                question={question}
                index={index}
                currentAnswer={currentAnswer}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
                step={participant === "user" ? "user" : "partner"}
                priority={priority}
              />
            );
          })}
        </div>

        <div className="mt-12 space-y-4 rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90 backdrop-blur-2xl p-10 text-center shadow-[0px_24px_64px_rgba(255,182,193,0.25),0px_12px_32px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]">
          <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.3em] text-gray-600 mb-5 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">相性診断（54問） / セッション同期モード</p>
          {answers.length === TOTAL_QUESTIONS ? (
            <button
              onClick={handleComplete}
              disabled={isSubmittingComplete}
              className="inline-flex w-full items-center justify-center rounded-[32px] border border-white/60 bg-white/95 backdrop-blur-md px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_12px_40px_rgba(0,0,0,0.12),0px_6px_20px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_16px_50px_rgba(0,0,0,0.16),0px_8px_25px_rgba(0,0,0,0.12),inset_0px_1px_0px_rgba(255,255,255,1)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
            >
              {isSubmittingComplete ? "送信中..." : "回答を確定する"}
            </button>
          ) : (
            <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">すべて回答すると自動で相手と同期されます。</p>
          )}
          {sessionData?.participants[participant].completed && !sessionData.readyForResult && (
            <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mt-3 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">パートナーの回答を待っています...</p>
          )}
        </div>
      </div>
    </div>
  );
}
