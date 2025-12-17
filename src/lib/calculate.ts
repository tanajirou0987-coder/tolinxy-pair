import type { Answer, PersonalityType, Compatibility, Traits } from "./types";
import types18QData from "../../data/diagnoses/compatibility-18/types.json";
import compatibility18Data from "../../data/diagnoses/compatibility-18/compatibility.json";
import types54QData from "../../data/diagnoses/compatibility-54/types.json";
import compatibility54Data from "../../data/diagnoses/compatibility-54/compatibility.json";
import { buildTypeDescription } from "./type-descriptions";

const customCompatibilityOverrides: Record<
  string,
  { message?: string; detail?: string }
> = {
  ["バランス型_ハイブリッド型_対等型|バランス型_ハイブリッド型_対等型"]: {
    message: "波長ピッタリのユニゾンカップル",
    detail:
      "お互いが“ちょうどいい”温度感で生きているから、予定を決めてもどちらかが我慢している空気になりにくい組み合わせ。同じ場面でギアチェンジできるので、週末の予定も「せーの」で決まる安定感が魅力です。ただし平和すぎて新鮮味が薄れがちなので、毎週交代で“今週の決め役”を宣言し、気になるスポットやマイブームを必ず1つ持ち寄ると、ふたりの世界に新しい刺激を足し続けられます。",
  },
};

// スコア計算結果の型
export interface Scores {
  axis1: number; // communication (Q1-Q6)
  axis2: number; // decision (Q7-Q12)
  axis3: number; // relationship (Q13-Q18)
}

// types_18q.jsonの構造型
interface Types18QData {
  [key: string]: PersonalityType;
}

// compatibility.jsonの構造型
interface CompatibilityData {
  [key: string]: Compatibility;
}

/**
 * 回答の配列から3軸のスコアを計算
 * @param answers 回答の配列
 * @param totalQuestions 総質問数（18または54）
 * @returns 3軸のスコア
 */
export function calculateScores(answers: Answer[], totalQuestions: number = 18): Scores {
  if (totalQuestions === 18) {
    // 18問の場合: 各軸6問ずつ
    // Q1-Q6の合計（communication軸）
    const axis1 = answers
      .filter((answer) => answer.questionId >= 1 && answer.questionId <= 6)
      .reduce((sum, answer) => sum + answer.score, 0);

    // Q7-Q12の合計（decision軸）
    const axis2 = answers
      .filter((answer) => answer.questionId >= 7 && answer.questionId <= 12)
      .reduce((sum, answer) => sum + answer.score, 0);

    // Q13-Q18の合計（relationship軸）
    const axis3 = answers
      .filter((answer) => answer.questionId >= 13 && answer.questionId <= 18)
      .reduce((sum, answer) => sum + answer.score, 0);

    return {
      axis1,
      axis2,
      axis3,
    };
  } else if (totalQuestions === 54) {
    // 54問の場合: 各軸18問ずつ
    // Q1-Q18の合計（communication軸）
    const axis1 = answers
      .filter((answer) => answer.questionId >= 1 && answer.questionId <= 18)
      .reduce((sum, answer) => sum + answer.score, 0);

    // Q19-Q36の合計（decision軸）
    const axis2 = answers
      .filter((answer) => answer.questionId >= 19 && answer.questionId <= 36)
      .reduce((sum, answer) => sum + answer.score, 0);

    // Q37-Q54の合計（relationship軸）
    const axis3 = answers
      .filter((answer) => answer.questionId >= 37 && answer.questionId <= 54)
      .reduce((sum, answer) => sum + answer.score, 0);

    return {
      axis1,
      axis2,
      axis3,
    };
  }

  throw new Error(`Unsupported totalQuestions: ${totalQuestions}`);
}

/**
 * スコアから特性を判定（27タイプ用）
 * @param axis1 communication軸のスコア
 * @param axis2 decision軸のスコア
 * @param axis3 relationship軸のスコア
 * @param totalQuestions 総質問数（18または54）
 * @returns 特性の組み合わせ
 */
