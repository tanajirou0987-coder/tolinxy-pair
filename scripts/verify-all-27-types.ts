/**
 * 27タイプすべてが生成可能で、均等に分布するかを検証
 */

import { calculateScores } from "../src/lib/calculate";
import { getPersonalityType } from "../src/lib/calculate";
import type { Answer } from "../src/lib/types";

console.log("=".repeat(80));
console.log("27タイプすべての生成可能性と均等性の検証");
console.log("=".repeat(80));

/**
 * 全27タイプが生成可能か確認
 */
function verifyAll27TypesCanBeGenerated() {
  console.log("\n【全27タイプの生成可能性確認】");
  
  const allTypeCodes = new Set<string>();
  
  // 18問診断: スコア範囲 -12～+12
  // 各軸で様々なスコアをテスト
  const testScores18 = [];
  for (let axis1 = -12; axis1 <= 12; axis1 += 1) {
    for (let axis2 = -12; axis2 <= 12; axis2 += 1) {
      for (let axis3 = -12; axis3 <= 12; axis3 += 1) {
        testScores18.push({ axis1, axis2, axis3 });
      }
    }
  }
  
  console.log(`\n18問診断: ${testScores18.length}通りのスコア組み合わせをテスト`);
  
  for (const scores of testScores18) {
    const type = getPersonalityType(scores.axis1, scores.axis2, scores.axis3, "18");
    allTypeCodes.add(type.type);
  }
  
  console.log(`生成されたタイプ数: ${allTypeCodes.size}/27`);
  
  if (allTypeCodes.size === 27) {
    console.log("✅ 全27タイプが生成可能です");
  } else {
    console.log(`❌ 警告: ${27 - allTypeCodes.size}個のタイプが生成されていません`);
  }
  
  console.log("\n生成されたタイプ一覧:");
  Array.from(allTypeCodes).sort().forEach((typeCode, index) => {
    console.log(`  ${index + 1}. ${typeCode}`);
  });
  
  // 54問診断も確認
  const allTypeCodes54 = new Set<string>();
  const testScores54 = [];
  for (let axis1 = -36; axis1 <= 36; axis1 += 2) {
    for (let axis2 = -36; axis2 <= 36; axis2 += 2) {
      for (let axis3 = -36; axis3 <= 36; axis3 += 2) {
        testScores54.push({ axis1, axis2, axis3 });
      }
    }
  }
  
  console.log(`\n54問診断: ${testScores54.length}通りのスコア組み合わせをテスト`);
  
  for (const scores of testScores54) {
    const type = getPersonalityType(scores.axis1, scores.axis2, scores.axis3, "54");
    allTypeCodes54.add(type.type);
  }
  
  console.log(`生成されたタイプ数: ${allTypeCodes54.size}/27`);
  
  if (allTypeCodes54.size === 27) {
    console.log("✅ 全27タイプが生成可能です");
  } else {
    console.log(`❌ 警告: ${27 - allTypeCodes54.size}個のタイプが生成されていません`);
  }
  
  return { allTypeCodes18: allTypeCodes, allTypeCodes54 };
}

/**
 * 様々な回答パターンで27タイプすべてが出るか確認
 */
function verifyAllTypesInRealisticPatterns() {
  console.log("\n【実際の回答パターンでの27タイプ生成確認】");
  
  // 様々な回答パターンを生成
  const generateAnswers = (pattern: "extreme" | "moderate" | "balanced" | "mixed", totalQuestions: number): Answer[] => {
    const answers: Answer[] = [];
    
    for (let i = 1; i <= totalQuestions; i++) {
      let score: -2 | -1 | 0 | 1 | 2;
      
      if (pattern === "extreme") {
        // 極端なパターン: ランダムに±2を選択
        score = Math.random() > 0.5 ? 2 : -2;
      } else if (pattern === "moderate") {
        // 中程度のパターン: ±1を選択
        score = Math.random() > 0.5 ? 1 : -1;
      } else if (pattern === "balanced") {
        // バランス型: 0を選択
        score = 0;
      } else {
        // 混合パターン: ランダム
        const rand = Math.random();
        if (rand < 0.2) score = -2;
        else if (rand < 0.4) score = -1;
        else if (rand < 0.6) score = 0;
        else if (rand < 0.8) score = 1;
        else score = 2;
      }
      
      answers.push({ questionId: i, score });
    }
    
    return answers;
  };
  
  const typeCounts18: Record<string, number> = {};
  const typeCounts54: Record<string, number> = {};
  const testCount = 50000; // 50,000回の診断をシミュレート
  
  console.log(`\n${testCount}回の診断をシミュレート（様々な回答パターンを含む）`);
  
  for (let i = 0; i < testCount; i++) {
    // ランダムにパターンを選択
    const patterns: Array<"extreme" | "moderate" | "balanced" | "mixed"> = ["extreme", "moderate", "balanced", "mixed"];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // 18問診断
    const answers18 = generateAnswers(pattern, 18);
    const scores18 = calculateScores(answers18, 18);
    const type18 = getPersonalityType(scores18.axis1, scores18.axis2, scores18.axis3, "18");
    typeCounts18[type18.type] = (typeCounts18[type18.type] || 0) + 1;
    
    // 54問診断
    const answers54 = generateAnswers(pattern, 54);
    const scores54 = calculateScores(answers54, 54);
    const type54 = getPersonalityType(scores54.axis1, scores54.axis2, scores54.axis3, "54");
    typeCounts54[type54.type] = (typeCounts54[type54.type] || 0) + 1;
  }
  
  console.log(`\n18問診断: ${Object.keys(typeCounts18).length}/27タイプが生成されました`);
  console.log(`54問診断: ${Object.keys(typeCounts54).length}/27タイプが生成されました`);
  
  // 生成されなかったタイプを確認
  const allExpectedTypes = [
    "積極型_論理型_リード型", "積極型_論理型_対等型", "積極型_論理型_寄り添い型",
    "積極型_ハイブリッド型_リード型", "積極型_ハイブリッド型_対等型", "積極型_ハイブリッド型_寄り添い型",
    "積極型_感情型_リード型", "積極型_感情型_対等型", "積極型_感情型_寄り添い型",
    "バランス型_論理型_リード型", "バランス型_論理型_対等型", "バランス型_論理型_寄り添い型",
    "バランス型_ハイブリッド型_リード型", "バランス型_ハイブリッド型_対等型", "バランス型_ハイブリッド型_寄り添い型",
    "バランス型_感情型_リード型", "バランス型_感情型_対等型", "バランス型_感情型_寄り添い型",
    "受容型_論理型_リード型", "受容型_論理型_対等型", "受容型_論理型_寄り添い型",
    "受容型_ハイブリッド型_リード型", "受容型_ハイブリッド型_対等型", "受容型_ハイブリッド型_寄り添い型",
    "受容型_感情型_リード型", "受容型_感情型_対等型", "受容型_感情型_寄り添い型",
  ];
  
  const missing18 = allExpectedTypes.filter(type => !typeCounts18[type]);
  const missing54 = allExpectedTypes.filter(type => !typeCounts54[type]);
  
  if (missing18.length > 0) {
    console.log(`\n⚠️  18問診断で生成されなかったタイプ: ${missing18.length}個`);
    missing18.forEach(type => console.log(`  - ${type}`));
  } else {
    console.log("\n✅ 18問診断: 全27タイプが生成されました");
  }
  
  if (missing54.length > 0) {
    console.log(`\n⚠️  54問診断で生成されなかったタイプ: ${missing54.length}個`);
    missing54.forEach(type => console.log(`  - ${type}`));
  } else {
    console.log("\n✅ 54問診断: 全27タイプが生成されました");
  }
  
  return { typeCounts18, typeCounts54 };
}

