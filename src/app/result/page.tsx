"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPersonalityType, getCompatibility } from "@/lib/calculate";
import type { PersonalityType, Compatibility } from "@/lib/types";

function ResultContent() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<PersonalityType | null>(null);
  const [partnerType, setPartnerType] = useState<PersonalityType | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const type = searchParams.get("type");
      const score1 = parseInt(searchParams.get("score1") || "0", 10);
      const score2 = parseInt(searchParams.get("score2") || "0", 10);
      const score3 = parseInt(searchParams.get("score3") || "0", 10);
      const partnerTypeCode = searchParams.get("partnerType") || type;

      if (!type || isNaN(score1) || isNaN(score2) || isNaN(score3)) {
        setError("結果データが不正です");
        setLoading(false);
        return;
      }

      // ユーザーのタイプを取得
      const user = getPersonalityType(score1, score2, score3);
      setUserType(user);

      // 相手のタイプを取得（同じスコアを使用、実際には別のパラメータから取得する想定）
      // ここでは簡易的に同じタイプを使用
      const partner = getPersonalityType(score1, score2, score3);
      setPartnerType(partner);

      // 相性情報を取得
      const compat = getCompatibility(user.type, partner.type);
      setCompatibility(compat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleShare = (platform: "instagram" | "x" | "line" | "copy") => {
    if (!compatibility || !userType || !partnerType) return;

    const score = compatibility.total;
    const text = `【MatchTune診断】2人の相性：${score}% 🎵`;
    const url = window.location.href;

    switch (platform) {
      case "x":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "line":
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "instagram":
        // Instagramは直接シェアできないので、クリップボードにコピー
        navigator.clipboard.writeText(`${text}\n${url}`);
        alert("テキストをクリップボードにコピーしました！Instagramに貼り付けてシェアしてください。");
        break;
      case "copy":
        navigator.clipboard.writeText(`${text}\n${url}`);
        alert("URLをクリップボードにコピーしました！");
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-[#2C3E50]">結果を計算中...</p>
      </div>
    );
  }

  if (error || !compatibility || !userType || !partnerType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-[#2C3E50]">
              {error || "結果を取得できませんでした"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* スコア表示 */}
        <Card className="border-2 border-[#F39C12] bg-gradient-to-br from-white to-[#F39C12]/5">
          <CardContent className="py-12 text-center">
            <div className="mb-4 text-6xl font-bold text-[#F39C12] sm:text-7xl">
              ✨ {compatibility.total}% ✨
            </div>
            <p className="text-xl font-semibold text-[#2C3E50] sm:text-2xl">
              相性スコア
            </p>
          </CardContent>
        </Card>

        {/* タイプ表示 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <span className="text-3xl">{userType.icon}</span>
                <span className="text-lg text-[#2C3E50]">あなた</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 text-center text-xl font-bold text-[#2C3E50]">
                {userType.name}
              </h3>
              <p className="mb-4 text-center text-sm text-[#2C3E50]/70">
                {userType.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#2C3E50]/60">コミュニケーション:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {userType.traits.communication}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E50]/60">意思決定:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {userType.traits.decision}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E50]/60">関係性:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {userType.traits.relationship}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <span className="text-3xl">{partnerType.icon}</span>
                <span className="text-lg text-[#2C3E50]">相手</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 text-center text-xl font-bold text-[#2C3E50]">
                {partnerType.name}
              </h3>
              <p className="mb-4 text-center text-sm text-[#2C3E50]/70">
                {partnerType.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#2C3E50]/60">コミュニケーション:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {partnerType.traits.communication}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E50]/60">意思決定:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {partnerType.traits.decision}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C3E50]/60">関係性:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {partnerType.traits.relationship}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 相性メッセージ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl text-[#2C3E50]">
              相性メッセージ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center text-lg font-semibold text-[#2C3E50]">
              {compatibility.message}
            </p>
            <p className="text-center text-[#2C3E50]/80">
              {compatibility.detail}
            </p>
          </CardContent>
        </Card>

        {/* アドバイス */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#2C3E50]">あなたへのアドバイス</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#2C3E50]/80">{compatibility.adviceUser}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#2C3E50]">相手へのアドバイス</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#2C3E50]/80">{compatibility.advicePartner}</p>
            </CardContent>
          </Card>
        </div>

        {/* シェアボタン */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg text-[#2C3E50]">
              結果をシェア
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => handleShare("x")}
                className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
                size="lg"
              >
                Xでシェア
              </Button>
              <Button
                onClick={() => handleShare("line")}
                className="bg-[#00C300] hover:bg-[#00C300]/90"
                size="lg"
              >
                LINEでシェア
              </Button>
              <Button
                onClick={() => handleShare("instagram")}
                className="bg-gradient-to-r from-[#E4405F] to-[#F77737] hover:opacity-90"
                size="lg"
              >
                Instagramでシェア
              </Button>
              <Button
                onClick={() => handleShare("copy")}
                variant="outline"
                size="lg"
                className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white"
              >
                URLをコピー
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* トップに戻る */}
        <div className="text-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            size="lg"
            className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white"
          >
            もう一度診断する
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-[#2C3E50]">読み込み中...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
