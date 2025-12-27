/**
 * 中間的な回答（0点）を選び続けた場合のスコアとタイプを分析
 */

import { calculateScores, getPersonalityType } from "../src/lib/calculate";
import type { Answer } from "../src/lib/types";

console.log("=".repeat(80));
console.log("中間的な回答が閾値付近になる理由の分析");
console.log("=".repeat(80));

/**
 * 全て0点（真ん中）を選んだ場合
 */
function analyzeAllZeroAnswers() {
  console.log("\n【ケース1: 全て0点（真ん中）を選び続けた場合】");
  
  // 18問診断: 全て0点
  const answers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    answers18.push({ questionId: i, score: 0 });
  }
  
  const scores18 = calculateScores(answers18, 18);
  const type18 = getPersonalityType(scores18.axis1, scores18.axis2, scores18.axis3, "18");
  
  console.log("\n18問診断:");
  console.log(`  各質問: 全て0点（真ん中）を選択`);
  console.log(`  各軸のスコア:`);
  console.log(`    axis1 (communication): ${scores18.axis1}点`);
  console.log(`    axis2 (decision): ${scores18.axis2}点`);
  console.log(`    axis3 (relationship): ${scores18.axis3}点`);
  console.log(`  閾値: ±2`);
  console.log(`  判定:`);
  console.log(`    axis1: ${scores18.axis1}点 → ${scores18.axis1 >= 2 ? "積極型" : scores18.axis1 <= -2 ? "受容型" : "バランス型"} (閾値内)`);
  console.log(`    axis2: ${scores18.axis2}点 → ${scores18.axis2 >= 2 ? "論理型" : scores18.axis2 <= -2 ? "感情型" : "ハイブリッド型"} (閾値内)`);
  console.log(`    axis3: ${scores18.axis3}点 → ${scores18.axis3 >= 2 ? "リード型" : scores18.axis3 <= -2 ? "寄り添い型" : "対等型"} (閾値内)`);
  console.log(`  結果のタイプ: ${type18.type}`);
  
  // 54問診断: 全て0点
  const answers54: Answer[] = [];
  for (let i = 1; i <= 54; i++) {
    answers54.push({ questionId: i, score: 0 });
  }
  
  const scores54 = calculateScores(answers54, 54);
  const type54 = getPersonalityType(scores54.axis1, scores54.axis2, scores54.axis3, "54");
  
  console.log("\n54問診断:");
  console.log(`  各質問: 全て0点（真ん中）を選択`);
  console.log(`  各軸のスコア:`);
  console.log(`    axis1 (communication): ${scores54.axis1}点`);
  console.log(`    axis2 (decision): ${scores54.axis2}点`);
  console.log(`    axis3 (relationship): ${scores54.axis3}点`);
  console.log(`  閾値: ±3`);
  console.log(`  判定:`);
  console.log(`    axis1: ${scores54.axis1}点 → ${scores54.axis1 >= 3 ? "積極型" : scores54.axis1 <= -3 ? "受容型" : "バランス型"} (閾値内)`);
  console.log(`    axis2: ${scores54.axis2}点 → ${scores54.axis2 >= 3 ? "論理型" : scores54.axis2 <= -3 ? "感情型" : "ハイブリッド型"} (閾値内)`);
  console.log(`    axis3: ${scores54.axis3}点 → ${scores54.axis3 >= 3 ? "リード型" : scores54.axis3 <= -3 ? "寄り添い型" : "対等型"} (閾値内)`);
  console.log(`  結果のタイプ: ${type54.type}`);
}

/**
 * 中間的な回答が多い場合（0点が40%、±1が各20%、±2が各10%）
 */