/**
 * 分布の均等性を確認
 */
function verifyDistributionEvenness(typeCounts18: Record<string, number>, typeCounts54: Record<string, number>) {
  console.log("\n【分布の均等性確認】");
  
  const testCount = 50000;
  const expectedCount = testCount / 27;
  
  console.log(`\n18問診断の分布:`);
  const sorted18 = Object.entries(typeCounts18).sort((a, b) => b[1] - a[1]);
  const min18 = Math.min(...Object.values(typeCounts18));
  const max18 = Math.max(...Object.values(typeCounts18));
  const ratio18 = (max18 / min18).toFixed(2);
  
  console.log(`  期待値: ${expectedCount.toFixed(2)}回/タイプ`);
  console.log(`  最小出現回数: ${min18}回`);
  console.log(`  最大出現回数: ${max18}回`);
  console.log(`  最大/最小比: ${ratio18}倍`);
  
  sorted18.forEach(([typeCode, count]) => {
    const percentage = ((count / testCount) * 100).toFixed(2);
    const deviation = ((count - expectedCount) / expectedCount * 100).toFixed(1);
    console.log(`  ${typeCode.padEnd(40)}: ${count.toString().padStart(5)}回 (${percentage.padStart(5)}%, 偏差: ${deviation.padStart(5)}%)`);
  });
  
  console.log(`\n54問診断の分布:`);
  const sorted54 = Object.entries(typeCounts54).sort((a, b) => b[1] - a[1]);
  const min54 = Math.min(...Object.values(typeCounts54));
  const max54 = Math.max(...Object.values(typeCounts54));
  const ratio54 = (max54 / min54).toFixed(2);
  
  console.log(`  期待値: ${expectedCount.toFixed(2)}回/タイプ`);
  console.log(`  最小出現回数: ${min54}回`);
  console.log(`  最大出現回数: ${max54}回`);
  console.log(`  最大/最小比: ${ratio54}倍`);
  
  sorted54.forEach(([typeCode, count]) => {
    const percentage = ((count / testCount) * 100).toFixed(2);
    const deviation = ((count - expectedCount) / expectedCount * 100).toFixed(1);
    console.log(`  ${typeCode.padEnd(40)}: ${count.toString().padStart(5)}回 (${percentage.padStart(5)}%, 偏差: ${deviation.padStart(5)}%)`);
  });
  
  // 均等性の評価
  console.log("\n【均等性の評価】");
  if (parseFloat(ratio18) <= 5 && parseFloat(ratio54) <= 5) {
    console.log("✅ 分布は比較的均等です（最大/最小比が5倍以下）");
  } else if (parseFloat(ratio18) <= 10 && parseFloat(ratio54) <= 10) {
    console.log("⚠️  分布にやや偏りがあります（最大/最小比が5-10倍）");
  } else {
    console.log("❌ 分布に大きな偏りがあります（最大/最小比が10倍以上）");
  }
}

// メイン処理
const { allTypeCodes18, allTypeCodes54 } = verifyAll27TypesCanBeGenerated();
const { typeCounts18, typeCounts54 } = verifyAllTypesInRealisticPatterns();
verifyDistributionEvenness(typeCounts18, typeCounts54);

console.log("\n" + "=".repeat(80));
console.log("検証完了");
console.log("=".repeat(80));


