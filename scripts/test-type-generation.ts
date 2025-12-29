/**
 * 様々なスコアの組み合わせで生成されるタイプを検証するスクリプト
 */

import { getPersonalityType } from "../src/lib/calculate";

// 18問診断の場合のスコア範囲: -12 ～ +12
// 54問診断の場合のスコア範囲: -36 ～ +36

console.log("=".repeat(80));
console.log("18問診断のタイプ生成テスト");
console.log("=".repeat(80));

const testCases18 = [
  // 極端なケース
  { axis1: 12, axis2: 12, axis3: 12, desc: "全て最大値（積極型_論理型_リード型）" },
  { axis1: -12, axis2: -12, axis3: -12, desc: "全て最小値（受容型_感情型_寄り添い型）" },
  { axis1: 0, axis2: 0, axis3: 0, desc: "全て0（バランス型_ハイブリッド型_対等型）" },
  
  // 閾値付近のケース
  { axis1: 3, axis2: 3, axis3: 3, desc: "閾値ちょうど（積極型_論理型_リード型）" },
  { axis1: 4, axis2: 4, axis3: 4, desc: "閾値超え（積極型_論理型_リード型）" },
  { axis1: 2, axis2: 2, axis3: 2, desc: "閾値未満（バランス型_ハイブリッド型_対等型）" },
  { axis1: -3, axis2: -3, axis3: -3, desc: "閾値ちょうどマイナス（受容型_感情型_寄り添い型）" },
  { axis1: -4, axis2: -4, axis3: -4, desc: "閾値超えマイナス（受容型_感情型_寄り添い型）" },
  { axis1: -2, axis2: -2, axis3: -2, desc: "閾値未満マイナス（バランス型_ハイブリッド型_対等型）" },
  
  // 混合ケース
  { axis1: 5, axis2: -5, axis3: 0, desc: "混合1（積極型_感情型_対等型）" },
  { axis1: -5, axis2: 5, axis3: 0, desc: "混合2（受容型_論理型_対等型）" },
  { axis1: 0, axis2: 5, axis3: -5, desc: "混合3（バランス型_論理型_寄り添い型）" },
];

for (const testCase of testCases18) {
  const type = getPersonalityType(testCase.axis1, testCase.axis2, testCase.axis3, "18");
  console.log(`\n${testCase.desc}`);
  console.log(`  スコア: (${testCase.axis1}, ${testCase.axis2}, ${testCase.axis3})`);
  console.log(`  タイプ: ${type.type}`);
  console.log(`  名前: ${type.name}`);
}

console.log("\n" + "=".repeat(80));
console.log("54問診断のタイプ生成テスト");
console.log("=".repeat(80));

const testCases54 = [
  // 極端なケース
  { axis1: 36, axis2: 36, axis3: 36, desc: "全て最大値（積極型_論理型_リード型）" },
  { axis1: -36, axis2: -36, axis3: -36, desc: "全て最小値（受容型_感情型_寄り添い型）" },
  { axis1: 0, axis2: 0, axis3: 0, desc: "全て0（バランス型_ハイブリッド型_対等型）" },
  
  // 閾値付近のケース
  { axis1: 9, axis2: 9, axis3: 9, desc: "閾値ちょうど（積極型_論理型_リード型）" },
  { axis1: 10, axis2: 10, axis3: 10, desc: "閾値超え（積極型_論理型_リード型）" },
  { axis1: 8, axis2: 8, axis3: 8, desc: "閾値未満（バランス型_ハイブリッド型_対等型）" },
  { axis1: -9, axis2: -9, axis3: -9, desc: "閾値ちょうどマイナス（受容型_感情型_寄り添い型）" },
  { axis1: -10, axis2: -10, axis3: -10, desc: "閾値超えマイナス（受容型_感情型_寄り添い型）" },
  { axis1: -8, axis2: -8, axis3: -8, desc: "閾値未満マイナス（バランス型_ハイブリッド型_対等型）" },
  
  // 混合ケース
  { axis1: 15, axis2: -15, axis3: 0, desc: "混合1（積極型_感情型_対等型）" },
  { axis1: -15, axis2: 15, axis3: 0, desc: "混合2（受容型_論理型_対等型）" },
  { axis1: 0, axis2: 15, axis3: -15, desc: "混合3（バランス型_論理型_寄り添い型）" },
];

