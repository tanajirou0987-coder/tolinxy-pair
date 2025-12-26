/**
 * 診断の均等性と正確性を検証するスクリプト
 * 様々な回答パターンで各タイプが均等に出るかを確認
 */

import { calculateScores } from "../src/lib/calculate";
import { getPersonalityType } from "../src/lib/calculate";
import type { Answer } from "../src/lib/types";

// 18問診断の場合のスコア範囲: -12 ～ +12
// 54問診断の場合のスコア範囲: -36 ～ +36

console.log("=".repeat(80));
console.log("診断の均等性と正確性の検証");
console.log("=".repeat(80));

/**
 * 18問診断のタイプ分布を検証
 */
function verify18QuestionDistribution() {
  console.log("\n【18問診断のタイプ分布検証】");
  
  const typeCounts: Record<string, number> = {};
  const totalTests = 1000; // ランダムな回答パターンを1000通りテスト
  
  // 各軸のスコア範囲を均等にサンプリング
  const axisValues = [-12, -9, -6, -3, 0, 3, 6, 9, 12];
  
  for (const axis1 of axisValues) {
    for (const axis2 of axisValues) {
      for (const axis3 of axisValues) {
        const type = getPersonalityType(axis1, axis2, axis3, "18");
        typeCounts[type.type] = (typeCounts[type.type] || 0) + 1;
      }
    }
  }
  
  console.log(`\nテストケース数: ${axisValues.length ** 3}通り`);
  console.log(`生成されたタイプ数: ${Object.keys(typeCounts).length}/27`);
  
  console.log("\n各タイプの出現回数:");
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  sortedTypes.forEach(([typeCode, count]) => {
    const percentage = ((count / (axisValues.length ** 3)) * 100).toFixed(2);
    const bar = "█".repeat(Math.round((count / (axisValues.length ** 3)) * 100));
    console.log(`  ${typeCode.padEnd(40)}: ${count.toString().padStart(3)}回 (${percentage.padStart(5)}%) ${bar}`);
  });
  
  // 均等性チェック
  const expectedCount = (axisValues.length ** 3) / 27;
  const maxDeviation = Math.max(...Object.values(typeCounts).map(count => Math.abs(count - expectedCount)));
  const maxDeviationPercent = ((maxDeviation / expectedCount) * 100).toFixed(2);
  
  console.log(`\n期待値: ${expectedCount.toFixed(2)}回/タイプ`);
  console.log(`最大偏差: ${maxDeviation.toFixed(2)}回 (${maxDeviationPercent}%)`);
  
  if (maxDeviationPercent > "20") {
    console.log("⚠️  警告: タイプの分布に偏りがあります");
  } else {
    console.log("✅ タイプの分布は均等です");
  }
}

/**
 * 54問診断のタイプ分布を検証
 */
function verify54QuestionDistribution() {
  console.log("\n【54問診断のタイプ分布検証】");
  
  const typeCounts: Record<string, number> = {};
  
  // 各軸のスコア範囲を均等にサンプリング（54問の場合）
  const axisValues = [-36, -27, -18, -9, 0, 9, 18, 27, 36];
  
  for (const axis1 of axisValues) {
    for (const axis2 of axisValues) {
      for (const axis3 of axisValues) {
        const type = getPersonalityType(axis1, axis2, axis3, "54");
        typeCounts[type.type] = (typeCounts[type.type] || 0) + 1;
      }
    }
  }
  
  console.log(`\nテストケース数: ${axisValues.length ** 3}通り`);
  console.log(`生成されたタイプ数: ${Object.keys(typeCounts).length}/27`);
  
  console.log("\n各タイプの出現回数:");
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  sortedTypes.forEach(([typeCode, count]) => {
    const percentage = ((count / (axisValues.length ** 3)) * 100).toFixed(2);
    const bar = "█".repeat(Math.round((count / (axisValues.length ** 3)) * 100));
    console.log(`  ${typeCode.padEnd(40)}: ${count.toString().padStart(3)}回 (${percentage.padStart(5)}%) ${bar}`);
  });
  
  // 均等性チェック
  const expectedCount = (axisValues.length ** 3) / 27;
  const maxDeviation = Math.max(...Object.values(typeCounts).map(count => Math.abs(count - expectedCount)));
  const maxDeviationPercent = ((maxDeviation / expectedCount) * 100).toFixed(2);
  
  console.log(`\n期待値: ${expectedCount.toFixed(2)}回/タイプ`);
  console.log(`最大偏差: ${maxDeviation.toFixed(2)}回 (${maxDeviationPercent}%)`);
  
  if (maxDeviationPercent > "20") {
    console.log("⚠️  警告: タイプの分布に偏りがあります");
  } else {
    console.log("✅ タイプの分布は均等です");
  }
}

/**
 * 閾値付近の正確性を検証
 */
