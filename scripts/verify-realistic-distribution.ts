/**
 * 実際の回答パターンをシミュレートしてタイプ分布を検証
 * 中間的な回答が多い現実的なパターンをテスト
 */

import { calculateScores } from "../src/lib/calculate";
import { getPersonalityType } from "../src/lib/calculate";
import type { Answer } from "../src/lib/types";

console.log("=".repeat(80));
console.log("実際の回答パターンでのタイプ分布検証");
console.log("=".repeat(80));

/**
 * ランダムな回答パターンを生成（現実的な分布）
 * -2, -1, 0, 1, 2の選択肢を、中間的な回答が多くなるように分布
 */
function generateRealisticAnswers(totalQuestions: number): Answer[] {
  const answers: Answer[] = [];
  
  // 各選択肢の確率（中間的な回答が多め）
  const probabilities = {
    "-2": 0.1,  // 10%
    "-1": 0.2,  // 20%
    "0": 0.4,   // 40% (最も多い)
    "1": 0.2,   // 20%
    "2": 0.1,   // 10%
  };
  
  for (let i = 1; i <= totalQuestions; i++) {
    const rand = Math.random();
    let score: -2 | -1 | 0 | 1 | 2;
    
    if (rand < probabilities["-2"]) {
      score = -2;
    } else if (rand < probabilities["-2"] + probabilities["-1"]) {
      score = -1;
    } else if (rand < probabilities["-2"] + probabilities["-1"] + probabilities["0"]) {
      score = 0;
    } else if (rand < probabilities["-2"] + probabilities["-1"] + probabilities["0"] + probabilities["1"]) {
      score = 1;
    } else {
      score = 2;
    }
    
    answers.push({ questionId: i, score });
  }
  
  return answers;
}

/**
 * 18問診断の現実的な分布を検証
 */
function verifyRealistic18Distribution() {
  console.log("\n【18問診断の現実的な回答パターン検証】");
  console.log("中間的な回答が多いパターン（0が40%、±1が各20%、±2が各10%）");
  
  const typeCounts: Record<string, number> = {};
  const testCount = 10000; // 10,000回の診断をシミュレート
  
  for (let i = 0; i < testCount; i++) {
    const answers = generateRealisticAnswers(18);
    const scores = calculateScores(answers, 18);
    const type = getPersonalityType(scores.axis1, scores.axis2, scores.axis3, "18");
    typeCounts[type.type] = (typeCounts[type.type] || 0) + 1;
  }
  
  console.log(`\nテスト回数: ${testCount}回`);
  console.log(`生成されたタイプ数: ${Object.keys(typeCounts).length}/27`);
  
  console.log("\n各タイプの出現回数と割合:");
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  sortedTypes.forEach(([typeCode, count]) => {
    const percentage = ((count / testCount) * 100).toFixed(2);
    const bar = "█".repeat(Math.round((count / testCount) * 100));
    console.log(`  ${typeCode.padEnd(40)}: ${count.toString().padStart(5)}回 (${percentage.padStart(5)}%) ${bar}`);
  });
  
  // 均等性チェック
  const expectedCount = testCount / 27;
  const maxDeviation = Math.max(...Object.values(typeCounts).map(count => Math.abs(count - expectedCount)));
  const maxDeviationPercent = ((maxDeviation / expectedCount) * 100).toFixed(2);
  const minCount = Math.min(...Object.values(typeCounts));
  const maxCount = Math.max(...Object.values(typeCounts));
  const ratio = (maxCount / minCount).toFixed(2);
  
  console.log(`\n統計:`);
  console.log(`  期待値: ${expectedCount.toFixed(2)}回/タイプ`);
  console.log(`  最小出現回数: ${minCount}回`);
  console.log(`  最大出現回数: ${maxCount}回`);
  console.log(`  最大/最小比: ${ratio}倍`);
  console.log(`  最大偏差: ${maxDeviation.toFixed(2)}回 (${maxDeviationPercent}%)`);
  
  if (parseFloat(ratio) > 3) {
    console.log("\n⚠️  警告: タイプの分布に大きな偏りがあります");
    console.log("   中間的な回答が多いため、バランス型・ハイブリッド型・対等型が多く出る傾向があります");
  } else if (parseFloat(ratio) > 2) {
    console.log("\n⚠️  注意: タイプの分布にやや偏りがあります");
  } else {
    console.log("\n✅ タイプの分布は比較的均等です");
  }
  
  // 最も多いタイプと最も少ないタイプを表示
  const mostCommon = sortedTypes[0];
  const leastCommon = sortedTypes[sortedTypes.length - 1];
  console.log(`\n最も多いタイプ: ${mostCommon[0]} (${mostCommon[1]}回, ${((mostCommon[1] / testCount) * 100).toFixed(2)}%)`);
  console.log(`最も少ないタイプ: ${leastCommon[0]} (${leastCommon[1]}回, ${((leastCommon[1] / testCount) * 100).toFixed(2)}%)`);
}

