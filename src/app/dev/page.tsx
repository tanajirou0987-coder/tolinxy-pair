"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import types18Data from "../../../data/diagnoses/compatibility-18/types.json";
import types54Data from "../../../data/diagnoses/compatibility-54/types.json";
import type { PersonalityType } from "@/lib/types";

// スコアからタイプを判定するための簡易関数
function getScoresForType(typeCode: string, diagnosisType: "18" | "54"): { score1: number; score2: number; score3: number } {
  // タイプコードから特性を抽出
  const [communication, decision, relationship] = typeCode.split("_");
  
  // 18問の場合: ±3以上で極端、-3～3でバランス
  // 54問の場合: ±9以上で極端、-9～9でバランス
  const threshold = diagnosisType === "54" ? 9 : 3;
  
  let score1 = 0; // communication
  let score2 = 0; // decision
  let score3 = 0; // relationship
  
  // コミュニケーション軸
  if (communication === "積極型") score1 = threshold + 1;
  else if (communication === "受容型") score1 = -(threshold + 1);
  else score1 = 0;
  
  // 意思決定軸
  if (decision === "論理型") score2 = threshold + 1;
  else if (decision === "感情型") score2 = -(threshold + 1);
  else score2 = 0;
  
  // 関係性軸
  if (relationship === "リード型") score3 = threshold + 1;
  else if (relationship === "寄り添い型") score3 = -(threshold + 1);
  else score3 = 0;
  
  return { score1, score2, score3 };
}

export default function DevPage() {
  const router = useRouter();
  const [diagnosisType, setDiagnosisType] = useState<"18" | "54">("18");
  const [userType, setUserType] = useState<string>("");
  const [partnerType, setPartnerType] = useState<string>("");
  
  const typesData = diagnosisType === "54" ? types54Data : types18Data;
  const typeCodes = Object.keys(typesData) as string[];
  const types = typeCodes.map(code => typesData[code as keyof typeof typesData] as PersonalityType);

  const handleQuickLink = (userTypeCode: string, partnerTypeCode: string) => {
    setUserType(userTypeCode);
    setPartnerType(partnerTypeCode);
    
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

  const handleGoToResult = () => {
    if (!userType || !partnerType) {
      alert("ユーザーとパートナーのタイプを選択してください");
      return;
    }

    const userScores = getScoresForType(userType, diagnosisType);
    const partnerScores = getScoresForType(partnerType, diagnosisType);
    
    const params = new URLSearchParams({
      type: userType,
      score1: userScores.score1.toString(),
      score2: userScores.score2.toString(),
      score3: userScores.score3.toString(),
      partnerType: partnerType,
      partnerScore1: partnerScores.score1.toString(),
      partnerScore2: partnerScores.score2.toString(),
      partnerScore3: partnerScores.score3.toString(),
      diagnosis: `compatibility-${diagnosisType}`,
    });

    router.push(`/diagnoses/compatibility-${diagnosisType}/result?${params.toString()}`);
  };

  // よく使うタイプの組み合わせ
  const quickLinks = [
    {
      label: "ブレインマエストロ × ブレインマエストロ",
      userType: "積極型_論理型_リード型",
      partnerType: "積極型_論理型_リード型",
    },
    {
      label: "ブレインマエストロ × サイレントハーモナイザー",
      userType: "積極型_論理型_リード型",
      partnerType: "受容型_感情型_寄り添い型",
    },
    {
      label: "バランスコンダクター × バランスコンダクター",
      userType: "積極型_論理型_対等型",
      partnerType: "積極型_論理型_対等型",
    },
    {
      label: "ユニゾンアーティスト × ユニゾンアーティスト",
      userType: "バランス型_ハイブリッド型_対等型",
      partnerType: "バランス型_ハイブリッド型_対等型",
    },
    {
      label: "ランダム組み合わせ",
      userType: typeCodes[Math.floor(Math.random() * typeCodes.length)],
      partnerType: typeCodes[Math.floor(Math.random() * typeCodes.length)],
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* ヘッダー */}
        <Card className="border-2 border-[#F39C12]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#2C3E50]">
              🛠️ 開発者用ショートカット
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#2C3E50]/70">
              診断をスキップして結果画面に直接アクセスできます
            </p>
          </CardContent>
        </Card>

        {/* 診断タイプ選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2C3E50]">診断タイプ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => setDiagnosisType("18")}
                className={diagnosisType === "18" ? "bg-[#F39C12] hover:bg-[#E67E22]" : ""}
              >
                18問診断
              </Button>
              <Button
                onClick={() => setDiagnosisType("54")}
                className={diagnosisType === "54" ? "bg-[#F39C12] hover:bg-[#E67E22]" : ""}
              >
                54問診断
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* タイプ選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2C3E50]">タイプ選択</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C3E50]">
                あなたのタイプ
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full rounded-lg border-2 border-[#2C3E50]/20 px-4 py-2 text-[#2C3E50] focus:border-[#F39C12] focus:outline-none"
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
              <label className="mb-2 block text-sm font-medium text-[#2C3E50]">
                相手のタイプ
              </label>
              <select
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                className="w-full rounded-lg border-2 border-[#2C3E50]/20 px-4 py-2 text-[#2C3E50] focus:border-[#F39C12] focus:outline-none"
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
              className="w-full bg-[#F39C12] hover:bg-[#E67E22]"
              size="lg"
            >
              結果を見る
            </Button>
          </CardContent>
        </Card>

        {/* クイックリンク */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2C3E50]">クイックリンク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickLink(link.userType, link.partnerType)}
                  variant="outline"
                  className="w-full justify-start border-[#2C3E50]/20 text-left hover:bg-[#F39C12]/10"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* タイプ一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2C3E50]">全27タイプ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((type) => (
                <div
                  key={type.type}
                  className="rounded-lg border border-[#2C3E50]/20 p-3 text-sm"
                >
                  <div className="font-semibold text-[#2C3E50]">
                    {type.icon} {type.name}
                  </div>
                  <div className="mt-1 text-xs text-[#2C3E50]/60">
                    {type.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


