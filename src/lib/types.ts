// 型定義

// 測定軸
export type Axis = "communication" | "decision" | "relationship";

// 選択肢のスコア
export type Score = -2 | -1 | 0 | 1 | 2;

// 選択肢
export interface Option {
  label: string;
  score: Score;
}

// 質問型
export interface Question {
  id: number;
  axis: Axis;
  text: string;
  options: Option[];
}

// 回答型
export interface Answer {
  questionId: number;
  score: Score;
}

// コミュニケーション特性
export type CommunicationTrait = "積極型" | "受容型" | "バランス型";

// 意思決定特性
export type DecisionTrait = "論理型" | "感情型" | "ハイブリッド型";

// 関係性特性
export type RelationshipTrait = "リード型" | "寄り添い型" | "対等型";

// 特性
export interface Traits {
  communication: CommunicationTrait;
  decision: DecisionTrait;
  relationship: RelationshipTrait;
}

// パーソナリティタイプコード（27タイプ）
// 形式: {communication}_{decision}_{relationship}
// 例: "積極型_論理型_リード型", "受容型_感情型_寄り添い型" など
export type PersonalityTypeCode = string;

// パーソナリティタイプ
export interface PersonalityType {
  type: PersonalityTypeCode; // "積極型_論理型_リード型" など
  name: string; // タイプ名（例: "ブレインマエストロ"）
  icon: string; // 絵文字アイコン
  description: string; // 説明文（oneLiner）
  catch?: string; // キャッチフレーズ（例: "突き進む知性派"）
  personality?: string; // 性格の特徴
  romanceTendency?: string; // 恋愛における性格傾向
  dailyActions?: string; // 日常の恋愛行動パターン
  innerMotivation?: string; // 内面の動機・価値観
  futureVision?: string; // 将来へのビジョン
  traits: Traits; // 3軸の特性
}

// 相性型
export interface Compatibility {
  total: number; // 総合相性スコア
  message: string; // 相性メッセージ
  detail: string; // 詳細説明
  adviceUser: string; // ユーザーへのアドバイス
  advicePartner: string; // 相手へのアドバイス
}

