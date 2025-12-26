/**
 * 質問形式をMBTIスタイルに変換するスクリプト
 * 「どうする？」→「あなたは〜しますか？」形式に変更
 * 選択肢を「当てはまる/当てはまらない」形式に変更
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface Option {
  label: string;
  score: number;
}

interface Question {
  id: number;
  text: string;
  axis: string;
  options: Option[];
}

// MBTIスタイルの選択肢（5段階）
const mbtiOptions: Option[] = [
  { label: "強く当てはまる", score: 2 },
  { label: "やや当てはまる", score: 1 },
  { label: "どちらでもない", score: 0 },
  { label: "あまり当てはまらない", score: -1 },
  { label: "全く当てはまらない", score: -2 },
];

// 質問テキストをMBTIスタイルに変換
function convertQuestionText(text: string, options: Option[]): string {
  // 「どうする？」→「あなたは〜しますか？」形式に変換
  // 選択肢の最初の項目（score: 2）を基に質問文を生成
  
  // 既に「〜しますか？」形式の場合はそのまま
  if (text.includes("しますか？") || text.includes("ですか？") || text.includes("感じますか？")) {
    return text;
  }

  // 「どうする？」を「あなたは〜しますか？」に変換
  if (text.includes("どうする？")) {
    const firstOption = options.find(opt => opt.score === 2);
    if (firstOption) {
      // 「自分の意見を強く主張する」→「あなたは強く主張しますか？」
      const action = firstOption.label.replace("自分の", "").replace("積極的に", "").replace("基本的に", "");
      return text.replace("どうする？", `あなたは${action}しますか？`);
    }
  }

  // 「どう感じる？」を「あなたは〜と感じますか？」に変換
  if (text.includes("どう感じる？")) {
    const firstOption = options.find(opt => opt.score === 2);
    if (firstOption) {
      const feeling = firstOption.label.split("、")[0]; // 「とても嬉しい、積極的に話す」→「とても嬉しい」
      return text.replace("どう感じる？", `あなたは${feeling}と感じますか？`);
    }
  }

  // 「どう判断する？」を「あなたは〜で判断しますか？」に変換
  if (text.includes("どう判断する？")) {
    const firstOption = options.find(opt => opt.score === 2);
    if (firstOption) {
      return text.replace("どう判断する？", `あなたは${firstOption.label}で判断しますか？`);
    }
  }

  // その他の場合は「あなたは〜ですか？」形式に
  return text.replace("？", "あなたはそうですか？");
}

// 質問データを読み込んで変換
const questions18Path = join(process.cwd(), "data/diagnoses/compatibility-18/questions.json");
const questions18: Question[] = JSON.parse(readFileSync(questions18Path, "utf-8"));

const convertedQuestions: Question[] = questions18.map((question) => {
  const convertedText = convertQuestionText(question.text, question.options);
  
  return {
    ...question,
    text: convertedText,
    options: mbtiOptions, // 選択肢をMBTIスタイルに統一
  };
});

// 変換後のデータを保存
writeFileSync(questions18Path, JSON.stringify(convertedQuestions, null, 2), "utf-8");
console.log(`✅ 18問の質問データをMBTIスタイルに変換しました`);

// 54問も再生成
const questions54: Question[] = [];
const axes = ["communication", "decision", "relationship"] as const;
let questionId = 1;

for (const axis of axes) {
  const axisQuestions = convertedQuestions.filter((q) => q.axis === axis);
  
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

const questions54Path = join(process.cwd(), "data/diagnoses/compatibility-54/questions.json");
writeFileSync(questions54Path, JSON.stringify(questions54, null, 2), "utf-8");
console.log(`✅ 54問の質問データをMBTIスタイルに変換しました`);