function determineTraitsFromScores(
  axis1: number,
  axis2: number,
  axis3: number,
  totalQuestions: number = 18
): { communication: string; decision: string; relationship: string } {
  // 閾値を質問数に応じて調整
  // 18問: スコア範囲 -12～+12、閾値 ±3
  // 54問: スコア範囲 -36～+36、閾値 ±9（3倍）
  const threshold = totalQuestions === 54 ? 9 : 3;

  // コミュニケーション軸
  // 18問: > 3: 積極型, < -3: 受容型, それ以外: バランス型
  // 54問: > 9: 積極型, < -9: 受容型, それ以外: バランス型
  const communication =
    axis1 > threshold ? "積極型" : axis1 < -threshold ? "受容型" : "バランス型";

  // 意思決定軸
  // 18問: > 3: 論理型, < -3: 感情型, それ以外: ハイブリッド型
  // 54問: > 9: 論理型, < -9: 感情型, それ以外: ハイブリッド型
  const decision =
    axis2 > threshold ? "論理型" : axis2 < -threshold ? "感情型" : "ハイブリッド型";

  // 関係性軸
  // 18問: > 3: リード型, < -3: 寄り添い型, それ以外: 対等型
  // 54問: > 9: リード型, < -9: 寄り添い型, それ以外: 対等型
  const relationship =
    axis3 > threshold ? "リード型" : axis3 < -threshold ? "寄り添い型" : "対等型";

  return { communication, decision, relationship };
}

/**
 * 特性からタイプコードを生成（27タイプ用）
 * @param traits 特性の組み合わせ
 * @returns タイプコード（例: "積極型_論理型_リード型"）
 */
function generateTypeCodeFromTraits(traits: {
  communication: string;
  decision: string;
  relationship: string;
}): string {
  return `${traits.communication}_${traits.decision}_${traits.relationship}`;
}

/**
 * タイプコードからタイプ名と説明を生成
 */
function generateTypeNameAndDescription(
  typeCode: string
): { name: string; icon: string; description: string } {
  const [communication, decision, relationship] = typeCode.split("_") as [
    Traits["communication"],
    Traits["decision"],
    Traits["relationship"]
  ];

  const name = `${communication}×${decision}×${relationship}`;
  const icon = "";
  const description = buildTypeDescription({
    communication,
    decision,
    relationship,
  });

  return { name, icon, description };
}


/**
 * スコアからパーソナリティタイプを取得（27タイプ対応）
 * @param axis1 communication軸のスコア
 * @param axis2 decision軸のスコア
 * @param axis3 relationship軸のスコア
 * @returns パーソナリティタイプ
 */
export function getPersonalityType(
  axis1: number,
  axis2: number,
  axis3: number,
  diagnosisType: "18" | "54" = "18"
): PersonalityType {
  // スコアから特性を判定（質問数に応じて閾値を調整）
  const totalQuestions = diagnosisType === "54" ? 54 : 18;
  const traits = determineTraitsFromScores(axis1, axis2, axis3, totalQuestions);
  
  // タイプコードを生成（27タイプ形式: "積極型_論理型_リード型"）
  const typeCode = generateTypeCodeFromTraits(traits);

  // 27タイプのデータから検索
  const typesData = (diagnosisType === "54" ? types54QData : types18QData) as Types18QData;
  const existingType = typesData[typeCode];

  // データがあれば使用
  if (existingType) {
    return existingType;
  }

  // フォールバック: タイプ名と説明を生成
  const typeInfo = generateTypeNameAndDescription(typeCode);

  return {
    type: typeCode,
    name: typeInfo.name,
    icon: typeInfo.icon,
    description: typeInfo.description,
    traits: {
      communication: traits.communication as "積極型" | "受容型" | "バランス型",
      decision: traits.decision as "論理型" | "感情型" | "ハイブリッド型",
      relationship: traits.relationship as "リード型" | "寄り添い型" | "対等型",
    },
  };
}

