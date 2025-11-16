"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPersonalityType, getCompatibilityFromTypes } from "@/lib/calculate";
import { analyzeDetailedCompatibility } from "@/lib/compatibility-analysis";
import type { PersonalityType, Compatibility } from "@/lib/types";
import type { DetailedCompatibilityAnalysis } from "@/lib/compatibility-analysis";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<PersonalityType | null>(null);
  const [partnerType, setPartnerType] = useState<PersonalityType | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedCompatibilityAnalysis | null>(null);
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
      const user = getPersonalityType(score1, score2, score3, "18");
      setUserType(user);

      // 相手のタイプを取得
      // 実際のアプリでは、相手のスコアを別途取得する必要がある
      // 現在は同じスコアを使用（デモ用）
      const partnerScore1 = parseInt(searchParams.get("partnerScore1") || searchParams.get("score1") || "0", 10);
      const partnerScore2 = parseInt(searchParams.get("partnerScore2") || searchParams.get("score2") || "0", 10);
      const partnerScore3 = parseInt(searchParams.get("partnerScore3") || searchParams.get("score3") || "0", 10);
      
      const partner = getPersonalityType(partnerScore1, partnerScore2, partnerScore3, "18");
      setPartnerType(partner);

      // 相性情報を取得（フォールバック付き）
      const compat = getCompatibilityFromTypes(user, partner, "18");
      setCompatibility(compat);
      
      // 詳細な相性分析を実行
      const analysis = analyzeDetailedCompatibility(user, partner, compat.total);
      setDetailedAnalysis(analysis);
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

  if (error || !compatibility || !userType || !partnerType || !detailedAnalysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-[#2C3E50]">
              {error || "結果を取得できませんでした"}
            </p>
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push("/diagnoses/compatibility-18")}
                variant="outline"
              >
                診断に戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* スコア表示 */}
        <div className="relative overflow-hidden rounded-2xl border-4 border-[#F39C12] bg-gradient-to-br from-[#F39C12] via-[#E67E22] to-[#F39C12] p-8 shadow-2xl sm:p-12">
          {/* 背景装飾 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl" />
          </div>
          
          <div className="relative z-10 text-center">
            {/* メインスコア */}
            <div className="mb-6">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/90 sm:text-base">
                相性スコア
              </div>
              <div className="relative inline-block">
                <div className="absolute -inset-4 animate-pulse rounded-full bg-white/20 blur-xl" />
                <div className="relative text-8xl font-black text-white drop-shadow-2xl sm:text-9xl">
                  {compatibility.total}
                </div>
                <div className="absolute -right-8 top-0 text-4xl text-white/80 sm:-right-12 sm:text-5xl">
                  %
                </div>
              </div>
            </div>

            {/* 装飾的なライン */}
            <div className="mx-auto mb-4 flex items-center justify-center gap-2">
              <div className="h-1 w-12 rounded-full bg-white/60" />
              <div className="text-2xl text-white/80">✨</div>
              <div className="h-1 w-12 rounded-full bg-white/60" />
            </div>

            {/* メッセージ */}
            <p className="text-lg font-semibold text-white sm:text-xl">
              {compatibility.message}
            </p>
          </div>
        </div>

        {/* 二人のラブタイプ詳細 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#2C3E50]">2人のラブタイプ</h2>
          
          {/* あなたのタイプ */}
          <Card className="border-2 border-[#F39C12]/30">
            <CardHeader className="bg-gradient-to-r from-[#F39C12]/10 to-transparent">
              <CardTitle className="flex items-center gap-3">
                <span className="text-4xl">{userType.icon}</span>
                <div>
                  <div className="text-xl text-[#2C3E50]">あなた</div>
                  <div className="text-lg font-bold text-[#F39C12]">{userType.name}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {userType.personality && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">性格の特徴</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{userType.personality}</p>
                </div>
              )}
              {userType.romanceTendency && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">恋愛における性格傾向</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{userType.romanceTendency}</p>
                </div>
              )}
              {userType.dailyActions && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">日常の恋愛行動パターン</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{userType.dailyActions}</p>
                </div>
              )}
              {userType.innerMotivation && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">内面の動機・価値観</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{userType.innerMotivation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 相手のタイプ */}
          <Card className="border-2 border-[#2C3E50]/30">
            <CardHeader className="bg-gradient-to-r from-[#2C3E50]/10 to-transparent">
              <CardTitle className="flex items-center gap-3">
                <span className="text-4xl">{partnerType.icon}</span>
                <div>
                  <div className="text-xl text-[#2C3E50]">相手</div>
                  <div className="text-lg font-bold text-[#2C3E50]">{partnerType.name}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {partnerType.personality && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">性格の特徴</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{partnerType.personality}</p>
                </div>
              )}
              {partnerType.romanceTendency && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">恋愛における性格傾向</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{partnerType.romanceTendency}</p>
                </div>
              )}
              {partnerType.dailyActions && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">日常の恋愛行動パターン</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{partnerType.dailyActions}</p>
                </div>
              )}
              {partnerType.innerMotivation && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#2C3E50]/70">内面の動機・価値観</h3>
                  <p className="text-[#2C3E50]/90 leading-relaxed">{partnerType.innerMotivation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 多角的な相性分析 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#2C3E50]">相性の詳細分析</h2>
          
          {/* スコア項目 */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* 価値観一致度 */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2C3E50]">価値観一致度</h3>
                  <span className="text-lg font-bold text-[#F39C12]">
                    {detailedAnalysis.valuesAlignment}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#2C3E50]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22]"
                    style={{ width: `${detailedAnalysis.valuesAlignment}%` }}
                  />
                </div>
                <p className="mb-2 text-xs text-[#2C3E50]/80">
                  {detailedAnalysis.valuesAlignmentDetail.description}
                </p>
                <p className="text-xs text-[#2C3E50]/60 italic">
                  {detailedAnalysis.valuesAlignmentDetail.example}
                </p>
              </CardContent>
            </Card>

            {/* 感情表現の相性 */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2C3E50]">感情表現の相性</h3>
                  <span className="text-lg font-bold text-[#F39C12]">
                    {detailedAnalysis.emotionalExpression}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#2C3E50]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22]"
                    style={{ width: `${detailedAnalysis.emotionalExpression}%` }}
                  />
                </div>
                <p className="mb-2 text-xs text-[#2C3E50]/80">
                  {detailedAnalysis.emotionalExpressionDetail.description}
                </p>
                <p className="text-xs text-[#2C3E50]/60 italic">
                  {detailedAnalysis.emotionalExpressionDetail.example}
                </p>
              </CardContent>
            </Card>

            {/* コミュニケーションスタイル */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2C3E50]">コミュニケーションスタイル</h3>
                  <span className="text-lg font-bold text-[#F39C12]">
                    {detailedAnalysis.communicationStyle}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#2C3E50]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22]"
                    style={{ width: `${detailedAnalysis.communicationStyle}%` }}
                  />
                </div>
                <p className="mb-2 text-xs text-[#2C3E50]/80">
                  {detailedAnalysis.communicationStyleDetail.description}
                </p>
                <p className="text-xs text-[#2C3E50]/60 italic">
                  {detailedAnalysis.communicationStyleDetail.example}
                </p>
              </CardContent>
            </Card>

            {/* ストレス対応 */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2C3E50]">ストレス対応</h3>
                  <span className="text-lg font-bold text-[#F39C12]">
                    {detailedAnalysis.stressResponse}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#2C3E50]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22]"
                    style={{ width: `${detailedAnalysis.stressResponse}%` }}
                  />
                </div>
                <p className="mb-2 text-xs text-[#2C3E50]/80">
                  {detailedAnalysis.stressResponseDetail.description}
                </p>
                <p className="text-xs text-[#2C3E50]/60 italic">
                  {detailedAnalysis.stressResponseDetail.example}
                </p>
              </CardContent>
            </Card>

            {/* 生活リズム */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2C3E50]">生活リズム</h3>
                  <span className="text-lg font-bold text-[#F39C12]">
                    {detailedAnalysis.lifestyleRhythm}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#2C3E50]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22]"
                    style={{ width: `${detailedAnalysis.lifestyleRhythm}%` }}
                  />
                </div>
                <p className="mb-2 text-xs text-[#2C3E50]/80">
                  {detailedAnalysis.lifestyleRhythmDetail.description}
                </p>
                <p className="text-xs text-[#2C3E50]/60 italic">
                  {detailedAnalysis.lifestyleRhythmDetail.example}
                </p>
              </CardContent>
            </Card>

            {/* 愛情表現 */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2C3E50]">愛情表現</h3>
                  <span className="text-lg font-bold text-[#F39C12]">
                    {detailedAnalysis.loveExpression}%
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#2C3E50]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F39C12] to-[#E67E22]"
                    style={{ width: `${detailedAnalysis.loveExpression}%` }}
                  />
                </div>
                <p className="mb-2 text-xs text-[#2C3E50]/80">
                  {detailedAnalysis.loveExpressionDetail.description}
                </p>
                <p className="text-xs text-[#2C3E50]/60 italic">
                  {detailedAnalysis.loveExpressionDetail.example}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 強みとチャレンジ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#2C3E50]">2人の関係性</h2>
          
          {/* 強み */}
          <Card className="border-2 border-green-500/30 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <span className="text-2xl">💪</span>
                <span>強み</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {detailedAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#2C3E50]/90">
                    <span className="mt-1 text-green-600">✓</span>
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* チャレンジポイント */}
          <Card className="border-2 border-orange-500/30 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">🎯</span>
                <span>チャレンジポイント</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {detailedAnalysis.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#2C3E50]/90">
                    <span className="mt-1 text-orange-600">•</span>
                    <span className="leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 改善のヒント */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
              <span className="text-2xl">💡</span>
              <span>改善のヒント</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailedAnalysis.improvementTips.map((tip, index) => (
              <div key={index} className="rounded-lg border border-[#2C3E50]/20 bg-white p-4">
                <h3 className="mb-2 font-semibold text-[#F39C12]">{tip.title}</h3>
                <p className="text-sm leading-relaxed text-[#2C3E50]/90">{tip.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* コミュニケーションヒント */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
              <span className="text-2xl">💬</span>
              <span>コミュニケーションのヒント</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {detailedAnalysis.communicationHints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2 text-[#2C3E50]/90">
                  <span className="mt-1 text-[#F39C12]">→</span>
                  <span className="leading-relaxed">{hint}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 会話のきっかけ */}
        <Card className="border-2 border-[#F39C12]/30 bg-gradient-to-br from-[#F39C12]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
              <span className="text-2xl">💭</span>
              <span>会話のきっかけ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-[#2C3E50]/70">
              この診断結果を読んだ2人で、ぜひ話し合ってみてください。
            </p>
            <div className="space-y-3">
              {detailedAnalysis.conversationStarters.map((starter, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[#F39C12]/30 bg-white p-3 text-sm text-[#2C3E50]/90"
                >
                  {starter}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 未来へのメッセージ */}
        <Card className="border-4 border-[#F39C12] bg-gradient-to-br from-[#F39C12]/10 via-white to-[#E67E22]/10">
          <CardContent className="py-8 text-center">
            <div className="mb-4 text-4xl">✨</div>
            <h2 className="mb-4 text-2xl font-bold text-[#2C3E50]">未来へのメッセージ</h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-[#2C3E50]/90">
              {detailedAnalysis.futureMessage}
            </p>
          </CardContent>
        </Card>

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
            onClick={() => router.push("/diagnoses")}
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

export default function Compatibility18ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[#2C3E50]">読み込み中...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

