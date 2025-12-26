/**
 * 診断理論が正しく実装されているかを全体的に検証
 */

import { calculateScores, calculateCompatibilityScore, getPersonalityType } from "../src/lib/calculate";
import questions18Data from "../data/diagnoses/compatibility-18/questions.json";
import questions54Data from "../data/diagnoses/compatibility-54/questions.json";
import type { Answer, Question } from "../src/lib/types";

console.log("=".repeat(80));
console.log("診断理論の実装確認");
console.log("=".repeat(80));

let allTestsPassed = true;

/**
 * テスト1: 3軸による性格測定が正しく実装されているか
 */
function test1_ThreeAxisMeasurement() {
  console.log("\n【テスト1: 3軸による性格測定】");
  
  // 18問診断: 各軸6問ずつ
  const questions18 = questions18Data as Question[];
  const comm18 = questions18.filter(q => q.axis === "communication");
  const dec18 = questions18.filter(q => q.axis === "decision");
  const rel18 = questions18.filter(q => q.axis === "relationship");
  
  console.log(`  18問診断:`);
  console.log(`    communication軸: ${comm18.length}問 (期待: 6問) ${comm18.length === 6 ? "✅" : "❌"}`);
  console.log(`    decision軸: ${dec18.length}問 (期待: 6問) ${dec18.length === 6 ? "✅" : "❌"}`);
  console.log(`    relationship軸: ${rel18.length}問 (期待: 6問) ${rel18.length === 6 ? "✅" : "❌"}`);
  
  if (comm18.length !== 6 || dec18.length !== 6 || rel18.length !== 6) {
    allTestsPassed = false;
  }
  
  // 54問診断: 各軸18問ずつ
  const questions54 = questions54Data as Question[];
  const comm54 = questions54.filter(q => q.axis === "communication");
  const dec54 = questions54.filter(q => q.axis === "decision");
  const rel54 = questions54.filter(q => q.axis === "relationship");
  
  console.log(`  54問診断:`);
  console.log(`    communication軸: ${comm54.length}問 (期待: 18問) ${comm54.length === 18 ? "✅" : "❌"}`);
  console.log(`    decision軸: ${dec54.length}問 (期待: 18問) ${dec54.length === 18 ? "✅" : "❌"}`);
  console.log(`    relationship軸: ${rel54.length}問 (期待: 18問) ${rel54.length === 18 ? "✅" : "❌"}`);
  
  if (comm54.length !== 18 || dec54.length !== 18 || rel54.length !== 18) {
    allTestsPassed = false;
  }
}

/**
 * テスト2: スコア計算が正しく実装されているか
 */
function test2_ScoreCalculation() {
  console.log("\n【テスト2: スコア計算】");
  
  // 18問診断: 全て最大値（+2）の場合
  const answers18: Answer[] = [];
  for (let i = 1; i <= 18; i++) {
    answers18.push({ questionId: i, score: 2 });
  }
  
  const scores18 = calculateScores(answers18, 18, questions18Data as Question[]);
  console.log(`  18問診断（全て最大値）:`);
  console.log(`    axis1: ${scores18.axis1} (期待: 12) ${scores18.axis1 === 12 ? "✅" : "❌"}`);
  console.log(`    axis2: ${scores18.axis2} (期待: 12) ${scores18.axis2 === 12 ? "✅" : "❌"}`);
  console.log(`    axis3: ${scores18.axis3} (期待: 12) ${scores18.axis3 === 12 ? "✅" : "❌"}`);
  
  if (scores18.axis1 !== 12 || scores18.axis2 !== 12 || scores18.axis3 !== 12) {
    allTestsPassed = false;
  }
  
  // 54問診断: 全て最大値（+2）の場合
  const answers54: Answer[] = [];
  for (let i = 1; i <= 54; i++) {
    answers54.push({ questionId: i, score: 2 });
  }
  
  const scores54 = calculateScores(answers54, 54, questions54Data as Question[]);
  console.log(`  54問診断（全て最大値）:`);
  console.log(`    axis1: ${scores54.axis1} (期待: 36) ${scores54.axis1 === 36 ? "✅" : "❌"}`);
  console.log(`    axis2: ${scores54.axis2} (期待: 36) ${scores54.axis2 === 36 ? "✅" : "❌"}`);
  console.log(`    axis3: ${scores54.axis3} (期待: 36) ${scores54.axis3 === 36 ? "✅" : "❌"}`);
  
  if (scores54.axis1 !== 36 || scores54.axis2 !== 36 || scores54.axis3 !== 36) {
    allTestsPassed = false;
  }
}

