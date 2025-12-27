/**
 * 質問データのaxisフィールドと計算ロジックの一致を確認
 */

import questions18Data from "../data/diagnoses/compatibility-18/questions.json";
import questions54Data from "../data/diagnoses/compatibility-54/questions.json";

console.log("=".repeat(80));
console.log("質問データの軸の割り当てと計算ロジックの一致確認");
console.log("=".repeat(80));

/**
 * 18問診断の確認
 */
function verify18Questions() {
  console.log("\n【18問診断の確認】");
  
  const axisCounts: Record<string, number> = {
    communication: 0,
    decision: 0,
    relationship: 0,
  };
  
  const axisByQuestionId: Record<number, string> = {};
  
  questions18Data.forEach((question: any) => {
    const axis = question.axis;
    const questionId = question.id;
    
    axisCounts[axis] = (axisCounts[axis] || 0) + 1;
    axisByQuestionId[questionId] = axis;
  });
  
  console.log("\n質問データの軸の分布:");
  console.log(`  communication: ${axisCounts.communication}問`);
  console.log(`  decision: ${axisCounts.decision}問`);
  console.log(`  relationship: ${axisCounts.relationship}問`);
  console.log(`  合計: ${axisCounts.communication + axisCounts.decision + axisCounts.relationship}問`);
  
  // 計算ロジックとの一致確認
  console.log("\n計算ロジックとの一致確認:");
  console.log("  期待される割り当て:");
  console.log("    Q1-Q6: communication軸");
  console.log("    Q7-Q12: decision軸");
  console.log("    Q13-Q18: relationship軸");
  
  let mismatches: Array<{ questionId: number; expected: string; actual: string }> = [];
  
  for (let id = 1; id <= 18; id++) {
    let expectedAxis: string;
    if (id >= 1 && id <= 6) {
      expectedAxis = "communication";
    } else if (id >= 7 && id <= 12) {
      expectedAxis = "decision";
    } else {
      expectedAxis = "relationship";
    }
    
    const actualAxis = axisByQuestionId[id];
    
    if (actualAxis !== expectedAxis) {
      mismatches.push({ questionId: id, expected: expectedAxis, actual: actualAxis || "不明" });
    }
  }
  
  if (mismatches.length === 0) {
    console.log("\n✅ 質問データのaxisフィールドと計算ロジックが一致しています");
  } else {
    console.log(`\n❌ 不一致が見つかりました: ${mismatches.length}問`);
    mismatches.forEach(m => {
      console.log(`  質問ID ${m.questionId}: 期待=${m.expected}, 実際=${m.actual}`);
    });
  }
  
  // 各軸の質問IDを表示
  console.log("\n各軸の質問ID:");
  console.log("  communication軸:");
  for (let id = 1; id <= 18; id++) {
    if (axisByQuestionId[id] === "communication") {
      const q = questions18Data.find((q: any) => q.id === id);
      console.log(`    Q${id}: ${q?.text.substring(0, 40)}...`);
    }
  }
  
  console.log("  decision軸:");
  for (let id = 1; id <= 18; id++) {
    if (axisByQuestionId[id] === "decision") {
      const q = questions18Data.find((q: any) => q.id === id);
      console.log(`    Q${id}: ${q?.text.substring(0, 40)}...`);
    }
  }
  
  console.log("  relationship軸:");
  for (let id = 1; id <= 18; id++) {
    if (axisByQuestionId[id] === "relationship") {
      const q = questions18Data.find((q: any) => q.id === id);
      console.log(`    Q${id}: ${q?.text.substring(0, 40)}...`);
    }
  }
}

/**
 * 54問診断の確認
 */
function verify54Questions() {
  console.log("\n【54問診断の確認】");
  
  const axisCounts: Record<string, number> = {
    communication: 0,
    decision: 0,
    relationship: 0,
  };
  
  const axisByQuestionId: Record<number, string> = {};
  
  questions54Data.forEach((question: any) => {
    const axis = question.axis;
    const questionId = question.id;
    
    axisCounts[axis] = (axisCounts[axis] || 0) + 1;
    axisByQuestionId[questionId] = axis;
  });
  
  console.log("\n質問データの軸の分布:");
  console.log(`  communication: ${axisCounts.communication}問`);
  console.log(`  decision: ${axisCounts.decision}問`);
  console.log(`  relationship: ${axisCounts.relationship}問`);
  console.log(`  合計: ${axisCounts.communication + axisCounts.decision + axisCounts.relationship}問`);
  
  // 計算ロジックとの一致確認
  console.log("\n計算ロジックとの一致確認:");
  console.log("  期待される割り当て:");
  console.log("    Q1-Q18: communication軸");
  console.log("    Q19-Q36: decision軸");
  console.log("    Q37-Q54: relationship軸");
  
  let mismatches: Array<{ questionId: number; expected: string; actual: string }> = [];
  
  for (let id = 1; id <= 54; id++) {
    let expectedAxis: string;
    if (id >= 1 && id <= 18) {
      expectedAxis = "communication";
    } else if (id >= 19 && id <= 36) {
      expectedAxis = "decision";
    } else {
      expectedAxis = "relationship";
    }
    
    const actualAxis = axisByQuestionId[id];
    
    if (actualAxis !== expectedAxis) {
      mismatches.push({ questionId: id, expected: expectedAxis, actual: actualAxis || "不明" });
    }
  }
  
  if (mismatches.length === 0) {
    console.log("\n✅ 質問データのaxisフィールドと計算ロジックが一致しています");
  } else {
    console.log(`\n❌ 不一致が見つかりました: ${mismatches.length}問`);
    mismatches.forEach(m => {
      console.log(`  質問ID ${m.questionId}: 期待=${m.expected}, 実際=${m.actual}`);
    });
  }
  
  // 各軸の質問数の確認
  const communicationQuestions = questions54Data.filter((q: any) => q.axis === "communication");
  const decisionQuestions = questions54Data.filter((q: any) => q.axis === "decision");
  const relationshipQuestions = questions54Data.filter((q: any) => q.axis === "relationship");
  
  console.log("\n各軸の質問数（質問データのaxisフィールドから）:");
  console.log(`  communication: ${communicationQuestions.length}問`);
  console.log(`  decision: ${decisionQuestions.length}問`);
  console.log(`  relationship: ${relationshipQuestions.length}問`);
  
  // 各軸の最初の3問を表示
  console.log("\n各軸の質問例（最初の3問）:");
  console.log("  communication軸:");
  communicationQuestions.slice(0, 3).forEach((q: any) => {
    console.log(`    Q${q.id}: ${q.text.substring(0, 50)}...`);
  });
  
  console.log("  decision軸:");
  decisionQuestions.slice(0, 3).forEach((q: any) => {
    console.log(`    Q${q.id}: ${q.text.substring(0, 50)}...`);
  });
  
  console.log("  relationship軸:");
  relationshipQuestions.slice(0, 3).forEach((q: any) => {
    console.log(`    Q${q.id}: ${q.text.substring(0, 50)}...`);
  });
}

// メイン処理
verify18Questions();
verify54Questions();

console.log("\n" + "=".repeat(80));
console.log("検証完了");
console.log("=".repeat(80));


