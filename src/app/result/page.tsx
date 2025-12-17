"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getPersonalityType } from "@/lib/calculate";
import type { PersonalityType } from "@/lib/types";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { Button } from "@/components/ui/button";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<PersonalityType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const score1 = parseInt(searchParams.get("score1") || "0", 10);
      const score2 = parseInt(searchParams.get("score2") || "0", 10);
      const score3 = parseInt(searchParams.get("score3") || "0", 10);

      if (isNaN(score1) || isNaN(score2) || isNaN(score3)) {
        setError("結果データが不正です");
        setLoading(false);
        return;
      }

      const user = getPersonalityType(score1, score2, score3, "18");
      setUserType(user);

    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-700">
        結果を計算中...
      </div>
    );
  }

  if (error || !userType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-gray-800">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p>{error || "結果を取得できませんでした"}</p>
          <Button onClick={() => router.push("/diagnose")}>
            診断に戻る
          </Button>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <DiagnosisResult
      type1={userType}
      shareUrl={shareUrl}
    />
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-700">
          結果を読み込み中...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