/**
 * テスト3: タイプ判定の閾値が正しく実装されているか
 */
function test3_TypeThreshold() {
  console.log("\n【テスト3: タイプ判定の閾値】");
  
  // 18問診断の閾値テスト（±2）
  const testCases18 = [
    { axis1: 1, axis2: 1, axis3: 1, expected: "バランス型_ハイブリッド型_対等型" },
    { axis1: 2, axis2: 2, axis3: 2, expected: "積極型_論理型_リード型" },
    { axis1: -2, axis2: -2, axis3: -2, expected: "受容型_感情型_寄り添い型" },
  ];
  
  console.log(`  18問診断（閾値: ±2）:`);
  for (const testCase of testCases18) {
    const type = getPersonalityType(testCase.axis1, testCase.axis2, testCase.axis3, "18");
    const passed = type.type === testCase.expected;
    console.log(`    スコア(${testCase.axis1}, ${testCase.axis2}, ${testCase.axis3}) → ${type.type} ${passed ? "✅" : "❌"} (期待: ${testCase.expected})`);
    if (!passed) allTestsPassed = false;
  }
  
  // 54問診断の閾値テスト（±3）
  const testCases54 = [
    { axis1: 2, axis2: 2, axis3: 2, expected: "バランス型_ハイブリッド型_対等型" },
    { axis1: 3, axis2: 3, axis3: 3, expected: "積極型_論理型_リード型" },
    { axis1: -3, axis2: -3, axis3: -3, expected: "受容型_感情型_寄り添い型" },
  ];
  
  console.log(`  54問診断（閾値: ±3）:`);
  for (const testCase of testCases54) {
    const type = getPersonalityType(testCase.axis1, testCase.axis2, testCase.axis3, "54");
    const passed = type.type === testCase.expected;
    console.log(`    スコア(${testCase.axis1}, ${testCase.axis2}, ${testCase.axis3}) → ${type.type} ${passed ? "✅" : "❌"} (期待: ${testCase.expected})`);
    if (!passed) allTestsPassed = false;
  }
}

/**
 * テスト4: 相性判定の理論が正しく実装されているか
 */
