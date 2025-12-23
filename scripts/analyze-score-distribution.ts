/**
 * 27タイプの全組み合わせの相性スコア分布を分析するスクリプト
 */

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

// コミュニケーション軸の相性スコアを計算
function calculateCommunicationCompatibility(
  trait1: string,
  trait2: string
): number {
  const pairs: Record<string, number> = {
    "積極型_受容型": 100,
    "受容型_積極型": 100,
    "積極型_バランス型": 70,
    "バランス型_積極型": 70,
    "受容型_バランス型": 70,
    "バランス型_受容型": 70,
    "積極型_積極型": 50,
    "受容型_受容型": 50,
    "バランス型_バランス型": 80,
  };

  const key = `${trait1}_${trait2}`;
  return pairs[key] || 50;
}

// 意思決定軸の相性スコアを計算
function calculateDecisionCompatibility(
  trait1: string,
  trait2: string
): number {
  if (trait1 === trait2) {
    return 100;
  }

  if (trait1 === "ハイブリッド型" || trait2 === "ハイブリッド型") {
    return 80;
  }

  if (
    (trait1 === "論理型" && trait2 === "感情型") ||
    (trait1 === "感情型" && trait2 === "論理型")
  ) {
    return 40;
  }

  return 60;
}

// 関係性軸の相性スコアを計算
function calculateRelationshipCompatibility(
  trait1: string,
  trait2: string
): number {
  const pairs: Record<string, number> = {
    "リード型_寄り添い型": 100,
    "寄り添い型_リード型": 100,
    "リード型_対等型": 70,
    "対等型_リード型": 70,
    "寄り添い型_対等型": 70,
    "対等型_寄り添い型": 70,
    "リード型_リード型": 50,
    "寄り添い型_寄り添い型": 50,
    "対等型_対等型": 80,
  };

  const key = `${trait1}_${trait2}`;
  return pairs[key] || 50;
}

// タイプコードから特性を抽出
function extractTraits(typeCode: string): {
  communication: string;
  decision: string;
  relationship: string;
} {
  const [comm, dec, rel] = typeCode.split("_");
  return {
    communication: comm,
    decision: dec,
    relationship: rel,
  };
}

// 相性スコアを計算
function calculateCompatibilityScore(type1: string, type2: string): number {
  const traits1 = extractTraits(type1);
  const traits2 = extractTraits(type2);

  const axis1Score = calculateCommunicationCompatibility(
    traits1.communication,
    traits2.communication
  );

  const axis2Score = calculateDecisionCompatibility(
    traits1.decision,
    traits2.decision
  );

  const axis3Score = calculateRelationshipCompatibility(
    traits1.relationship,
    traits2.relationship
  );

  // 総合スコア = 0.3 × 軸1 + 0.4 × 軸2 + 0.3 × 軸3
  const rawScore = axis1Score * 0.3 + axis2Score * 0.4 + axis3Score * 0.3;

  // 1%〜100%に正規化（元の範囲: 46〜100）
  const minRawScore = 46;
  const maxRawScore = 100;
  const rawRange = maxRawScore - minRawScore;

  // 正規化: ((score - min) / range) × 99 + 1
  const normalizedScore = Math.round(((rawScore - minRawScore) / rawRange) * 99 + 1);

  // 1〜100の範囲に制限
  return Math.max(1, Math.min(100, normalizedScore));
}

// メイン処理
const allTypes = generateAllTypes();
const scoreDistribution: Record<string, number> = {};

// 10スコアごとの範囲を初期化
for (let i = 1; i <= 100; i += 10) {
  const range = i === 91 ? "91-100" : `${i}-${i + 9}`;
  scoreDistribution[range] = 0;
}

// すべての組み合わせを計算（27 × 27 = 729通り）
let totalCombinations = 0;
for (const type1 of allTypes) {
  for (const type2 of allTypes) {
    const score = calculateCompatibilityScore(type1, type2);
    totalCombinations++;

    // 10スコアごとに分類
    let range: string;
    if (score >= 91) {
      range = "91-100";
    } else if (score >= 81) {
      range = "81-90";
    } else if (score >= 71) {
      range = "71-80";
    } else if (score >= 61) {
      range = "61-70";
    } else if (score >= 51) {
      range = "51-60";
    } else if (score >= 41) {
      range = "41-50";
    } else if (score >= 31) {
      range = "31-40";
    } else if (score >= 21) {
      range = "21-30";
    } else if (score >= 11) {
      range = "11-20";
    } else {
      range = "1-10";
    }

    scoreDistribution[range]++;
  }
}

// 結果を表示
console.log("=".repeat(60));
console.log("27タイプの相性スコア分布（10スコアごと）");
console.log("=".repeat(60));
console.log(`総組み合わせ数: ${totalCombinations}通り（27 × 27 = 729）\n`);

const ranges = [
  "1-10",
  "11-20",
  "21-30",
  "31-40",
  "41-50",
  "51-60",
  "61-70",
  "71-80",
  "81-90",
  "91-100",
];

for (const range of ranges) {
  const count = scoreDistribution[range];
  const percentage = ((count / totalCombinations) * 100).toFixed(2);
  const bar = "█".repeat(Math.round((count / totalCombinations) * 100));
  console.log(
    `${range.padStart(6)}: ${count.toString().padStart(4)}通り (${percentage.padStart(5)}%) ${bar}`
  );
}

console.log("\n" + "=".repeat(60));


