function verifyThresholdAccuracy() {
  console.log("\n【閾値付近の正確性検証】");
  
  console.log("\n18問診断の閾値テスト (±3):");
  const threshold18Tests = [
    { axis1: 2, axis2: 2, axis3: 2, expected: "バランス型_ハイブリッド型_対等型" },
    { axis1: 3, axis2: 3, axis3: 3, expected: "積極型_論理型_リード型" },
    { axis1: 4, axis2: 4, axis3: 4, expected: "積極型_論理型_リード型" },
    { axis1: -2, axis2: -2, axis3: -2, expected: "バランス型_ハイブリッド型_対等型" },
    { axis1: -3, axis2: -3, axis3: -3, expected: "受容型_感情型_寄り添い型" },
    { axis1: -4, axis2: -4, axis3: -4, expected: "受容型_感情型_寄り添い型" },
  ];
  
  let allCorrect18 = true;
  for (const test of threshold18Tests) {
    const type = getPersonalityType(test.axis1, test.axis2, test.axis3, "18");
    const isCorrect = type.type === test.expected;
    const status = isCorrect ? "✅" : "❌";
    console.log(`  ${status} スコア(${test.axis1}, ${test.axis2}, ${test.axis3}) → ${type.type} (期待: ${test.expected})`);
    if (!isCorrect) allCorrect18 = false;
  }
  
  console.log("\n54問診断の閾値テスト (±9):");
  const threshold54Tests = [
    { axis1: 8, axis2: 8, axis3: 8, expected: "バランス型_ハイブリッド型_対等型" },
    { axis1: 9, axis2: 9, axis3: 9, expected: "積極型_論理型_リード型" },
    { axis1: 10, axis2: 10, axis3: 10, expected: "積極型_論理型_リード型" },
    { axis1: -8, axis2: -8, axis3: -8, expected: "バランス型_ハイブリッド型_対等型" },
    { axis1: -9, axis2: -9, axis3: -9, expected: "受容型_感情型_寄り添い型" },
    { axis1: -10, axis2: -10, axis3: -10, expected: "受容型_感情型_寄り添い型" },
  ];
  
  let allCorrect54 = true;
  for (const test of threshold54Tests) {
    const type = getPersonalityType(test.axis1, test.axis2, test.axis3, "54");
    const isCorrect = type.type === test.expected;
    const status = isCorrect ? "✅" : "❌";
    console.log(`  ${status} スコア(${test.axis1}, ${test.axis2}, ${test.axis3}) → ${type.type} (期待: ${test.expected})`);
    if (!isCorrect) allCorrect54 = false;
  }
  
  if (allCorrect18 && allCorrect54) {
    console.log("\n✅ 閾値判定は正確です");
  } else {
    console.log("\n❌ 閾値判定に問題があります");
  }
}

/**
 * 実際の回答パターンからタイプを生成するテスト
 */
function verifyAnswerPatterns() {
  console.log("\n【実際の回答パターンの検証】");
  
  // 18問診断: 各軸6問ずつ
  // 極端なパターン: 全て最大値
  const extremeAnswers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    extremeAnswers18.push({ questionId: i, score: 2 });
  }
  const extremeScores18 = calculateScores(extremeAnswers18, 18);
  const extremeType18 = getPersonalityType(extremeScores18.axis1, extremeScores18.axis2, extremeScores18.axis3, "18");
  console.log(`\n極端なパターン（全て最大値）:`);
  console.log(`  スコア: (${extremeScores18.axis1}, ${extremeScores18.axis2}, ${extremeScores18.axis3})`);
  console.log(`  タイプ: ${extremeType18.type}`);
  
  // 極端なパターン: 全て最小値
  const minAnswers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    minAnswers18.push({ questionId: i, score: -2 });
  }
  const minScores18 = calculateScores(minAnswers18, 18);
  const minType18 = getPersonalityType(minScores18.axis1, minScores18.axis2, minScores18.axis3, "18");
  console.log(`\n極端なパターン（全て最小値）:`);
  console.log(`  スコア: (${minScores18.axis1}, ${minScores18.axis2}, ${minScores18.axis3})`);
  console.log(`  タイプ: ${minType18.type}`);
  
  // バランス型のパターン: 全て0
  const balancedAnswers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    balancedAnswers18.push({ questionId: i, score: 0 });
  }
  const balancedScores18 = calculateScores(balancedAnswers18, 18);
  const balancedType18 = getPersonalityType(balancedScores18.axis1, balancedScores18.axis2, balancedScores18.axis3, "18");
  console.log(`\nバランス型のパターン（全て0）:`);
  console.log(`  スコア: (${balancedScores18.axis1}, ${balancedScores18.axis2}, ${balancedScores18.axis3})`);
  console.log(`  タイプ: ${balancedType18.type}`);
  
  // 期待される結果を確認
  const expectedExtreme = "積極型_論理型_リード型";
  const expectedMin = "受容型_感情型_寄り添い型";
  const expectedBalanced = "バランス型_ハイブリッド型_対等型";
  
  console.log(`\n期待される結果:`);
  console.log(`  極端（最大）: ${expectedExtreme} ${extremeType18.type === expectedExtreme ? "✅" : "❌"}`);
  console.log(`  極端（最小）: ${expectedMin} ${minType18.type === expectedMin ? "✅" : "❌"}`);
  console.log(`  バランス: ${expectedBalanced} ${balancedType18.type === expectedBalanced ? "✅" : "❌"}`);
}

// メイン処理
verify18QuestionDistribution();
verify54QuestionDistribution();
verifyThresholdAccuracy();
verifyAnswerPatterns();

console.log("\n" + "=".repeat(80));
console.log("検証完了");
console.log("=".repeat(80));