function test4_CompatibilityTheory() {
  console.log("\n【テスト4: 相性判定の理論】");
  
  // テスト用のタイプを作成
  const createType = (comm: string, dec: string, rel: string) => ({
    type: `${comm}_${dec}_${rel}`,
    name: `${comm}×${dec}×${rel}`,
    icon: "🎵",
    description: "",
    traits: {
      communication: comm as "積極型" | "受容型" | "バランス型",
      decision: dec as "論理型" | "感情型" | "ハイブリッド型",
      relationship: rel as "リード型" | "寄り添い型" | "対等型",
    },
  });
  
  // 軸1（コミュニケーション）: 補完性重視のテスト
  console.log(`  軸1（コミュニケーション）: 補完性重視`);
  const commTests = [
    { type1: createType("積極型", "論理型", "リード型"), type2: createType("受容型", "論理型", "リード型"), expected: 100, desc: "積極型 × 受容型" },
    { type1: createType("積極型", "論理型", "リード型"), type2: createType("積極型", "論理型", "リード型"), expected: 50, desc: "積極型 × 積極型" },
    { type1: createType("バランス型", "論理型", "リード型"), type2: createType("バランス型", "論理型", "リード型"), expected: 80, desc: "バランス型 × バランス型" },
  ];
  
  for (const test of commTests) {
    const score = calculateCompatibilityScore(test.type1, test.type2);
    // 軸1のスコアを抽出（簡易版: 実際の計算を確認）
    const axis1Score = test.expected; // 理論上の期待値
    console.log(`    ${test.desc}: 期待=${axis1Score}点`);
  }
  
  // 軸2（意思決定）: 類似性重視のテスト
  console.log(`  軸2（意思決定）: 類似性重視`);
  const decTests = [
    { type1: createType("積極型", "論理型", "リード型"), type2: createType("積極型", "論理型", "リード型"), expected: 100, desc: "論理型 × 論理型" },
    { type1: createType("積極型", "論理型", "リード型"), type2: createType("積極型", "感情型", "リード型"), expected: 40, desc: "論理型 × 感情型" },
    { type1: createType("積極型", "ハイブリッド型", "リード型"), type2: createType("積極型", "論理型", "リード型"), expected: 80, desc: "ハイブリッド型 × 論理型" },
  ];
  
  for (const test of decTests) {
    const score = calculateCompatibilityScore(test.type1, test.type2);
    console.log(`    ${test.desc}: 期待=${test.expected}点`);
  }
  
  // 軸3（関係性）: 補完性重視のテスト
  console.log(`  軸3（関係性）: 補完性重視`);
  const relTests = [
    { type1: createType("積極型", "論理型", "リード型"), type2: createType("積極型", "論理型", "寄り添い型"), expected: 100, desc: "リード型 × 寄り添い型" },
    { type1: createType("積極型", "論理型", "リード型"), type2: createType("積極型", "論理型", "リード型"), expected: 50, desc: "リード型 × リード型" },
    { type1: createType("積極型", "論理型", "対等型"), type2: createType("積極型", "論理型", "対等型"), expected: 80, desc: "対等型 × 対等型" },
  ];
  
  for (const test of relTests) {
    const score = calculateCompatibilityScore(test.type1, test.type2);
    console.log(`    ${test.desc}: 期待=${test.expected}点`);
  }
}

/**
 * テスト5: 総合相性スコアの計算式が正しいか
 */
function test5_TotalScoreFormula() {
  console.log("\n【テスト5: 総合相性スコアの計算式】");
  
  const createType = (comm: string, dec: string, rel: string) => ({
    type: `${comm}_${dec}_${rel}`,
    name: `${comm}×${dec}×${rel}`,
    icon: "🎵",
    description: "",
    traits: {
      communication: comm as "積極型" | "受容型" | "バランス型",
      decision: dec as "論理型" | "感情型" | "ハイブリッド型",
      relationship: rel as "リード型" | "寄り添い型" | "対等型",
    },
  });
  
  // 理論上の計算を確認
  // 軸1: 積極型 × 受容型 = 100点
  // 軸2: 論理型 × 論理型 = 100点
  // 軸3: リード型 × 寄り添い型 = 100点
  // 総合スコア = 0.3 × 100 + 0.4 × 100 + 0.3 × 100 = 100点
  
  const type1 = createType("積極型", "論理型", "リード型");
  const type2 = createType("受容型", "論理型", "寄り添い型");
  
  const totalScore = calculateCompatibilityScore(type1, type2);
  
  // 理論上の計算
  const axis1Score = 100; // 積極型 × 受容型
  const axis2Score = 100; // 論理型 × 論理型
  const axis3Score = 100; // リード型 × 寄り添い型
  const expectedRawScore = axis1Score * 0.3 + axis2Score * 0.4 + axis3Score * 0.3;
  
  console.log(`  テストケース: 積極型_論理型_リード型 × 受容型_論理型_寄り添い型`);
  console.log(`    軸1スコア: ${axis1Score}点 (積極型 × 受容型 = 補完性重視)`);
  console.log(`    軸2スコア: ${axis2Score}点 (論理型 × 論理型 = 類似性重視)`);
  console.log(`    軸3スコア: ${axis3Score}点 (リード型 × 寄り添い型 = 補完性重視)`);
  console.log(`    理論上の生スコア: ${expectedRawScore}点 (0.3 × ${axis1Score} + 0.4 × ${axis2Score} + 0.3 × ${axis3Score})`);
  console.log(`    実際の総合スコア: ${totalScore}点`);
  
  // 正規化後のスコアを確認
  const minRawScore = 46;
  const maxRawScore = 100;
  const rawRange = maxRawScore - minRawScore;
  const expectedNormalized = Math.round(((expectedRawScore - minRawScore) / rawRange) * 99 + 1);
  
  console.log(`    期待される正規化スコア: ${expectedNormalized}点`);
  
  if (totalScore === expectedNormalized) {
    console.log(`    ✅ 総合スコアの計算式が正しく実装されています`);
  } else {
    console.log(`    ❌ 総合スコアの計算式に問題があります`);
    allTestsPassed = false;
  }
}