for (const testCase of testCases54) {
  const type = getPersonalityType(testCase.axis1, testCase.axis2, testCase.axis3, "54");
  console.log(`\n${testCase.desc}`);
  console.log(`  スコア: (${testCase.axis1}, ${testCase.axis2}, ${testCase.axis3})`);
  console.log(`  タイプ: ${type.type}`);
  console.log(`  名前: ${type.name}`);
}

console.log("\n" + "=".repeat(80));
console.log("全27タイプの生成確認");
console.log("=".repeat(80));

// 全27タイプが生成できるか確認
const allTypeCodes = new Set<string>();
const testScores = [
  // 各特性の組み合わせをテスト
  { axis1: 12, axis2: 12, axis3: 12 },   // 積極型_論理型_リード型
  { axis1: 12, axis2: 12, axis3: 0 },      // 積極型_論理型_対等型
  { axis1: 12, axis2: 12, axis3: -12 },   // 積極型_論理型_寄り添い型
  { axis1: 12, axis2: 0, axis3: 12 },     // 積極型_ハイブリッド型_リード型
  { axis1: 12, axis2: 0, axis3: 0 },      // 積極型_ハイブリッド型_対等型
  { axis1: 12, axis2: 0, axis3: -12 },    // 積極型_ハイブリッド型_寄り添い型
  { axis1: 12, axis2: -12, axis3: 12 },   // 積極型_感情型_リード型
  { axis1: 12, axis2: -12, axis3: 0 },    // 積極型_感情型_対等型
  { axis1: 12, axis2: -12, axis3: -12 },  // 積極型_感情型_寄り添い型
  { axis1: 0, axis2: 12, axis3: 12 },     // バランス型_論理型_リード型
  { axis1: 0, axis2: 12, axis3: 0 },      // バランス型_論理型_対等型
  { axis1: 0, axis2: 12, axis3: -12 },    // バランス型_論理型_寄り添い型
  { axis1: 0, axis2: 0, axis3: 12 },      // バランス型_ハイブリッド型_リード型
  { axis1: 0, axis2: 0, axis3: 0 },       // バランス型_ハイブリッド型_対等型
  { axis1: 0, axis2: 0, axis3: -12 },     // バランス型_ハイブリッド型_寄り添い型
  { axis1: 0, axis2: -12, axis3: 12 },    // バランス型_感情型_リード型
  { axis1: 0, axis2: -12, axis3: 0 },    // バランス型_感情型_対等型
  { axis1: 0, axis2: -12, axis3: -12 },  // バランス型_感情型_寄り添い型
  { axis1: -12, axis2: 12, axis3: 12 },   // 受容型_論理型_リード型
  { axis1: -12, axis2: 12, axis3: 0 },    // 受容型_論理型_対等型
  { axis1: -12, axis2: 12, axis3: -12 },  // 受容型_論理型_寄り添い型
  { axis1: -12, axis2: 0, axis3: 12 },    // 受容型_ハイブリッド型_リード型
  { axis1: -12, axis2: 0, axis3: 0 },     // 受容型_ハイブリッド型_対等型
  { axis1: -12, axis2: 0, axis3: -12 },   // 受容型_ハイブリッド型_寄り添い型
  { axis1: -12, axis2: -12, axis3: 12 },  // 受容型_感情型_リード型
  { axis1: -12, axis2: -12, axis3: 0 },   // 受容型_感情型_対等型
  { axis1: -12, axis2: -12, axis3: -12 }, // 受容型_感情型_寄り添い型
];

for (const scores of testScores) {
  const type = getPersonalityType(scores.axis1, scores.axis2, scores.axis3, "18");
  allTypeCodes.add(type.type);
}

console.log(`\n生成されたタイプ数: ${allTypeCodes.size}/27`);
console.log("\n生成されたタイプ一覧:");
Array.from(allTypeCodes).sort().forEach((typeCode, index) => {
  console.log(`  ${index + 1}. ${typeCode}`);
});

if (allTypeCodes.size === 27) {
  console.log("\n✅ 全27タイプが正しく生成されています！");
} else {
  console.log(`\n⚠️  警告: ${27 - allTypeCodes.size}個のタイプが生成されていません`);
}




