"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  getPersonalityType,
  getCompatibilityFromTypes,
  generateCompatibilityMessageWithPercentile,
  getCompatibilityRank,
} from "@/lib/calculate";
import { analyzeDetailedCompatibility } from "@/lib/compatibility-analysis";
import type { PersonalityType, Compatibility } from "@/lib/types";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<PersonalityType | null>(null);
  const [partnerType, setPartnerType] = useState<PersonalityType | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<ReturnType<typeof analyzeDetailedCompatibility> | null>(null);
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

      const user = getPersonalityType(userScore1, userScore2, userScore3, "54");
      setUserType(user);

      const partnerScore1 = parseInt(searchParams.get("partnerScore1") || "0", 10);
      const partnerScore2 = parseInt(searchParams.get("partnerScore2") || "0", 10);
      const partnerScore3 = parseInt(searchParams.get("partnerScore3") || "0", 10);
      
      const partner = getPersonalityType(partnerScore1, partnerScore2, partnerScore3, "54");
      setPartnerType(partner);

      const compat = getCompatibilityFromTypes(user, partner, "54");
      setCompatibility(compat);

      const analysis = analyzeDetailedCompatibility(user, partner, compat.total);
      setDetailedAnalysis(analysis);
      
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 text-gray-700">
        結果を計算中...
      </div>
    );
  }

  if (error || !userType || !partnerType || !compatibility || !detailedAnalysis || percentile === null || !rank) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 px-4 text-gray-800">
        <div className="space-y-4 rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-2xl p-6 text-center shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]">
          <p>{error || "結果を取得できませんでした"}</p>
          <Button onClick={() => router.push("/diagnoses/compatibility-54")}>
            診断に戻る
          </Button>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50">
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
          className="pointer-events-auto rounded-[28px] sm:rounded-[32px] border border-white/70 bg-white/95 backdrop-blur-md px-5 py-2 text-sm md:px-6 md:py-3 md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-white shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_8px_24px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.9)] text-shadow-[0px_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0px_20px_60px_rgba(0,0,0,0.16),0px_10px_30px_rgba(0,0,0,0.12),inset_0px_1px_0px_rgba(255,255,255,1)] transform hover:scale-105 hover:-translate-y-1"
        >
          トップに戻る
        </Button>
      </div>
      <div className="relative z-10">
        <DiagnosisResult
        type1={userType}
        type2={partnerType}
        compatibility={compatibility}
        rank={rank}
        analysis={detailedAnalysis}
        percentile={percentile}
        shareUrl={shareUrl}
      />
      </div>
    </div>
  );
}

export default function Compatibility54ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 text-gray-700">
          結果を読み込み中...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
