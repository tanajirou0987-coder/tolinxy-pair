"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import types18Data from "../../../data/diagnoses/compatibility-18/types.json";
import types54Data from "../../../data/diagnoses/compatibility-54/types.json";
import type { PersonalityType } from "@/lib/types";

function getScoresForType(typeCode: string, diagnosisType: "18" | "54"): { score1: number; score2: number; score3: number } {
  const [communication, decision, relationship] = typeCode.split("_");
  const threshold = diagnosisType === "54" ? 9 : 3;

  const mapScore = (value: string, positive: string, negative: string) => {
    if (value === positive) return threshold + 1;
    if (value === negative) return -(threshold + 1);
    return 0;
  };

  return {
    score1: mapScore(communication, "積極型", "受容型"),
    score2: mapScore(decision, "論理型", "感情型"),
    score3: mapScore(relationship, "リード型", "寄り添い型"),
  };
}

export default function DevPage() {
  const router = useRouter();
  const [diagnosisType, setDiagnosisType] = useState<"18" | "54">("18");
  const [userType, setUserType] = useState("");
  const [partnerType, setPartnerType] = useState("");

  const typesData = diagnosisType === "54" ? types54Data : types18Data;
  const typeCodes = Object.keys(typesData) as string[];
  const types = typeCodes.map((code) => typesData[code as keyof typeof typesData] as PersonalityType);

  const pushResult = (userTypeCode: string, partnerTypeCode: string) => {
    const userScores = getScoresForType(userTypeCode, diagnosisType);
    const partnerScores = getScoresForType(partnerTypeCode, diagnosisType);

    const params = new URLSearchParams({
      type: userTypeCode,
      score1: userScores.score1.toString(),
      score2: userScores.score2.toString(),
      score3: userScores.score3.toString(),
      partnerType: partnerTypeCode,
      partnerScore1: partnerScores.score1.toString(),
      partnerScore2: partnerScores.score2.toString(),
      partnerScore3: partnerScores.score3.toString(),
      diagnosis: `compatibility-${diagnosisType}`,
    });

    router.push(`/diagnoses/compatibility-${diagnosisType}/result?${params.toString()}`);
  };

  const handleQuickLink = (userTypeCode: string, partnerTypeCode: string) => {
    setUserType(userTypeCode);
    setPartnerType(partnerTypeCode);
    pushResult(userTypeCode, partnerTypeCode);
  };

  const handleGoToResult = () => {
    if (!userType || !partnerType) {
      alert("ユーザーとパートナーのタイプを選択してください");
      return;
    }
    pushResult(userType, partnerType);
  };

  // ランダムな組み合わせを生成する関数（レンダリング外で使用）
  const getRandomCombination = () => {
    const randomIndex1 = Math.floor(Math.random() * typeCodes.length);
    const randomIndex2 = Math.floor(Math.random() * typeCodes.length);
    return {
      userType: typeCodes[randomIndex1],
      partnerType: typeCodes[randomIndex2],
    };
  };

  const [randomCombination] = React.useState(() => getRandomCombination());

  const quickLinks = [
    { label: "ブレインマエストロ × ブレインマエストロ", userType: "積極型_論理型_リード型", partnerType: "積極型_論理型_リード型" },
    { label: "ブレインマエストロ × サイレントハーモナイザー", userType: "積極型_論理型_リード型", partnerType: "受容型_感情型_寄り添い型" },
    { label: "バランスコンダクター × バランスコンダクター", userType: "積極型_論理型_対等型", partnerType: "積極型_論理型_対等型" },
    { label: "ユニゾンアーティスト × ユニゾンアーティスト", userType: "バランス型_ハイブリッド型_対等型", partnerType: "バランス型_ハイブリッド型_対等型" },
    { label: "ランダム組み合わせ", userType: randomCombination.userType, partnerType: randomCombination.partnerType },
  ];

  return (
    <div className="pairly-legacy min-h-screen px-4 py-12 text-[#2f2722] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🛠️ 開発者用ショートカット</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#356f64]">診断をスキップして結果画面に直接アクセスできます。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">診断タイプ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setDiagnosisType("18")}
                className={`rounded-full px-6 ${diagnosisType === "18" ? "bg-[#d9b49c]" : "bg-[#d6f5ed] text-[#2f2722]"}`}
              >
                18問診断
              </Button>
              <Button
                onClick={() => setDiagnosisType("54")}
                className={`rounded-full px-6 ${diagnosisType === "54" ? "bg-[#d9b49c]" : "bg-[#d6f5ed] text-[#2f2722]"}`}
              >
                54問診断
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">タイプ選択</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">あなたのタイプ</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-2 text-[#2f2722] focus:border-[#d9b49c] focus:outline-none"
              >
                <option value="">選択してください</option>
                {types.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.icon} {type.name} ({type.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">相手のタイプ</label>
              <select
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-2 text-[#2f2722] focus:border-[#d9b49c] focus:outline-none"
              >
                <option value="">選択してください</option>
                {types.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.icon} {type.name} ({type.type})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGoToResult}
              className="w-full rounded-2xl bg-[#d9b49c]"
              size="lg"
            >
              結果を見る
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">クイックリンク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickLink(link.userType, link.partnerType)}
                  variant="outline"
                  className="w-full justify-start rounded-2xl border-[#e4e0d8] text-left text-[#2f2722] hover:bg-[#edf9f6]"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">全27タイプ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((type) => (
                <div key={type.type} className="rounded-2xl border border-[#ede3d9] bg-white/80 p-3 text-sm">
                  <div className="font-semibold text-[#2f2722]">
                    {type.icon} {type.name}
                  </div>
                  <div className="mt-1 text-xs text-[#60a69b]">{type.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