/**
 * コミュニケーション軸の相性スコアを計算（補完性重視）
 */
function calculateCommunicationCompatibility(
  trait1: Traits["communication"],
  trait2: Traits["communication"]
): number {
  // 補完性重視：逆の極が良い
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

/**
 * 意思決定軸の相性スコアを計算（類似性重視）
 */
function calculateDecisionCompatibility(
  trait1: Traits["decision"],
  trait2: Traits["decision"]
): number {
  // 類似性重視：同じタイプ同士が良い
  if (trait1 === trait2) {
    return 100;
  }

  // ハイブリッド型は両方と相性が良い
  if (trait1 === "ハイブリッド型" || trait2 === "ハイブリッド型") {
    return 80;
  }

  // 論理型と感情型は相性が悪い
  if (
    (trait1 === "論理型" && trait2 === "感情型") ||
    (trait1 === "感情型" && trait2 === "論理型")
  ) {
    return 40;
  }

  return 60;
}

/**
 * 関係性軸の相性スコアを計算（補完性重視）
 */
function calculateRelationshipCompatibility(
  trait1: Traits["relationship"],
  trait2: Traits["relationship"]
): number {
  // 補完性重視：逆の極が良い
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

/**
 * 総合相性スコアを計算（27タイプ対応）
 * 要件: 総合スコア = 0.3 × 軸1 + 0.4 × 軸2 + 0.3 × 軸3
 * 軸1・3: 補完性重視、軸2: 類似性重視
 */
export function calculateCompatibilityScore(
  type1: PersonalityType,
  type2: PersonalityType
): number {
  const axis1Score = calculateCommunicationCompatibility(
    type1.traits.communication,
    type2.traits.communication
  );

  const axis2Score = calculateDecisionCompatibility(
    type1.traits.decision,
    type2.traits.decision
  );

  const axis3Score = calculateRelationshipCompatibility(
    type1.traits.relationship,
    type2.traits.relationship
  );

  // 総合スコア = 0.3 × 軸1 + 0.4 × 軸2 + 0.3 × 軸3
  const rawScore = axis1Score * 0.3 + axis2Score * 0.4 + axis3Score * 0.3;
  
  // 1%〜100%に正規化（元の範囲: 46〜100）
  const minRawScore = 46; // 最低スコア
  const maxRawScore = 100; // 最高スコア
  const rawRange = maxRawScore - minRawScore; // 54
  
  // 正規化: ((score - min) / range) × 99 + 1
  const normalizedScore = Math.round(((rawScore - minRawScore) / rawRange) * 99 + 1);
  
  // 1〜100の範囲に制限
  return Math.max(1, Math.min(100, normalizedScore));
}

/**
 * スコアから上位何%かを計算（729通りの組み合わせから）
 * 分布データに基づいて計算
 */
export function calculatePercentileRank(score: number): number {
  // 各スコア範囲の分布（729通り中）
  // より正確な計算のため、スコア範囲ごとの累積分布を使用
  const distribution: Record<string, number> = {
    "91-100": 12,  // 1.65%
    "81-90": 76,   // 10.43%
    "71-80": 67,   // 9.19%
    "61-70": 128,  // 17.56%
    "51-60": 184,  // 25.24%
    "41-50": 100,  // 13.72%
    "31-40": 34,   // 4.66%
    "21-30": 80,   // 10.97%
    "11-20": 40,   // 5.49%
    "1-10": 8,     // 1.10%
  };
  
  const total = 729;
  
  // そのスコアより高いスコアの組み合わせ数を計算
  let countAbove = 0;
  
  if (score >= 91) {
    // 91点以上は最高なので、自分自身を含めない
    countAbove = 0;
  } else if (score >= 81) {
    countAbove = distribution["91-100"];
  } else if (score >= 71) {
    countAbove = distribution["91-100"] + distribution["81-90"];
  } else if (score >= 61) {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"];
  } else if (score >= 51) {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"] + distribution["61-70"];
  } else if (score >= 41) {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"] + distribution["61-70"] + distribution["51-60"];
  } else if (score >= 31) {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"] + distribution["61-70"] + distribution["51-60"] + distribution["41-50"];
  } else if (score >= 21) {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"] + distribution["61-70"] + distribution["51-60"] + distribution["41-50"] + distribution["31-40"];
  } else if (score >= 11) {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"] + distribution["61-70"] + distribution["51-60"] + distribution["41-50"] + distribution["31-40"] + distribution["21-30"];
  } else {
    countAbove = distribution["91-100"] + distribution["81-90"] + distribution["71-80"] + distribution["61-70"] + distribution["51-60"] + distribution["41-50"] + distribution["31-40"] + distribution["21-30"] + distribution["11-20"];
  }
  
  // 上位%を計算（より正確にするため、そのスコア範囲内での位置も考慮）
  const percentile = (countAbove / total) * 100;
  
  // 小数点以下を四捨五入して整数で返す
  return Math.round(percentile);
}

/**
 * パーセンタイルからランクを決定
 */
export interface CompatibilityRank {
  rank: string; // SS, S, A, B, C, D, E, F, G
  tier: string; // ランク帯名（運命の相手、恋人同然、など）
}

export function getCompatibilityRank(percentile: number): CompatibilityRank {
  if (percentile <= 1) {
    return { rank: "SS", tier: "運命の相手" };
  }
  if (percentile <= 10) {
    return { rank: "S", tier: "恋人同然" };
  }
  if (percentile <= 20) {
    return { rank: "A", tier: "友達以上恋人未満" };
  }
  if (percentile <= 30) {
    return { rank: "B", tier: "気の合う友達" };
  }
  if (percentile <= 40) {
    return { rank: "C", tier: "良い知り合い" };
  }
  if (percentile <= 50) {
    return { rank: "D", tier: "ふつうの関係" };
  }
  if (percentile <= 60) {
    return { rank: "E", tier: "ちょいズレ" };
  }
  if (percentile <= 70) {
    return { rank: "E", tier: "合わないかも" };
  }
  if (percentile <= 80) {
    return { rank: "F", tier: "ちょい無理" };
  }
  return { rank: "G", tier: "赤の他人" };
}

/**
 * ランク帯に対応する画像パスを取得（降順: SS=10, G=1）
 */
export function getRankImagePath(percentile: number): string {
  if (percentile <= 1) {
    return "/rank-images/10.png"; // SS - 運命の相手
  }
  if (percentile <= 10) {
    return "/rank-images/9.png"; // S - 恋人同然
  }
  if (percentile <= 20) {
    return "/rank-images/8.png"; // A - 友達以上恋人未満
  }
  if (percentile <= 30) {
    return "/rank-images/7.png"; // B - 気の合う友達
  }
  if (percentile <= 40) {
    return "/rank-images/6.png"; // C - 良い知り合い
  }
  if (percentile <= 50) {
    return "/rank-images/5.png"; // D - ふつうの関係
  }
  if (percentile <= 60) {
    return "/rank-images/4.png"; // E - ちょいズレ
  }
  if (percentile <= 70) {
    return "/rank-images/3.png"; // E - 合わないかも
  }
  if (percentile <= 80) {
    return "/rank-images/2.png"; // F - ちょい無理
  }
  return "/rank-images/1.png"; // G - 赤の他人
}

/**
 * 上位%からメッセージを生成
 * percentileは「上位何%か」を表す（例：70は「上位70%」=「下位30%」を意味する）
 */
function generatePercentileMessage(percentile: number): string {
  if (percentile <= 1) return "上位1%に入るほどの";
  if (percentile <= 3) return "上位3%に入るほどの";
  if (percentile <= 5) return "上位5%に入るほどの";
  if (percentile <= 10) return "上位10%に入るほどの";
  if (percentile <= 20) return "上位20%に入るほどの";
  if (percentile <= 30) return "上位30%に入るほどの";
  if (percentile <= 50) return "上位50%に入るほどの";
  // percentileが50より大きい場合も、そのまま「上位X%」として表示
  if (percentile <= 70) return `上位${percentile}%の`;
  if (percentile <= 80) return `上位${percentile}%の`;
  if (percentile <= 90) return `上位${percentile}%の`;
  return `上位${percentile}%の`;
}

/**
 * シェア用のメッセージを生成（下位の場合はユーモアを込める）
 */
export function generateShareMessage(score: number, userNickname: string, partnerNickname: string): string {
  const percentileInfo = generateCompatibilityMessageWithPercentile(score);
  const percentileDisplay = percentileInfo.percentileText;
  
  // パーセンテージが50%以下（良い相性）かどうかでメッセージを変える
  const isGoodCompatibility = percentileInfo.percentile <= 50;
  
  if (isGoodCompatibility) {
    // 上位の場合は自慢できる感じで
    return `【Pairly Lab診断】${userNickname} × ${partnerNickname} の相性：${score}点（${percentileDisplay}） バランス良好な結果でした。`;
  } else {
    // 下位の場合は「危険かも」みたいな感じで
    return `【Pairly Lab診断】${userNickname} × ${partnerNickname} の相性：${score}点（${percentileDisplay}） 課題を話し合ってアップデートしていこう。`;
  }
}

/**
 * 相性メッセージを生成
 */
function generateCompatibilityMessage(score: number): string {
  if (score >= 90) return "最高の相性！完璧な組み合わせ";
  if (score >= 80) return "とても良い相性！理想的な関係";
  if (score >= 70) return "良い相性！互いを理解し合える";
  if (score >= 60) return "普通の相性。お互いを尊重し合えば良い関係に";
  if (score >= 50) return "やや相性に課題あり。コミュニケーションが大切";
  return "相性に課題あり。お互いの違いを理解することが重要";
}

/**
 * 相性メッセージと上位%を含めたメッセージを生成
 */
export function generateCompatibilityMessageWithPercentile(score: number): { message: string; percentile: number; percentileText: string } {
  const percentile = calculatePercentileRank(score);
  const roundedPercentile = Math.round(percentile);
  // percentileは「上位何%か」を表す（例：70は「上位70%」=「下位30%」を意味する）
  // 表示では常に「上位X%」として表示するので、percentileの値そのままを使用
  const displayPercentile = roundedPercentile;
  const percentileText = generatePercentileMessage(displayPercentile);
  const baseMessage = generateCompatibilityMessage(score);
  
  return {
    message: `${percentileText}相性の良さ。${baseMessage}`,
    percentile: displayPercentile, // 表示用のパーセンテージを返す
    percentileText: `上位${displayPercentile}%`,
  };
}

/**
 * 相性の詳細説明を生成
 */
function describeCommunicationPair(type1: PersonalityType, type2: PersonalityType): string {
  const trait1 = type1.traits.communication;
  const trait2 = type2.traits.communication;
  const pairKey = [trait1, trait2].sort().join("|");

  const active = trait1 === "積極型" ? type1 : trait2 === "積極型" ? type2 : null;
  const calm = trait1 === "受容型" ? type1 : trait2 === "受容型" ? type2 : null;

  switch (pairKey) {
    case "積極型|積極型":
      return "どちらもテンション高めに会話を仕掛けるタイプなので、話題が途切れずイベントもスピーディーに決まります。";
    case "受容型|受容型":
      return "2人とも聞き上手なので、穏やかなムードで本音を引き出し合えるペース。静かな場所ほど信頼が深まります。";
    case "バランス型|バランス型":
      return "お互いが空気を読んで盛り上げ役と聞き役を自然に切り替えられるため、会話リズムが心地よく噛み合います。";
    case "積極型|受容型": {
      const leader = active!;
      const listener = calm!;
      return `${leader.name}がテンポよく話題を投げ、${listener.name}が柔らかく受け止める相互補完ペア。盛り上げと安心感のバランスが優秀です。`;
    }
    case "積極型|バランス型": {
      const leader = trait1 === "積極型" ? type1 : type2;
      const moderator = leader === type1 ? type2 : type1;
      return `${leader.name}の勢いに対して${moderator.name}が空気を整えるので、グループでもサシでもテンション調節がしやすい組み合わせです。`;
    }
    case "受容型|バランス型": {
      const steady = trait1 === "バランス型" ? type1 : type2;
      const gentle = steady === type1 ? type2 : type1;
      return `${steady.name}が会話を拾い、${gentle.name}が丁寧に相槌を返すため、ゆっくり深掘りする対話が得意です。`;
    }
    default:
      return "それぞれのテンポを尊重し合えば、心地いい会話ペースを作れます。";
  }
}

function describeDecisionPair(type1: PersonalityType, type2: PersonalityType): string {
  const trait1 = type1.traits.decision;
  const trait2 = type2.traits.decision;
  const pairKey = [trait1, trait2].sort().join("|");
  const logic = trait1 === "論理型" ? type1 : trait2 === "論理型" ? type2 : null;
  const emotion = trait1 === "感情型" ? type1 : trait2 === "感情型" ? type2 : null;
  const hybrid = trait1 === "ハイブリッド型" ? type1 : trait2 === "ハイブリッド型" ? type2 : null;

  switch (pairKey) {
    case "ハイブリッド型|ハイブリッド型":
      return "どちらも頭と心のスイッチを素早く切り替えられるので、議題が変わってもすぐに最適解へ辿り着けます。";
    case "感情型|感情型":
      return "感じたことを素直に言葉にできる2人なので、デートや予定決めもフィーリング優先で楽しく組み立てられます。";
    case "論理型|論理型":
      return "どちらもデータや根拠を大事にするため、ToDo管理や将来設計を一緒に進めやすい安定感があります。";
    case "ハイブリッド型|論理型": {
      const planner = logic!;
      const bridge = hybrid!;
      return `${planner.name}の合理性に対し、${bridge.name}が気持ちの温度を翻訳してくれるので、冷静さと柔らかさの両立が叶います。`;
    }
    case "ハイブリッド型|感情型": {
      const feeler = emotion!;
      const bridge = hybrid!;
      return `${feeler.name}の直感を${bridge.name}が言語化して整理してくれるため、勢いあるアイデアも現実的なプランに落とし込めます。`;
    }
    case "感情型|論理型": {
      const planner = logic!;
      const feeler = emotion!;
      return `${planner.name}が筋道を示し、${feeler.name}が温度感を共有する組み合わせ。最初は視点がズレても、お互いの強みを持ち寄れば意思決定が厚みを増します。`;
    }
    default:
      return "物事の決め方は異なりますが、順番や役割を決めて話すと、それぞれの良さを活かせます。";
  }
}

function describeRelationshipPair(type1: PersonalityType, type2: PersonalityType): string {
  const trait1 = type1.traits.relationship;
  const trait2 = type2.traits.relationship;
  const pairKey = [trait1, trait2].sort().join("|");
  const lead = trait1 === "リード型" ? type1 : trait2 === "リード型" ? type2 : null;
  const care = trait1 === "寄り添い型" ? type1 : trait2 === "寄り添い型" ? type2 : null;

  switch (pairKey) {
    case "対等型|対等型":
      return "何でも一緒に決めたい同士なので、家事も遊びも半分ずつ担当しながらフェアに楽しめます。";
    case "リード型|リード型":
      return "どちらも舵を取りたくなるため、週替わりで“指揮者”を決めると程よい主導権バランスが保てます。";
    case "寄り添い型|寄り添い型":
      return "相手の心地よさを最優先にする同士なので、優しい空気が漂いますが、遠慮しすぎず希望も言葉にすると◎";
    case "リード型|寄り添い型": {
      const captain = lead!;
      const supporter = care!;
      return `${captain.name}が方向性を決め、${supporter.name}がフォローする黄金リズム。役割が自然に分かれるので、日常もイベントも準備がスムーズです。`;
    }
    case "リード型|対等型": {
      const captain = lead!;
      const teammate = captain === type1 ? type2 : type1;
      return `${captain.name}が全体を引っ張り、${teammate.name}が具体策や代替案を一緒に考えるスタイル。話し合いで役割を調整すると強いチームになります。`;
    }
    case "対等型|寄り添い型": {
      const teammate = trait1 === "対等型" ? type1 : type2;
      const supporter = teammate === type1 ? type2 : type1;
      return `${teammate.name}が「一緒にやろう」を提案し、${supporter.name}が細やかにケアするので、安心しながら新しいチャレンジに踏み出せます。`;
    }
    default:
      return "状況ごとにリード役とサポート役を言葉で決めると、役割分担がなめらかになります。";
  }
}

function generateCompatibilityDetail(type1: PersonalityType, type2: PersonalityType): string {
  const detailParts = [
    `${type1.name}と${type2.name}の組み合わせ。`,
    describeCommunicationPair(type1, type2),
    describeDecisionPair(type1, type2),
    describeRelationshipPair(type1, type2),
  ];

  return detailParts.join("");
}

/**
 * アドバイスを生成
 */
function generateAdvice(
  userType: PersonalityType,
  partnerType: PersonalityType
): { user: string; partner: string } {
  return {
    user: `${partnerType.name}の相手は${partnerType.description}。相手のペースを尊重し、コミュニケーションを大切にすると良いでしょう。`,
    partner: `${userType.name}の相手は${userType.description}。相手の積極性を理解し、時にはリードしてもらうことも大切です。`,
  };
}

/**
 * 2つのタイプから相性情報を計算（常に計算ロジックを使用）
 * @param type1 1人目のパーソナリティタイプ
 * @param type2 2人目のパーソナリティタイプ
 * @returns 相性情報
 */
export function getCompatibilityFromTypes(
  type1: PersonalityType,
  type2: PersonalityType,
  diagnosisType: "18" | "54" = "18"
): Compatibility {
  // 常に計算ロジックを使用（要件に基づいた正確な計算）
  const totalScore = calculateCompatibilityScore(type1, type2);

  // 相性データがあればメッセージなどに使用（オプション）
  const compatData = (diagnosisType === "54" ? compatibility54Data : compatibility18Data) as CompatibilityData;
  const key1 = `${type1.type}_${type2.type}`;
  const key2 = `${type2.type}_${type1.type}`;
  const existingData = compatData[key1] || compatData[key2];
  const customKey = [type1.type, type2.type].sort().join("|");
  const customOverride = customCompatibilityOverrides[customKey];

  // 既存のメッセージがあれば使用、なければ生成
  const message = customOverride?.message || existingData?.message || generateCompatibilityMessage(totalScore);
  const detail = customOverride?.detail || existingData?.detail || generateCompatibilityDetail(type1, type2);
  const advice = existingData
    ? { user: existingData.adviceUser, partner: existingData.advicePartner }
    : generateAdvice(type1, type2);

  return {
    total: totalScore, // 常に計算ロジックの結果を使用
    message,
    detail,
    adviceUser: advice.user,
    advicePartner: advice.partner,
  };
}

/**
 * 2つのタイプコードから相性情報を取得（後方互換性のため残す）
 * @param type1 1つ目のタイプコード
 * @param type2 2つ目のタイプコード
 * @returns 相性情報
 * @deprecated getCompatibilityFromTypes を使用してください
 */
export function getCompatibility(
  type1: string,
  type2: string
): Compatibility {
  const compatData = compatibility18Data as CompatibilityData;

  // タイプの組み合わせキーを生成（順序を考慮）
  const key1 = `${type1}_${type2}`;
  const key2 = `${type2}_${type1}`;

  const compatibility = compatData[key1] || compatData[key2];

  if (!compatibility) {
    throw new Error(
      `Compatibility not found for types: ${type1} and ${type2}. Use getCompatibilityFromTypes instead.`
    );
  }

  return compatibility;
}