function analyzeMixedIntermediateAnswers() {
  console.log("\n【ケース2: 中間的な回答が多い場合（現実的なパターン）】");
  console.log("選択肢の分布: 0点が40%、±1が各20%、±2が各10%");
  
  // 18問診断の例: 各軸で中間的な回答が多い場合
  // axis1: 0点が4問、±1が各1問 → スコア = 0
  // axis2: 0点が4問、±1が各1問 → スコア = 0
  // axis3: 0点が4問、±1が各1問 → スコア = 0
  
  const exampleAnswers18: Answer[] = [];
  // axis1 (Q1-Q6): 0点が4問、+1が1問、-1が1問
  exampleAnswers18.push({ questionId: 1, score: 0 });
  exampleAnswers18.push({ questionId: 2, score: 0 });
  exampleAnswers18.push({ questionId: 3, score: 0 });
  exampleAnswers18.push({ questionId: 4, score: 0 });
  exampleAnswers18.push({ questionId: 5, score: 1 });
  exampleAnswers18.push({ questionId: 6, score: -1 });
  
  // axis2 (Q7-Q12): 0点が4問、+1が1問、-1が1問
  exampleAnswers18.push({ questionId: 7, score: 0 });
  exampleAnswers18.push({ questionId: 8, score: 0 });
  exampleAnswers18.push({ questionId: 9, score: 0 });
  exampleAnswers18.push({ questionId: 10, score: 0 });
  exampleAnswers18.push({ questionId: 11, score: 1 });
  exampleAnswers18.push({ questionId: 12, score: -1 });
  
  // axis3 (Q13-Q18): 0点が4問、+1が1問、-1が1問
  exampleAnswers18.push({ questionId: 13, score: 0 });
  exampleAnswers18.push({ questionId: 14, score: 0 });
  exampleAnswers18.push({ questionId: 15, score: 0 });
  exampleAnswers18.push({ questionId: 16, score: 0 });
  exampleAnswers18.push({ questionId: 17, score: 1 });
  exampleAnswers18.push({ questionId: 18, score: -1 });
  
  const scores18 = calculateScores(exampleAnswers18, 18);
  const type18 = getPersonalityType(scores18.axis1, scores18.axis2, scores18.axis3, "18");
  
  console.log("\n18問診断の例:");
  console.log(`  各軸6問ずつ:`);
  console.log(`    axis1: 0点×4問 + 1点×1問 + (-1点)×1問 = ${scores18.axis1}点`);
  console.log(`    axis2: 0点×4問 + 1点×1問 + (-1点)×1問 = ${scores18.axis2}点`);
  console.log(`    axis3: 0点×4問 + 1点×1問 + (-1点)×1問 = ${scores18.axis3}点`);
  console.log(`  閾値: ±2`);
  console.log(`  判定:`);
  console.log(`    axis1: ${scores18.axis1}点 → ${scores18.axis1 >= 2 ? "積極型" : scores18.axis1 <= -2 ? "受容型" : "バランス型"} (閾値内)`);
  console.log(`    axis2: ${scores18.axis2}点 → ${scores18.axis2 >= 2 ? "論理型" : scores18.axis2 <= -2 ? "感情型" : "ハイブリッド型"} (閾値内)`);
  console.log(`    axis3: ${scores18.axis3}点 → ${scores18.axis3 >= 2 ? "リード型" : scores18.axis3 <= -2 ? "寄り添い型" : "対等型"} (閾値内)`);
  console.log(`  結果のタイプ: ${type18.type}`);
}

/**
 * 極端な回答が多い場合との比較
 */
function compareWithExtremeAnswers() {
  console.log("\n【ケース3: 極端な回答が多い場合との比較】");
  
  // 極端な回答: 全て+2点または-2点を選んだ場合
  const extremeAnswers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    extremeAnswers18.push({ questionId: i, score: 2 }); // 全て+2点
  }
  
  const extremeScores18 = calculateScores(extremeAnswers18, 18);
  const extremeType18 = getPersonalityType(extremeScores18.axis1, extremeScores18.axis2, extremeScores18.axis3, "18");
  
  console.log("\n18問診断:");
  console.log(`  全て+2点（強く当てはまる）を選択:`);
  console.log(`    各軸のスコア: axis1=${extremeScores18.axis1}, axis2=${extremeScores18.axis2}, axis3=${extremeScores18.axis3}`);
  console.log(`    閾値: ±2`);
  console.log(`    判定:`);
  console.log(`      axis1: ${extremeScores18.axis1}点 → ${extremeScores18.axis1 >= 2 ? "積極型" : extremeScores18.axis1 <= -2 ? "受容型" : "バランス型"} (閾値以上)`);
  console.log(`      axis2: ${extremeScores18.axis2}点 → ${extremeScores18.axis2 >= 2 ? "論理型" : extremeScores18.axis2 <= -2 ? "感情型" : "ハイブリッド型"} (閾値以上)`);
  console.log(`      axis3: ${extremeScores18.axis3}点 → ${extremeScores18.axis3 >= 2 ? "リード型" : extremeScores18.axis3 <= -2 ? "寄り添い型" : "対等型"} (閾値以上)`);
  console.log(`    結果のタイプ: ${extremeType18.type}`);
  
  // 全て0点の場合と比較
  const zeroAnswers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    zeroAnswers18.push({ questionId: i, score: 0 });
  }
  
  const zeroScores18 = calculateScores(zeroAnswers18, 18);
  const zeroType18 = getPersonalityType(zeroScores18.axis1, zeroScores18.axis2, zeroScores18.axis3, "18");
  
  console.log(`\n  全て0点（どちらでもない）を選択:`);
  console.log(`    各軸のスコア: axis1=${zeroScores18.axis1}, axis2=${zeroScores18.axis2}, axis3=${zeroScores18.axis3}`);
  console.log(`    閾値: ±2`);
  console.log(`    判定:`);
  console.log(`      axis1: ${zeroScores18.axis1}点 → ${zeroScores18.axis1 >= 2 ? "積極型" : zeroScores18.axis1 <= -2 ? "受容型" : "バランス型"} (閾値内)`);
  console.log(`      axis2: ${zeroScores18.axis2}点 → ${zeroScores18.axis2 >= 2 ? "論理型" : zeroScores18.axis2 <= -2 ? "感情型" : "ハイブリッド型"} (閾値内)`);
  console.log(`      axis3: ${zeroScores18.axis3}点 → ${zeroScores18.axis3 >= 2 ? "リード型" : zeroScores18.axis3 <= -2 ? "寄り添い型" : "対等型"} (閾値内)`);
  console.log(`    結果のタイプ: ${zeroType18.type}`);
}

