"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import questionsData from "../../../../../data/diagnoses/compatibility-54/questions.json";
import type { Question, Answer, Score } from "@/lib/types";
import { calculateScores, getPersonalityType } from "@/lib/calculate";
import type { ParticipantRole, SessionResponsePayload } from "@/lib/session-store";
import { copyToClipboard } from "@/lib/clipboard";

const TOTAL_QUESTIONS = 54;
type Step = "user" | "partner";

function Compatibility54QuestionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");
  const participant = searchParams.get("role");
  const isValidParticipant = participant === "user" || participant === "partner";

  // セッションIDがあるが役割が指定されていない場合、自動的に役割を割り当て
  useEffect(() => {
    if (sessionId && !isValidParticipant) {
      console.log(`[QuestionsContent] 役割割り当て開始: sessionId=${sessionId}`);
      const assignRole = async () => {
        try {
          console.log(`[QuestionsContent] API呼び出し: /api/sessions/${sessionId}/assign-role`);
          const response = await fetch(`/api/sessions/${sessionId}/assign-role`, {
            method: "POST",
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[QuestionsContent] APIエラー:`, response.status, errorData);
            throw new Error(errorData.error || "役割の割り当てに失敗しました");
          }
          
          const data = await response.json();
          console.log(`[QuestionsContent] APIレスポンス:`, data);
          
          if (data.role) {
            // 役割が割り当てられたら、その役割でリダイレクト
            const redirectUrl = `/diagnoses/compatibility-54/questions?sessionId=${sessionId}&role=${data.role}`;
            console.log(`[QuestionsContent] リダイレクト: ${redirectUrl}`);
            router.replace(redirectUrl);
          } else {
            // 満員の場合はエラーページへ
            console.log(`[QuestionsContent] セッションが満員`);
            router.replace(`/diagnoses/compatibility-54/multi?error=full`);
          }
        } catch (err) {
          console.error("[QuestionsContent] 役割割り当てエラー:", err);
          router.replace(`/diagnoses/compatibility-54/multi?error=assign`);
        }
      };
      assignRole();
    }
  }, [sessionId, isValidParticipant, router]);

  if (sessionId && isValidParticipant) {
    return (
      <MultiDeviceQuestions
        sessionId={sessionId}
        participant={participant}
      />
    );
  }

  // 役割割り当て中の表示
  if (sessionId && !isValidParticipant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
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
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);
  const [questions] = useState<Question[]>(questionsData as Question[]);
  const [isTransitioningStep, setIsTransitioningStep] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

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
      setTimeout(() => {
        setStep("partner");
        setIsTransitioningStep(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 250);
    } else {
      if (partnerAnswers.length !== TOTAL_QUESTIONS || isCalculating) return;
      setIsCalculating(true);
      calculateResult(userAnswers, partnerAnswers);
    }
  };

  const getAnswerForQuestion = (questionId: number): Score | null => {
    const answer = currentAnswers.find((a) => a.questionId === questionId);
    return answer ? answer.score : null;
  };

  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* 背景エフェクト - 軽量化 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1a0033] to-[#000033]" />
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#ff006e] opacity-10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#00f5ff] opacity-10 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl space-y-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border-4 border-white/30 bg-gradient-to-r from-[#ff006e]/30 to-[#8338ec]/30 px-6 py-3 text-white">
            <span className="text-lg font-black">{step === "user" ? "自分の回答" : "パートナーの回答"}</span>
            <span className="text-sm font-black bg-white/20 px-3 py-1 rounded-full">{step === "user" ? "ステップ 1/2" : "ステップ 2/2"}</span>
          </div>
        </div>

        <div className="sticky top-0 z-20 -mx-4 border-b-4 border-white/30 bg-gradient-to-r from-[#8338ec]/40 to-[#ff006e]/40 px-4 py-6">
          <div className="mb-3 flex items-center justify-between text-lg text-white">
            <span className="font-black">
              回答済み {answeredCount} / {TOTAL_QUESTIONS}
            </span>
            <span className="font-black text-2xl bg-gradient-to-r from-[#ff006e] to-[#00f5ff] bg-clip-text text-transparent">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full border-2 border-white/30 bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6 pb-12">
          {questions.map((question, index) => {
            const currentAnswer = getAnswerForQuestion(question.id);
            const isAnswered = currentAnswer !== null;

            return (
              <div
                key={question.id}
                className={`rounded-[40px] border-4 p-6 text-white transition-all duration-200 ${
                  isAnswered 
                    ? "border-white/40 bg-gradient-to-br from-[#ff006e]/30 to-[#8338ec]/30" 
                    : "border-white/20 bg-gradient-to-br from-white/10 to-white/5"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-black sm:text-3xl leading-tight">
                    {question.text}
                  </h2>
                  <span className="ml-4 flex-shrink-0 rounded-full border-2 border-white/30 bg-gradient-to-r from-[#ff006e] to-[#8338ec] px-4 py-2 text-xs font-black text-white">
                    Q{index + 1}
                  </span>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = currentAnswer === option.score;

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(question.id, option.score)}
                        className={`w-full rounded-[30px] border-4 px-6 py-4 text-left text-base font-black transition-all duration-200 ${
                          isSelected
                            ? "border-white/50 bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white"
                            : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 space-y-4 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-white/60">徹底診断（54問・約7分）</p>
          {step === "user" ? (
            userAnswers.length === TOTAL_QUESTIONS ? (
              <div className="space-y-4 rounded-[40px] border-4 border-white/30 bg-gradient-to-r from-[#ff006e]/30 to-[#8338ec]/30 p-8">
                <p className="text-lg font-black text-white">
                  自分の回答がそろいました！<br />
                  内容に間違いがないか確認してからパートナーに渡してください。
                </p>
                <button
                  onClick={handleConfirmStep}
                  disabled={isTransitioningStep}
                  className="inline-flex w-full items-center justify-center rounded-full border-4 border-white bg-white px-8 py-4 text-lg font-black text-black transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  パートナーの回答に進む →
                </button>
              </div>
            ) : (
              <p className="text-sm font-bold text-white/70">すべて回答するとパートナーにバトンタッチできます</p>
            )
          ) : partnerAnswers.length === TOTAL_QUESTIONS ? (
            <div className="space-y-4 rounded-[40px] border-4 border-white/30 bg-gradient-to-r from-[#00f5ff]/30 to-[#8338ec]/30 p-8">
              <p className="text-lg font-black text-white">2人分の回答がそろいました！<br />診断結果を作成します</p>
              <button
                onClick={handleConfirmStep}
                disabled={isCalculating}
                className="inline-flex w-full items-center justify-center rounded-full border-4 border-white bg-gradient-to-r from-[#00f5ff] to-[#8338ec] px-8 py-4 text-lg font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
              >
                結果を表示
              </button>
            </div>
          ) : (
            <p className="text-sm font-bold text-white/70">パートナーの回答をすべて埋めてから結果へ進めます</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MultiDeviceQuestions({ sessionId, participant }: { sessionId: string; participant: ParticipantRole }) {
  const router = useRouter();
  const [questions] = useState<Question[]>(questionsData as Question[]);
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

  const updateLocalAnswers = useCallback((prev: Answer[], questionId: number, score: Score) => {
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
  }, []);

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

  const handleAnswer = async (questionId: number, score: Score) => {
    setAnswers((prev) => updateLocalAnswers(prev, questionId, score));
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
  };

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
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* 背景エフェクト - 軽量化 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1a0033] to-[#000033]" />
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#00f5ff] opacity-10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#8338ec] opacity-10 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl space-y-10">
        <div className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#00f5ff]/20 via-[#8338ec]/20 to-[#ff006e]/20 p-6">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="inline-flex items-center justify-center gap-3 rounded-full border-4 border-white/30 bg-gradient-to-r from-[#00f5ff]/30 to-[#8338ec]/30 px-6 py-3">
              <span className="text-lg font-black text-white">{participant === "user" ? "あなた" : "パートナー"}</span>
              <span className="text-xs font-black text-white/70 bg-white/20 px-3 py-1 rounded-full">セッションID {sessionId.slice(0, 8)}...</span>
            </div>
            <button
              onClick={handleCopyShareLink}
              className="rounded-full border-2 border-white/30 bg-white/10 px-4 py-2 text-sm font-black text-white hover:bg-white/20 transition-all"
            >
              相手用URLをコピー
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[30px] border-4 border-white/20 bg-gradient-to-br from-[#00f5ff]/20 to-white/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-2">あなたの進捗</p>
              <p className="text-4xl font-black bg-gradient-to-r from-[#00f5ff] to-[#8338ec] bg-clip-text text-transparent mb-1">{Math.round(progress)}%</p>
              <p className="text-sm text-white/70">{answeredCount} / {TOTAL_QUESTIONS}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00f5ff] to-[#8338ec] transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <div className="rounded-[30px] border-4 border-white/20 bg-gradient-to-br from-[#ff006e]/20 to-white/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-2">パートナーの進捗</p>
              <p className="text-4xl font-black bg-gradient-to-r from-[#ff006e] to-[#8338ec] bg-clip-text text-transparent mb-1">{Math.round(partnerProgress)}%</p>
              <p className="text-sm text-white/70">{partnerAnsweredCount} / {TOTAL_QUESTIONS}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] transition-all duration-500" style={{ width: `${partnerProgress}%` }}></div>
              </div>
              <p className="mt-2 text-xs font-black text-white/80">
                {sessionData?.participants[partnerRole].completed ? "回答完了" : "回答中"}
              </p>
            </div>
          </div>
          {error && (
            <p className="mt-4 text-center text-sm font-black text-white bg-red-500/20 border-2 border-red-500/50 rounded-[30px] px-4 py-3">
              {error}
            </p>
          )}
          {syncing && (
            <p className="mt-4 text-center text-xs font-black text-white/60">同期中...</p>
          )}
        </div>

        <div className="space-y-6 pb-16">
          {questions.map((question, index) => {
            const currentAnswer = answers.find((a) => a.questionId === question.id)?.score ?? null;
            const isAnswered = currentAnswer !== null;

            return (
              <div
                key={question.id}
                className={`rounded-[40px] border-4 p-6 text-white transition-all duration-200 ${
                  isAnswered 
                    ? "border-white/40 bg-gradient-to-br from-[#00f5ff]/30 to-[#8338ec]/30" 
                    : "border-white/20 bg-gradient-to-br from-white/10 to-white/5"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-black sm:text-3xl leading-tight">
                    {question.text}
                  </h2>
                  <span className="ml-4 flex-shrink-0 rounded-full border-2 border-white/30 bg-gradient-to-r from-[#00f5ff] to-[#8338ec] px-4 py-2 text-xs font-black text-white">
                    Q{index + 1}
                  </span>
                </div>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = currentAnswer === option.score;
                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(question.id, option.score)}
                        className={`w-full rounded-[30px] border-4 px-6 py-4 text-left text-base font-black transition-all duration-200 ${
                          isSelected
                            ? "border-white/50 bg-gradient-to-r from-[#00f5ff] to-[#8338ec] text-white"
                            : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 space-y-4 rounded-[40px] border-4 border-white/30 bg-gradient-to-r from-[#00f5ff]/30 to-[#8338ec]/30 p-8 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-white/60 mb-4">相性診断（54問） / セッション同期モード</p>
          {answers.length === TOTAL_QUESTIONS ? (
            <button
              onClick={handleComplete}
              disabled={isSubmittingComplete}
              className="inline-flex w-full items-center justify-center rounded-full border-4 border-white bg-gradient-to-r from-[#00f5ff] to-[#8338ec] px-8 py-5 text-lg font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingComplete ? "送信中..." : "あなたの回答を確定する"}
            </button>
          ) : (
            <p className="text-sm font-bold text-white/70">すべて回答すると自動で相手と同期されます。</p>
          )}
          {sessionData?.participants[participant].completed && !sessionData.readyForResult && (
            <p className="text-sm font-black text-white/80 mt-4">パートナーの回答を待っています...</p>
          )}
        </div>
      </div>
    </div>
  );
}