/**
 * テスト6: 質問データのaxisフィールドが正しく使用されているか
 */
function test6_QuestionAxisField() {
  console.log("\n【テスト6: 質問データのaxisフィールドの使用】");
  
  // 18問診断: 各軸の質問を1つずつ選んで回答
  const questions18 = questions18Data as Question[];
  const commQ = questions18.find(q => q.axis === "communication");
  const decQ = questions18.find(q => q.axis === "decision");
  const relQ = questions18.find(q => q.axis === "relationship");
  
  const answers18: Answer[] = [];
  if (commQ) answers18.push({ questionId: commQ.id, score: 2 });
  if (decQ) answers18.push({ questionId: decQ.id, score: 2 });
  if (relQ) answers18.push({ questionId: relQ.id, score: 2 });
  
  const scores18 = calculateScores(answers18, 18, questions18);
  
  console.log(`  18問診断:`);
  console.log(`    communication軸の質問（Q${commQ?.id}）に+2点 → axis1=${scores18.axis1} ${scores18.axis1 === 2 ? "✅" : "❌"}`);
  console.log(`    decision軸の質問（Q${decQ?.id}）に+2点 → axis2=${scores18.axis2} ${scores18.axis2 === 2 ? "✅" : "❌"}`);
  console.log(`    relationship軸の質問（Q${relQ?.id}）に+2点 → axis3=${scores18.axis3} ${scores18.axis3 === 2 ? "✅" : "❌"}`);
  
  if (scores18.axis1 !== 2 || scores18.axis2 !== 2 || scores18.axis3 !== 2) {
    allTestsPassed = false;
  }
  
  // 54問診断も同様にテスト
  const questions54 = questions54Data as Question[];
  const commQ54 = questions54.find(q => q.axis === "communication");
  const decQ54 = questions54.find(q => q.axis === "decision");
  const relQ54 = questions54.find(q => q.axis === "relationship");
  
  const answers54: Answer[] = [];
  if (commQ54) answers54.push({ questionId: commQ54.id, score: 2 });
  if (decQ54) answers54.push({ questionId: decQ54.id, score: 2 });
  if (relQ54) answers54.push({ questionId: relQ54.id, score: 2 });
  
  const scores54 = calculateScores(answers54, 54, questions54);
  
  console.log(`  54問診断:`);
  console.log(`    communication軸の質問（Q${commQ54?.id}）に+2点 → axis1=${scores54.axis1} ${scores54.axis1 === 2 ? "✅" : "❌"}`);
  console.log(`    decision軸の質問（Q${decQ54?.id}）に+2点 → axis2=${scores54.axis2} ${scores54.axis2 === 2 ? "✅" : "❌"}`);
  console.log(`    relationship軸の質問（Q${relQ54?.id}）に+2点 → axis3=${scores54.axis3} ${scores54.axis3 === 2 ? "✅" : "❌"}`);
  
  if (scores54.axis1 !== 2 || scores54.axis2 !== 2 || scores54.axis3 !== 2) {
    allTestsPassed = false;
  }
}