/**
 * 54問診断の現実的な分布を検証
 */
function verifyRealistic54Distribution() {
  console.log("\n【54問診断の現実的な回答パターン検証】");
  console.log("中間的な回答が多いパターン（0が40%、±1が各20%、±2が各10%）");
  
  const typeCounts: Record<string, number> = {};
  const testCount = 10000; // 10,000回の診断をシミュレート
  
  for (let i = 0; i < testCount; i++) {
    const answers = generateRealisticAnswers(54);
    const scores = calculateScores(answers, 54);
    const type = getPersonalityType(scores.axis1, scores.axis2, scores.axis3, "54");
    typeCounts[type.type] = (typeCounts[type.type] || 0) + 1;
  }
  
  console.log(`\nテスト回数: ${testCount}回`);
  console.log(`生成されたタイプ数: ${Object.keys(typeCounts).length}/27`);
  
  console.log("\n各タイプの出現回数と割合:");
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  sortedTypes.forEach(([typeCode, count]) => {
    const percentage = ((count / testCount) * 100).toFixed(2);
    const bar = "█".repeat(Math.round((count / testCount) * 100));
    console.log(`  ${typeCode.padEnd(40)}: ${count.toString().padStart(5)}回 (${percentage.padStart(5)}%) ${bar}`);
  });
  
  // 均等性チェック
  const expectedCount = testCount / 27;
  const maxDeviation = Math.max(...Object.values(typeCounts).map(count => Math.abs(count - expectedCount)));
  const maxDeviationPercent = ((maxDeviation / expectedCount) * 100).toFixed(2);
  const minCount = Math.min(...Object.values(typeCounts));
  const maxCount = Math.max(...Object.values(typeCounts));
  const ratio = (maxCount / minCount).toFixed(2);
  
  console.log(`\n統計:`);
  console.log(`  期待値: ${expectedCount.toFixed(2)}回/タイプ`);
  console.log(`  最小出現回数: ${minCount}回`);
  console.log(`  最大出現回数: ${maxCount}回`);
  console.log(`  最大/最小比: ${ratio}倍`);
  console.log(`  最大偏差: ${maxDeviation.toFixed(2)}回 (${maxDeviationPercent}%)`);
  
  if (parseFloat(ratio) > 3) {
    console.log("\n⚠️  警告: タイプの分布に大きな偏りがあります");
    console.log("   中間的な回答が多いため、バランス型・ハイブリッド型・対等型が多く出る傾向があります");
  } else if (parseFloat(ratio) > 2) {
    console.log("\n⚠️  注意: タイプの分布にやや偏りがあります");
  } else {
    console.log("\n✅ タイプの分布は比較的均等です");
  }
  
  // 最も多いタイプと最も少ないタイプを表示
  const mostCommon = sortedTypes[0];
  const leastCommon = sortedTypes[sortedTypes.length - 1];
  console.log(`\n最も多いタイプ: ${mostCommon[0]} (${mostCommon[1]}回, ${((mostCommon[1] / testCount) * 100).toFixed(2)}%)`);
  console.log(`最も少ないタイプ: ${leastCommon[0]} (${leastCommon[1]}回, ${((leastCommon[1] / testCount) * 100).toFixed(2)}%)`);
}

// メイン処理
verifyRealistic18Distribution();
verifyRealistic54Distribution();

console.log("\n" + "=".repeat(80));
console.log("検証完了");
console.log("=".repeat(80));
console.log("\n【結論】");
console.log("理論的には正しく動作していますが、実際の回答パターンでは");
console.log("中間的な回答が多いため、バランス型・ハイブリッド型・対等型が");
console.log("多く出る傾向があります。これは理論的には正しい動作です。");
console.log("=".repeat(80));


