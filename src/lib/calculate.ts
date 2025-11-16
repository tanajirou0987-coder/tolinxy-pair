import type { Answer, PersonalityType, Compatibility, PersonalityTypeCode, Traits } from "./types";
import types18QData from "../../data/diagnoses/compatibility-18/types.json";
import compatibility18Data from "../../data/diagnoses/compatibility-18/compatibility.json";
import types54QData from "../../data/diagnoses/compatibility-54/types.json";
import compatibility54Data from "../../data/diagnoses/compatibility-54/compatibility.json";

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
  // タイプコードから特性を抽出
  const [communication, decision, relationship] = typeCode.split("_");

  // タイプ名を生成
  const name = `${communication}×${decision}×${relationship}`;

  // 説明文を生成
  let description = "";
  if (communication === "積極型") {
    description += "明るく積極的で、";
  } else if (communication === "受容型") {
    description += "穏やかで控えめ、";
  } else {
    description += "バランス感覚に優れ、";
  }

  if (decision === "論理型") {
    description += "論理的に判断し、";
  } else if (decision === "感情型") {
    description += "感情を大切にし、";
  } else {
    description += "柔軟に判断し、";
  }

  if (relationship === "リード型") {
    description += "リーダーシップを発揮する";
  } else if (relationship === "寄り添い型") {
    description += "相手に寄り添う";
  } else {
    description += "対等な関係を築く";
  }

  // アイコンは特性の組み合わせから決定（簡易版）
  const icon = "🎵"; // デフォルトアイコン

  return { name, icon, description };
}

/**
 * スコアからタイプコードを生成（後方互換性のため残す）
 * @param axis1 communication軸のスコア
 * @param axis2 decision軸のスコア
 * @param axis3 relationship軸のスコア
 * @returns タイプコード（例: "score1_3_score2_2_score3_1"）
 */
function generateTypeKey(axis1: number, axis2: number, axis3: number): string {
  return `score1_${axis1}_score2_${axis2}_score3_${axis3}`;
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
  const totalScore = Math.round(
    axis1Score * 0.3 + axis2Score * 0.4 + axis3Score * 0.3
  );

  return totalScore;
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
 * 相性の詳細説明を生成
 */
function generateCompatibilityDetail(
  type1: PersonalityType,
  type2: PersonalityType,
  score: number
): string {
  const traits1 = type1.traits;
  const traits2 = type2.traits;

  let detail = `${type1.name}と${type2.name}の組み合わせ。`;

  // コミュニケーション軸
  if (traits1.communication !== traits2.communication) {
    detail += `コミュニケーションスタイルは異なりますが、お互いを補完し合える関係です。`;
  } else {
    detail += `コミュニケーションスタイルが似ているため、理解しやすい関係です。`;
  }

  // 意思決定軸
  if (traits1.decision === traits2.decision) {
    detail += `意思決定の方法も似ているため、スムーズに物事を進められます。`;
  } else {
    detail += `意思決定の方法が異なるため、時には意見が分かれることもありますが、多様な視点を得られます。`;
  }

  return detail;
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

  // 既存のメッセージがあれば使用、なければ生成
  const message = existingData?.message || generateCompatibilityMessage(totalScore);
  const detail = existingData?.detail || generateCompatibilityDetail(type1, type2, totalScore);
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
