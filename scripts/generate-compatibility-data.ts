/**
 * 729パターンの相性データを生成するスクリプト
 * 27タイプ × 27タイプ = 729パターン
 */

import { writeFileSync } from "fs";
import { join } from "path";

// 3軸の特性
const communicationTraits = ["積極型", "バランス型", "受容型"] as const;
const decisionTraits = ["論理型", "ハイブリッド型", "感情型"] as const;
const relationshipTraits = ["リード型", "対等型", "寄り添い型"] as const;

// 27タイプを生成
function generateAllTypes(): string[] {
  const types: string[] = [];
  for (const comm of communicationTraits) {
    for (const dec of decisionTraits) {
      for (const rel of relationshipTraits) {
        types.push(`${comm}_${dec}_${rel}`);
      }
    }
  }
  return types;
}

// 相性スコアを計算
function calculateCompatibilityScore(
  type1: string,
  type2: string
): number {
  const [comm1, dec1, rel1] = type1.split("_");
  const [comm2, dec2, rel2] = type2.split("_");

  // 軸1（コミュニケーション）: 補完性重視
  const axis1Score =
    comm1 !== comm2 && (comm1 === "積極型" && comm2 === "受容型" || comm1 === "受容型" && comm2 === "積極型")
      ? 100
      : comm1 === comm2
      ? (comm1 === "バランス型" ? 80 : 50)
      : 70;

  // 軸2（意思決定）: 類似性重視
  const axis2Score =
    dec1 === dec2
      ? 100
      : dec1 === "ハイブリッド型" || dec2 === "ハイブリッド型"
      ? 80
      : (dec1 === "論理型" && dec2 === "感情型" || dec1 === "感情型" && dec2 === "論理型")
      ? 40
      : 60;

  // 軸3（関係性）: 補完性重視
  const axis3Score =
    rel1 !== rel2 && (rel1 === "リード型" && rel2 === "寄り添い型" || rel1 === "寄り添い型" && rel2 === "リード型")
      ? 100
      : rel1 === rel2
      ? (rel1 === "対等型" ? 80 : 50)
      : 70;

  // 総合スコア = 0.3 × 軸1 + 0.4 × 軸2 + 0.3 × 軸3
  return Math.round(axis1Score * 0.3 + axis2Score * 0.4 + axis3Score * 0.3);
}

// 相性メッセージを生成
function generateMessage(score: number): string {
  if (score >= 90) return "最高の相性！完璧な組み合わせ";
  if (score >= 80) return "とても良い相性！理想的な関係";
  if (score >= 70) return "良い相性！互いを理解し合える";
  if (score >= 60) return "普通の相性。お互いを尊重し合えば良い関係に";
  if (score >= 50) return "やや相性に課題あり。コミュニケーションが大切";
  return "相性に課題あり。お互いの違いを理解することが重要";
}

// 詳細説明を生成
function generateDetail(type1: string, type2: string): string {
  const [comm1, dec1] = type1.split("_");
  const [comm2, dec2] = type2.split("_");

  let detail = `${type1}と${type2}の組み合わせ。`;

  if (comm1 !== comm2) {
    detail += "コミュニケーションスタイルは異なりますが、お互いを補完し合える関係です。";
  } else {
    detail += "コミュニケーションスタイルが似ているため、理解しやすい関係です。";
  }

  if (dec1 === dec2) {
    detail += "意思決定の方法も似ているため、スムーズに物事を進められます。";
  } else {
    detail += "意思決定の方法が異なるため、時には意見が分かれることもありますが、多様な視点を得られます。";
  }

  return detail;
}

// アドバイスを生成
function generateAdvice(type1: string, type2: string): { user: string; partner: string } {
  return {
    user: `${type2}の相手と接する際は、相手のペースを尊重し、コミュニケーションを大切にすると良いでしょう。`,
    partner: `${type1}の相手と接する際は、相手の特性を理解し、時にはリードしてもらうことも大切です。`,
  };
}

// 729パターンを生成
interface CompatibilityData {
  total: number;
  message: string;
  detail: string;
  adviceUser: string;
  advicePartner: string;
}

function generateCompatibilityData() {
  const types = generateAllTypes();
  const compatibility: Record<string, CompatibilityData> = {};

  for (const type1 of types) {
    for (const type2 of types) {
      const key = `${type1}_${type2}`;
      const score = calculateCompatibilityScore(type1, type2);
      const advice = generateAdvice(type1, type2);

      compatibility[key] = {
        total: score,
        message: generateMessage(score),
        detail: generateDetail(type1, type2),
        adviceUser: advice.user,
        advicePartner: advice.partner,
      };
    }
  }

  return compatibility;
}

// メイン処理
const compatibilityData = generateCompatibilityData();
const outputPath = join(process.cwd(), "data/diagnoses/compatibility-18/compatibility.json");

writeFileSync(outputPath, JSON.stringify(compatibilityData, null, 2), "utf-8");

console.log(`✅ 729パターンの相性データを生成しました: ${outputPath}`);
console.log(`   総パターン数: ${Object.keys(compatibilityData).length}`);