/**
 * 閾値付近のスコアの分布を分析
 */
function analyzeThresholdDistribution() {
  console.log("\n【ケース4: 閾値付近のスコアの分布】");
  
  console.log("\n18問診断（閾値: ±2）:");
  console.log("  各軸6問ずつなので、スコア範囲は -12 ～ +12");
  console.log("  閾値付近のスコア範囲:");
  console.log("    -2 ≤ スコア ≤ +2 → バランス型/ハイブリッド型/対等型（中間的なタイプ）");
  console.log("    スコア ≥ +2 → 積極型/論理型/リード型（極端なタイプ）");
  console.log("    スコア ≤ -2 → 受容型/感情型/寄り添い型（極端なタイプ）");
  
  console.log("\n  中間的な回答が多い場合:");
  console.log("    例: 各軸で0点が4問、±1が各1問 → スコア = 0点（閾値内）");
  console.log("    例: 各軸で0点が3問、+1が2問、-1が1問 → スコア = +1点（閾値内）");
  console.log("    例: 各軸で0点が3問、+1が1問、-1が2問 → スコア = -1点（閾値内）");
  
  console.log("\n  極端な回答が多い場合:");
  console.log("    例: 各軸で+2が4問、+1が2問 → スコア = +10点（閾値以上）");
  console.log("    例: 各軸で-2が4問、-1が2問 → スコア = -10点（閾値以下）");
  
  console.log("\n54問診断（閾値: ±3）:");
  console.log("  各軸18問ずつなので、スコア範囲は -36 ～ +36");
  console.log("  閾値付近のスコア範囲:");
  console.log("    -3 ≤ スコア ≤ +3 → バランス型/ハイブリッド型/対等型（中間的なタイプ）");
  console.log("    スコア ≥ +3 → 積極型/論理型/リード型（極端なタイプ）");
  console.log("    スコア ≤ -3 → 受容型/感情型/寄り添い型（極端なタイプ）");
  
  console.log("\n  中間的な回答が多い場合:");
  console.log("    例: 各軸で0点が12問、±1が各3問 → スコア = 0点（閾値内）");
  console.log("    例: 各軸で0点が10問、+1が5問、-1が3問 → スコア = +2点（閾値内）");
  
  console.log("\n  極端な回答が多い場合:");
  console.log("    例: 各軸で+2が10問、+1が5問、0が3問 → スコア = +25点（閾値以上）");
}

// メイン処理
analyzeAllZeroAnswers();
analyzeMixedIntermediateAnswers();
compareWithExtremeAnswers();
analyzeThresholdDistribution();

console.log("\n" + "=".repeat(80));
console.log("【結論】");
console.log("中間的な回答（0点）を選び続けると、各軸のスコアが0点になり、");
console.log("閾値内（-2 ≤ 0 ≤ +2 または -3 ≤ 0 ≤ +3）に収まるため、");
console.log("中間的なタイプ（バランス型_ハイブリッド型_対等型）になります。");
console.log("=".repeat(80));