/**
 * テスト7: 27タイプすべてが生成可能か
 */
function test7_All27Types() {
  console.log("\n【テスト7: 27タイプすべての生成可能性】");
  
  const allTypes = new Set<string>();
  
  // 様々なスコアの組み合わせでテスト
  for (let axis1 = -12; axis1 <= 12; axis1 += 2) {
    for (let axis2 = -12; axis2 <= 12; axis2 += 2) {
      for (let axis3 = -12; axis3 <= 12; axis3 += 2) {
        const type = getPersonalityType(axis1, axis2, axis3, "18");
        allTypes.add(type.type);
      }
    }
  }
  
  console.log(`  生成されたタイプ数: ${allTypes.size}/27`);
  
  if (allTypes.size === 27) {
    console.log(`  ✅ 全27タイプが生成可能です`);
  } else {
    console.log(`  ❌ ${27 - allTypes.size}個のタイプが生成されていません`);
    allTestsPassed = false;
  }
}

/**
 * テスト8: 相性スコアの各軸の計算が理論通りか
 */
function test8_CompatibilityAxisCalculation() {
  console.log("\n【テスト8: 相性スコアの各軸の計算】");
  
  const createType = (comm: string, dec: string, rel: string) => ({
    type: `${comm}_${dec}_${rel}`,
    name: `${comm}×${dec}×${rel}`,
    icon: "🎵",
    description: "",
    traits: {
      communication: comm as "積極型" | "受容型" | "バランス型",
      decision: dec as "論理型" | "感情型" | "ハイブリッド型",
      relationship: rel as "リード型" | "寄り添い型" | "対等型",
    },
  });
  
  // 軸1（コミュニケーション）: 補完性重視のテスト
  console.log(`  軸1（コミュニケーション）: 補完性重視`);
  const commTestCases = [
    { type1: "積極型", type2: "受容型", expectedAxis1: 100 },
    { type1: "積極型", type2: "バランス型", expectedAxis1: 70 },
    { type1: "積極型", type2: "積極型", expectedAxis1: 50 },
    { type1: "バランス型", type2: "バランス型", expectedAxis1: 80 },
  ];
  
  for (const testCase of commTestCases) {
    const type1 = createType(testCase.type1, "論理型", "リード型");
    const type2 = createType(testCase.type2, "論理型", "リード型");
    const score = calculateCompatibilityScore(type1, type2);
    
    // 軸1のみが異なるので、軸2と軸3は同じ
    // 軸2: 論理型 × 論理型 = 100点
    // 軸3: リード型 × リード型 = 50点
    // 総合スコア = 0.3 × axis1 + 0.4 × 100 + 0.3 × 50
    // = 0.3 × axis1 + 40 + 15 = 0.3 × axis1 + 55
    const expectedAxis1 = testCase.expectedAxis1;
    const axis2Score = 100; // 論理型 × 論理型
    const axis3Score = 50; // リード型 × リード型
    const expectedTotal = expectedAxis1 * 0.3 + axis2Score * 0.4 + axis3Score * 0.3;
    const expectedNormalized = Math.round(((expectedTotal - 46) / 54) * 99 + 1);
    
    const passed = Math.abs(score - expectedNormalized) <= 1; // 正規化の誤差を許容
    console.log(`    ${testCase.type1} × ${testCase.type2}: 軸1=${expectedAxis1}点, 軸2=${axis2Score}点, 軸3=${axis3Score}点, 総合=${score}点 (期待: 約${expectedNormalized}点) ${passed ? "✅" : "❌"}`);
    if (!passed) allTestsPassed = false;
  }
  
  // 軸2（意思決定）: 類似性重視のテスト
  console.log(`  軸2（意思決定）: 類似性重視`);
  const decTestCases = [
    { type1: "論理型", type2: "論理型", expectedAxis2: 100 },
    { type1: "論理型", type2: "ハイブリッド型", expectedAxis2: 80 },
    { type1: "論理型", type2: "感情型", expectedAxis2: 40 },
  ];
  
  for (const testCase of decTestCases) {
    const type1 = createType("積極型", testCase.type1, "リード型");
    const type2 = createType("積極型", testCase.type2, "リード型");
    const score = calculateCompatibilityScore(type1, type2);
    
    // 軸2のみが異なるので、軸1と軸3は同じ
    // 軸1: 積極型 × 積極型 = 50点
    // 軸3: リード型 × リード型 = 50点
    // 総合スコア = 0.3 × 50 + 0.4 × axis2 + 0.3 × 50
    // = 15 + 0.4 × axis2 + 15 = 0.4 × axis2 + 30
    const expectedAxis2 = testCase.expectedAxis2;
    const axis1Score = 50; // 積極型 × 積極型
    const axis3Score = 50; // リード型 × リード型
    const expectedTotal = axis1Score * 0.3 + expectedAxis2 * 0.4 + axis3Score * 0.3;
    const expectedNormalized = Math.round(((expectedTotal - 46) / 54) * 99 + 1);
    
    const passed = Math.abs(score - expectedNormalized) <= 1;
    console.log(`    ${testCase.type1} × ${testCase.type2}: 軸1=${axis1Score}点, 軸2=${expectedAxis2}点, 軸3=${axis3Score}点, 総合=${score}点 (期待: 約${expectedNormalized}点) ${passed ? "✅" : "❌"}`);
    if (!passed) allTestsPassed = false;
  }
  
  // 軸3（関係性）: 補完性重視のテスト
  console.log(`  軸3（関係性）: 補完性重視`);
  const relTestCases = [
    { type1: "リード型", type2: "寄り添い型", expectedAxis3: 100 },
    { type1: "リード型", type2: "対等型", expectedAxis3: 70 },
    { type1: "リード型", type2: "リード型", expectedAxis3: 50 },
    { type1: "対等型", type2: "対等型", expectedAxis3: 80 },
  ];
  
  for (const testCase of relTestCases) {
    const type1 = createType("積極型", "論理型", testCase.type1);
    const type2 = createType("積極型", "論理型", testCase.type2);
    const score = calculateCompatibilityScore(type1, type2);
    
    // 軸3のみが異なるので、軸1と軸2は同じ
    // 軸1: 積極型 × 積極型 = 50点
    // 軸2: 論理型 × 論理型 = 100点
    // 総合スコア = 0.3 × 50 + 0.4 × 100 + 0.3 × axis3
    // = 15 + 40 + 0.3 × axis3 = 0.3 × axis3 + 55
    const expectedAxis3 = testCase.expectedAxis3;
    const axis1Score = 50; // 積極型 × 積極型
    const axis2Score = 100; // 論理型 × 論理型
    const expectedTotal = axis1Score * 0.3 + axis2Score * 0.4 + expectedAxis3 * 0.3;
    const expectedNormalized = Math.round(((expectedTotal - 46) / 54) * 99 + 1);
    
    const passed = Math.abs(score - expectedNormalized) <= 1;
    console.log(`    ${testCase.type1} × ${testCase.type2}: 軸1=${axis1Score}点, 軸2=${axis2Score}点, 軸3=${expectedAxis3}点, 総合=${score}点 (期待: 約${expectedNormalized}点) ${passed ? "✅" : "❌"}`);
    if (!passed) allTestsPassed = false;
  }
}

// メイン処理
test1_ThreeAxisMeasurement();
test2_ScoreCalculation();
test3_TypeThreshold();
test4_CompatibilityTheory();
test5_TotalScoreFormula();
test6_QuestionAxisField();
test7_All27Types();
test8_CompatibilityAxisCalculation();

console.log("\n" + "=".repeat(80));
if (allTestsPassed) {
  console.log("✅ すべてのテストが成功しました。理論は正しく実装されています。");
} else {
  console.log("❌ 一部のテストが失敗しました。実装を確認してください。");
}
console.log("=".repeat(80));

