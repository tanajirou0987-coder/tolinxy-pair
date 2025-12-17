"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  getPersonalityType,
  getCompatibilityFromTypes,
  generateCompatibilityMessageWithPercentile,
  getCompatibilityRank,
} from "@/lib/calculate";
import type { PersonalityType, Compatibility } from "@/lib/types";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { Button } from "@/components/ui/button";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<PersonalityType | null>(null);
  const [partnerType, setPartnerType] = useState<PersonalityType | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [rank, setRank] = useState<ReturnType<typeof getCompatibilityRank> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userScore1 = parseInt(searchParams.get("score1") || "0", 10);
      const userScore2 = parseInt(searchParams.get("score2") || "0", 10);
      const userScore3 = parseInt(searchParams.get("score3") || "0", 10);

      if (isNaN(userScore1) || isNaN(userScore2) || isNaN(userScore3)) {
        setError("結果データが不正です");
        setLoading(false);
        return;
      }

      const user = getPersonalityType(userScore1, userScore2, userScore3, "18");
      setUserType(user);

      const partnerScore1 = parseInt(searchParams.get("partnerScore1") || "0", 10);
      const partnerScore2 = parseInt(searchParams.get("partnerScore2") || "0", 10);
      const partnerScore3 = parseInt(searchParams.get("partnerScore3") || "0", 10);

      const partner = getPersonalityType(partnerScore1, partnerScore2, partnerScore3, "18");
      setPartnerType(partner);

      const compat = getCompatibilityFromTypes(user, partner, "18");
      setCompatibility(compat);
      
      const percentileInfo = generateCompatibilityMessageWithPercentile(compat.total);
      setPercentile(percentileInfo.percentile);

      const rankInfo = getCompatibilityRank(percentileInfo.percentile);
      setRank(rankInfo);

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

  if (error || !userType || !partnerType || !compatibility || percentile === null || !rank) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-gray-800">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p>{error || "結果を取得できませんでした"}</p>
          <Button onClick={() => router.push("/diagnoses/compatibility-18")}>
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
      type2={partnerType}
      compatibility={compatibility}
      rank={rank}
      percentile={percentile}
      shareUrl={shareUrl}
    />
  );
}

export default function Compatibility18ResultPage() {
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
