/**
 * 54問の質問データを生成するスクリプト
 * 各軸18問ずつ（18問 × 3軸 = 54問）
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// 18問の質問データを読み込む
const questions18 = JSON.parse(
  readFileSync(
    join(process.cwd(), "data/diagnoses/compatibility-18/questions.json"),
    "utf-8"
  )
);

// 54問の質問データを生成
interface Question {
  id: number;
  text: string;
  axis: string;
}

const questions54: Question[] = [];

// 各軸ごとに18問ずつ生成
const axes = ["communication", "decision", "relationship"] as const;
let questionId = 1;

for (const axis of axes) {
  // 各軸の6問を3回繰り返して18問にする
  const axisQuestions = questions18.filter((q: Question) => q.axis === axis);
  
  for (let i = 0; i < 3; i++) {
    for (const question of axisQuestions) {
      questions54.push({
        id: questionId++,
        axis: axis,
        text: question.text,
        options: question.options,
      });
    }
  }
}

// ファイルに保存
const outputPath = join(
  process.cwd(),
  "data/diagnoses/compatibility-54/questions.json"
);
writeFileSync(outputPath, JSON.stringify(questions54, null, 2), "utf-8");

console.log(`✅ 54問の質問データを生成しました: ${outputPath}`);
console.log(`   総質問数: ${questions54.length}`);
console.log(`   各軸の質問数: ${questions54.filter((q) => q.axis === "communication").length}問`);



