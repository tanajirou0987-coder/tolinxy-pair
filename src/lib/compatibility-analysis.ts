import type { PersonalityType } from "./types";

// 多角的な相性分析の結果型
export interface DetailedCompatibilityAnalysis {
  // 各項目のスコア（0-100）
  valuesAlignment: number; // 価値観一致度
  emotionalExpression: number; // 感情表現の相性
  communicationStyle: number; // コミュニケーションスタイル
  stressResponse: number; // ストレス対応
  lifestyleRhythm: number; // 生活リズム
  loveExpression: number; // 愛情表現
  
  // 各項目の詳細
  valuesAlignmentDetail: {
    score: number;
    description: string;
    example: string;
  };
  emotionalExpressionDetail: {
    score: number;
    description: string;
    example: string;
  };
  communicationStyleDetail: {
    score: number;
    description: string;
    example: string;
  };
  stressResponseDetail: {
    score: number;
    description: string;
    example: string;
  };
  lifestyleRhythmDetail: {
    score: number;
    description: string;
    example: string;
  };
  loveExpressionDetail: {
    score: number;
    description: string;
    example: string;
  };
  
  // 強みとチャレンジ
  strengths: string[];
  challenges: string[];
  improvementTips: {
    title: string;
    description: string;
  }[];
  communicationHints: string[];
  
  // 会話のきっかけ
  conversationStarters: string[];
  
  // 未来へのメッセージ
  futureMessage: string;
}

/**
 * 価値観一致度を計算
 */
function calculateValuesAlignment(
  type1: PersonalityType,
  type2: PersonalityType
): { score: number; description: string; example: string } {
  // 意思決定軸が同じなら価値観が近い
  const decisionMatch = type1.traits.decision === type2.traits.decision;
  const relationshipMatch = type1.traits.relationship === type2.traits.relationship;
  
  let score = 60; // ベーススコア
  
  if (decisionMatch) score += 25;
  if (relationshipMatch) score += 15;
  
  // ハイブリッド型を含む場合は柔軟性がある
  if (type1.traits.decision === "ハイブリッド型" || type2.traits.decision === "ハイブリッド型") {
    score += 10;
  }
  
  score = Math.min(100, Math.max(0, score));
  
  let description = "";
  let example = "";
  
  // タイプの詳細情報を活用
  const innerMotivation1 = type1.innerMotivation || "";
  const innerMotivation2 = type2.innerMotivation || "";
  
  if (score >= 85) {
    description = "2人の価値観は非常に近く、物事の判断基準が似ています。";
    if (innerMotivation1 && innerMotivation2) {
      example = `${type1.name}は「${innerMotivation1}」、${type2.name}は「${innerMotivation2}」という価値観を持っています。この2つの価値観は自然と調和し、将来の計画や時間の使い方についても意見が一致することが多いでしょう。`;
    } else {
      example = "例えば、お互いが同じように時間の使い方を大切にしたり、将来の計画について自然と意見が一致することが多いでしょう。";
    }
  } else if (score >= 70) {
    description = "基本的な価値観は共有できており、柔軟に調整し合えます。";
    if (innerMotivation1 && innerMotivation2) {
      example = `${type1.name}は「${innerMotivation1}」、${type2.name}は「${innerMotivation2}」という価値観を持っています。異なる部分もありますが、お互いの判断を尊重し合える関係です。`;
    } else {
      example = "例えば、一方が論理的に考え、もう一方が感情を大切にする場合でも、お互いの判断を尊重し合える関係です。";
    }
  } else {
    description = "価値観に違いはありますが、お互いを理解しようとする姿勢が大切です。";
    if (innerMotivation1 && innerMotivation2) {
      example = `${type1.name}は「${innerMotivation1}」、${type2.name}は「${innerMotivation2}」という価値観を持っています。違いを理解し、お互いのスタイルを認め合うことが重要です。`;
    } else {
      example = "例えば、一方が計画を立てることを好み、もう一方が臨機応変を好む場合、お互いのスタイルを認め合うことが重要です。";
    }
  }
  
  return { score, description, example };
}

/**
 * 感情表現の相性を計算
 */
function calculateEmotionalExpression(
  type1: PersonalityType,
  type2: PersonalityType
): { score: number; description: string; example: string } {
  const decision1 = type1.traits.decision;
  const decision2 = type2.traits.decision;
  
  let score = 50;
  
  // 感情型同士は感情表現が豊か
  if (decision1 === "感情型" && decision2 === "感情型") {
    score = 90;
  } else if (decision1 === "感情型" || decision2 === "感情型") {
    // 一方が感情型、もう一方がハイブリッド型
    if (decision1 === "ハイブリッド型" || decision2 === "ハイブリッド型") {
      score = 75;
    } else {
      // 感情型と論理型
      score = 45;
    }
  } else if (decision1 === "ハイブリッド型" && decision2 === "ハイブリッド型") {
    score = 80;
  } else if (decision1 === "論理型" && decision2 === "論理型") {
    score = 70; // 論理型同士は感情表現は控えめだが理解し合える
  }
  
  let description = "";
  let example = "";
  
  // タイプの詳細情報を活用
  const romanceTendency1 = type1.romanceTendency || "";
  const romanceTendency2 = type2.romanceTendency || "";
  
  if (score >= 80) {
    description = "2人とも感情を素直に表現でき、お互いの気持ちを理解し合えます。";
    if (romanceTendency1 && romanceTendency2) {
      example = `${type1.name}は「${romanceTendency1}」、${type2.name}は「${romanceTendency2}」という恋愛傾向があります。2人とも感情を素直に表現できるため、嬉しい時は一緒に喜び、悲しい時は寄り添い合える関係です。`;
    } else {
      example = "例えば、嬉しい時は一緒に喜び、悲しい時は寄り添い合える関係です。感情の波を共有できるでしょう。";
    }
  } else if (score >= 60) {
    description = "感情表現のスタイルに違いはありますが、お互いを理解しようと努められます。";
    if (romanceTendency1 && romanceTendency2) {
      example = `${type1.name}は「${romanceTendency1}」、${type2.name}は「${romanceTendency2}」という恋愛傾向があります。表現方法は異なりますが、お互いの愛情は確実に伝わります。`;
    } else {
      example = "例えば、一方が感情を言葉で表現し、もう一方が行動で示す場合でも、愛情は伝わります。";
    }
  } else {
    description = "感情表現の方法が異なりますが、お互いのスタイルを尊重することが大切です。";
    if (romanceTendency1 && romanceTendency2) {
      example = `${type1.name}は「${romanceTendency1}」、${type2.name}は「${romanceTendency2}」という恋愛傾向があります。表現方法の違いを理解し、お互いのスタイルを尊重し合いましょう。`;
    } else {
      example = "例えば、一方が感情を素直に表現する一方で、もう一方が控えめな場合、表現方法の違いを理解し合いましょう。";
    }
  }
  
  return { score, description, example };
}

/**
 * コミュニケーションスタイルを計算
 */
function calculateCommunicationStyle(
  type1: PersonalityType,
  type2: PersonalityType
): { score: number; description: string; example: string } {
  const comm1 = type1.traits.communication;
  const comm2 = type2.traits.communication;
  
  let score = 60;
  
  // 補完性重視：積極型と受容型が良い
  if (
    (comm1 === "積極型" && comm2 === "受容型") ||
    (comm1 === "受容型" && comm2 === "積極型")
  ) {
    score = 95;
  } else if (comm1 === "バランス型" && comm2 === "バランス型") {
    score = 85;
  } else if (comm1 === comm2) {
    score = comm1 === "バランス型" ? 80 : 55;
  } else {
    // バランス型と他
    score = 70;
  }
  
  let description = "";
  let example = "";
  
  // タイプの詳細情報を活用
  const dailyActions1 = type1.dailyActions || "";
  const dailyActions2 = type2.dailyActions || "";
  
  if (score >= 85) {
    description = "コミュニケーションのスタイルが絶妙に補い合い、会話が自然に流れます。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。一方が話題を提供し、もう一方が深く聞いてくれる関係で、会話が途切れることなく、お互いが心地よく話せます。`;
    } else {
      example = "例えば、一方が話題を提供し、もう一方が深く聞いてくれる関係。会話が途切れることなく、お互いが心地よく話せます。";
    }
  } else if (score >= 70) {
    description = "コミュニケーションスタイルに違いはありますが、お互いのペースを尊重できます。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。お互いのペースを理解し、尊重し合いましょう。`;
    } else {
      example = "例えば、一方が積極的に話す一方で、もう一方がじっくり考える時間が必要な場合、お互いのペースを理解し合いましょう。";
    }
  } else {
    description = "コミュニケーションの取り方に違いがあるため、お互いのスタイルを理解することが重要です。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。2人とも積極的に話す場合、お互いの話を聞く時間を作ることが大切です。`;
    } else {
      example = "例えば、2人とも積極的に話す場合、会話が重なりやすいかもしれません。お互いの話を聞く時間を作ることが大切です。";
    }
  }
  
  return { score, description, example };
}

/**
 * ストレス対応を計算
 */
function calculateStressResponse(
  type1: PersonalityType,
  type2: PersonalityType
): { score: number; description: string; example: string } {
  const comm1 = type1.traits.communication;
  const comm2 = type2.traits.communication;
  const rel1 = type1.traits.relationship;
  const rel2 = type2.traits.relationship;
  
  let score = 60;
  
  // 関係性が補完的だとストレス対応が良い
  if (
    (rel1 === "リード型" && rel2 === "寄り添い型") ||
    (rel1 === "寄り添い型" && rel2 === "リード型")
  ) {
    score += 25;
  } else if (rel1 === rel2 && rel1 === "対等型") {
    score += 20;
  }
  
  // コミュニケーションが補完的だとサポートし合える
  if (
    (comm1 === "積極型" && comm2 === "受容型") ||
    (comm1 === "受容型" && comm2 === "積極型")
  ) {
    score += 15;
  }
  
  score = Math.min(100, Math.max(0, score));
  
  let description = "";
  let example = "";
  
  // タイプの詳細情報を活用
  const personality1 = type1.personality || "";
  const personality2 = type2.personality || "";
  
  if (score >= 85) {
    description = "ストレスを感じた時、お互いが自然にサポートし合える関係です。";
    if (personality1 && personality2) {
      example = `${type1.name}は「${personality1}」、${type2.name}は「${personality2}」という性格です。一方がストレスで落ち込んでいる時、もう一方が適切に支え、逆の時も同様に助け合えます。`;
    } else {
      example = "例えば、一方がストレスで落ち込んでいる時、もう一方が適切に支え、逆の時も同様に助け合えます。";
    }
  } else if (score >= 70) {
    description = "ストレス対応の方法が異なりますが、お互いを理解しようと努められます。";
    if (personality1 && personality2) {
      example = `${type1.name}は「${personality1}」、${type2.name}は「${personality2}」という性格です。ストレス対応の方法が異なりますが、お互いのニーズを尊重し合いましょう。`;
    } else {
      example = "例えば、一方が1人で過ごす時間を必要とし、もう一方が話を聞いてほしい場合、お互いのニーズを尊重し合いましょう。";
    }
  } else {
    description = "ストレス対応のスタイルが異なるため、お互いの方法を理解することが大切です。";
    if (personality1 && personality2) {
      example = `${type1.name}は「${personality1}」、${type2.name}は「${personality2}」という性格です。2人とも同じようにストレスに対応する場合、お互いが疲れている時は距離を置くことも必要かもしれません。`;
    } else {
      example = "例えば、2人とも同じようにストレスに対応する場合、お互いが疲れている時は距離を置くことも必要かもしれません。";
    }
  }
  
  return { score, description, example };
}

/**
 * 生活リズムを計算
 */
function calculateLifestyleRhythm(
  type1: PersonalityType,
  type2: PersonalityType
): { score: number; description: string; example: string } {
  const comm1 = type1.traits.communication;
  const comm2 = type2.traits.communication;
  const rel1 = type1.traits.relationship;
  const rel2 = type2.traits.relationship;
  
  let score = 65;
  
  // 関係性が対等型だと生活リズムが合いやすい
  if (rel1 === "対等型" && rel2 === "対等型") {
    score = 85;
  } else if (rel1 === "対等型" || rel2 === "対等型") {
    score = 75;
  }
  
  // コミュニケーションがバランス型だと調整しやすい
  if (comm1 === "バランス型" || comm2 === "バランス型") {
    score += 10;
  }
  
  score = Math.min(100, Math.max(0, score));
  
  let description = "";
  let example = "";
  
  // タイプの詳細情報を活用
  const dailyActions1 = type1.dailyActions || "";
  const dailyActions2 = type2.dailyActions || "";
  
  if (score >= 80) {
    description = "生活リズムが自然と合い、無理なく一緒に過ごせます。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。朝型と夜型の違いがあっても、お互いの生活パターンを尊重し、自然に調整し合えます。`;
    } else {
      example = "例えば、朝型と夜型の違いがあっても、お互いの生活パターンを尊重し、自然に調整し合えます。";
    }
  } else if (score >= 65) {
    description = "生活リズムに違いはありますが、お互いに調整できます。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。お互いの時間を尊重し、一緒に過ごす時間と1人の時間のバランスを取りましょう。`;
    } else {
      example = "例えば、一方が早起きで活動的、もう一方が夜型でゆっくり過ごす場合、お互いの時間を尊重し合いましょう。";
    }
  } else {
    description = "生活リズムの違いを理解し、お互いのペースを大切にすることが重要です。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。生活パターンが大きく異なる場合、一緒に過ごす時間と1人の時間のバランスを取ることが大切です。`;
    } else {
      example = "例えば、生活パターンが大きく異なる場合、一緒に過ごす時間と1人の時間のバランスを取ることが大切です。";
    }
  }
  
  return { score, description, example };
}

/**
 * 愛情表現を計算
 */
function calculateLoveExpression(
  type1: PersonalityType,
  type2: PersonalityType
): { score: number; description: string; example: string } {
  const rel1 = type1.traits.relationship;
  const rel2 = type2.traits.relationship;
  const dec1 = type1.traits.decision;
  const dec2 = type2.traits.decision;
  
  let score = 60;
  
  // 関係性が補完的だと愛情表現が豊か
  if (
    (rel1 === "リード型" && rel2 === "寄り添い型") ||
    (rel1 === "寄り添い型" && rel2 === "リード型")
  ) {
    score = 90;
  } else if (rel1 === rel2 && rel1 === "対等型") {
    score = 80;
  }
  
  // 感情型が含まれると愛情表現が豊か
  if (dec1 === "感情型" || dec2 === "感情型") {
    score += 10;
  }
  
  score = Math.min(100, Math.max(0, score));
  
  let description = "";
  let example = "";
  
  // タイプの詳細情報を活用
  const romanceTendency1 = type1.romanceTendency || "";
  const romanceTendency2 = type2.romanceTendency || "";
  const dailyActions1 = type1.dailyActions || "";
  const dailyActions2 = type2.dailyActions || "";
  
  if (score >= 85) {
    description = "愛情表現の方法が絶妙に補い合い、お互いの愛情を感じ合えます。";
    if (romanceTendency1 && dailyActions2) {
      example = `${type1.name}は「${romanceTendency1}」、${type2.name}は「${dailyActions2}」という特徴があります。一方が積極的に愛情を表現し、もう一方がそれを深く受け止める関係で、お互いの愛情が自然に伝わります。`;
    } else {
      example = "例えば、一方が積極的に愛情を表現し、もう一方がそれを深く受け止める関係。お互いの愛情が自然に伝わります。";
    }
  } else if (score >= 70) {
    description = "愛情表現のスタイルに違いはありますが、お互いの方法を理解できます。";
    if (dailyActions1 && dailyActions2) {
      example = `${type1.name}は「${dailyActions1}」、${type2.name}は「${dailyActions2}」という行動パターンがあります。一方が言葉で愛情を表現し、もう一方が行動で示す場合でも、愛情は確実に伝わります。`;
    } else {
      example = "例えば、一方が言葉で愛情を表現し、もう一方が行動で示す場合でも、愛情は確実に伝わります。";
    }
  } else {
    description = "愛情表現の方法が異なりますが、お互いのスタイルを尊重することが大切です。";
    if (romanceTendency1 && romanceTendency2) {
      example = `${type1.name}は「${romanceTendency1}」、${type2.name}は「${romanceTendency2}」という恋愛傾向があります。愛情表現の頻度や方法が異なる場合、お互いがどのように愛情を感じるかを話し合うことが重要です。`;
    } else {
      example = "例えば、愛情表現の頻度や方法が異なる場合、お互いがどのように愛情を感じるかを話し合うことが重要です。";
    }
  }
  
  return { score, description, example };
}

/**
 * 強みを抽出
 */
function extractStrengths(
  type1: PersonalityType,
  type2: PersonalityType,
  analysis: DetailedCompatibilityAnalysis
): string[] {
  const strengths: string[] = [];
  
  // コミュニケーションが補完的
  if (
    (type1.traits.communication === "積極型" && type2.traits.communication === "受容型") ||
    (type1.traits.communication === "受容型" && type2.traits.communication === "積極型")
  ) {
    if (type1.dailyActions && type2.dailyActions) {
      strengths.push(`会話が自然に流れ、お互いの話を聞き合える関係。${type1.name}は「${type1.dailyActions}」、${type2.name}は「${type2.dailyActions}」という行動パターンが補い合います`);
    } else {
      strengths.push("会話が自然に流れ、お互いの話を聞き合える関係");
    }
  }
  
  // 関係性が補完的
  if (
    (type1.traits.relationship === "リード型" && type2.traits.relationship === "寄り添い型") ||
    (type1.traits.relationship === "寄り添い型" && type2.traits.relationship === "リード型")
  ) {
    if (type1.romanceTendency && type2.romanceTendency) {
      strengths.push(`役割分担が自然にでき、お互いを支え合える関係。${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」という恋愛傾向が補い合います`);
    } else {
      strengths.push("役割分担が自然にでき、お互いを支え合える関係");
    }
  }
  
  // 意思決定が同じ
  if (type1.traits.decision === type2.traits.decision) {
    if (type1.innerMotivation && type2.innerMotivation) {
      strengths.push(`物事の判断基準が似ており、価値観が近い。${type1.name}は「${type1.innerMotivation}」、${type2.name}は「${type2.innerMotivation}」という価値観を共有しています`);
    } else {
      strengths.push("物事の判断基準が似ており、価値観が近い");
    }
  }
  
  // 高スコアの項目を強みとして追加
  if (analysis.communicationStyle >= 85) {
    if (type1.dailyActions && type2.dailyActions) {
      strengths.push(`コミュニケーションがスムーズで、誤解が生まれにくい。${type1.dailyActions}という${type1.name}の行動パターンと${type2.dailyActions}という${type2.name}の行動パターンが自然に調和します`);
    } else {
      strengths.push("コミュニケーションがスムーズで、誤解が生まれにくい");
    }
  }
  if (analysis.loveExpression >= 85) {
    if (type1.romanceTendency && type2.romanceTendency) {
      strengths.push(`愛情表現が豊かで、お互いの愛情を感じ合える。${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」という恋愛傾向が互いに響き合います`);
    } else {
      strengths.push("愛情表現が豊かで、お互いの愛情を感じ合える");
    }
  }
  if (analysis.stressResponse >= 85) {
    if (type1.personality && type2.personality) {
      strengths.push(`ストレスを感じた時、お互いが自然にサポートし合える。${type1.name}は「${type1.personality}」、${type2.name}は「${type2.personality}」という性格が支え合います`);
    } else {
      strengths.push("ストレスを感じた時、お互いが自然にサポートし合える");
    }
  }
  
  return strengths.length > 0 ? strengths : ["お互いを理解しようとする姿勢がある"];
}

/**
 * チャレンジポイントを抽出
 */
function extractChallenges(
  type1: PersonalityType,
  type2: PersonalityType,
  analysis: DetailedCompatibilityAnalysis
): string[] {
  const challenges: string[] = [];
  
  // コミュニケーションが同じ極端なタイプ
  if (
    type1.traits.communication === type2.traits.communication &&
    type1.traits.communication !== "バランス型"
  ) {
    if (type1.dailyActions && type2.dailyActions) {
      challenges.push(`2人とも同じコミュニケーションスタイルのため、会話のバランスを取る必要がある。${type1.name}は「${type1.dailyActions}」、${type2.name}も「${type2.dailyActions}」という行動パターンが似ているため、お互いの話を聞く時間を意識的に作りましょう`);
    } else {
      challenges.push("2人とも同じコミュニケーションスタイルのため、会話のバランスを取る必要がある");
    }
  }
  
  // 意思決定が対極
  if (
    (type1.traits.decision === "論理型" && type2.traits.decision === "感情型") ||
    (type1.traits.decision === "感情型" && type2.traits.decision === "論理型")
  ) {
    if (type1.innerMotivation && type2.innerMotivation) {
      challenges.push(`物事の判断基準が異なるため、お互いの考え方を理解し合う必要がある。${type1.name}は「${type1.innerMotivation}」、${type2.name}は「${type2.innerMotivation}」という価値観の違いを尊重し合いましょう`);
    } else {
      challenges.push("物事の判断基準が異なるため、お互いの考え方を理解し合う必要がある");
    }
  }
  
  // 関係性が同じ極端なタイプ
  if (
    type1.traits.relationship === type2.traits.relationship &&
    type1.traits.relationship !== "対等型"
  ) {
    if (type1.romanceTendency && type2.romanceTendency) {
      challenges.push(`2人とも同じ関係性スタイルのため、役割分担を意識的に調整する必要がある。${type1.name}は「${type1.romanceTendency}」、${type2.name}も「${type2.romanceTendency}」という恋愛傾向が似ているため、時には役割を交換してみましょう`);
    } else {
      challenges.push("2人とも同じ関係性スタイルのため、役割分担を意識的に調整する必要がある");
    }
  }
  
  // 低スコアの項目をチャレンジとして追加
  if (analysis.emotionalExpression < 60) {
    if (type1.romanceTendency && type2.romanceTendency) {
      challenges.push(`感情表現の方法が異なるため、お互いの気持ちを理解し合う努力が必要。${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」という恋愛傾向の違いを理解し、お互いの表現方法を尊重し合いましょう`);
    } else {
      challenges.push("感情表現の方法が異なるため、お互いの気持ちを理解し合う努力が必要");
    }
  }
  if (analysis.lifestyleRhythm < 65) {
    if (type1.dailyActions && type2.dailyActions) {
      challenges.push(`生活リズムの違いを理解し、お互いのペースを尊重する必要がある。${type1.name}は「${type1.dailyActions}」、${type2.name}は「${type2.dailyActions}」という行動パターンの違いを理解し、一緒に過ごす時間と1人の時間のバランスを取りましょう`);
    } else {
      challenges.push("生活リズムの違いを理解し、お互いのペースを尊重する必要がある");
    }
  }
  
  return challenges.length > 0 ? challenges : ["お互いの違いを理解し、尊重し合うことが大切"];
}

/**
 * 改善のヒントを生成
 */
function generateImprovementTips(
  type1: PersonalityType,
  type2: PersonalityType,
  challenges: string[]
): { title: string; description: string }[] {
  const tips: { title: string; description: string }[] = [];
  
  // コミュニケーションの改善
  if (
    type1.traits.communication === type2.traits.communication &&
    type1.traits.communication !== "バランス型"
  ) {
    if (type1.dailyActions && type2.dailyActions) {
      tips.push({
        title: "会話の時間を意識的に作る",
        description: `2人とも同じスタイルの場合、会話が重なりやすいかもしれません。${type1.name}は「${type1.dailyActions}」、${type2.name}も「${type2.dailyActions}」という行動パターンが似ているため、お互いの話を聞く時間を意識的に作り、交互に話すことを心がけましょう。`
      });
    } else {
      tips.push({
        title: "会話の時間を意識的に作る",
        description: "2人とも同じスタイルの場合、会話が重なりやすいかもしれません。お互いの話を聞く時間を意識的に作り、交互に話すことを心がけましょう。"
      });
    }
  }
  
  // 感情表現の改善
  if (
    (type1.traits.decision === "論理型" && type2.traits.decision === "感情型") ||
    (type1.traits.decision === "感情型" && type2.traits.decision === "論理型")
  ) {
    if (type1.romanceTendency && type2.romanceTendency) {
      tips.push({
        title: "お互いの感情表現方法を理解する",
        description: `${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」という恋愛傾向の違いがあります。一方が感情を言葉で表現し、もう一方が行動で示す場合、お互いの愛情表現方法を理解し、感謝の気持ちを伝え合いましょう。`
      });
    } else {
      tips.push({
        title: "お互いの感情表現方法を理解する",
        description: "一方が感情を言葉で表現し、もう一方が行動で示す場合、お互いの愛情表現方法を理解し、感謝の気持ちを伝え合いましょう。"
      });
    }
  }
  
  // 関係性の改善
  if (
    type1.traits.relationship === type2.traits.relationship &&
    type1.traits.relationship !== "対等型"
  ) {
    if (type1.romanceTendency && type2.romanceTendency) {
      tips.push({
        title: "役割を柔軟に交換する",
        description: `2人とも同じスタイルの場合、時には役割を交換してみましょう。${type1.name}は「${type1.romanceTendency}」、${type2.name}も「${type2.romanceTendency}」という恋愛傾向が似ているため、リードする側と支える側を交互に経験することで、お互いをより深く理解できます。`
      });
    } else {
      tips.push({
        title: "役割を柔軟に交換する",
        description: "2人とも同じスタイルの場合、時には役割を交換してみましょう。リードする側と支える側を交互に経験することで、お互いをより深く理解できます。"
      });
    }
  }
  
  // 生活リズムの改善
  if (type1.dailyActions && type2.dailyActions) {
    tips.push({
      title: "お互いのペースを尊重する",
      description: `生活リズムが異なる場合、無理に合わせるのではなく、${type1.name}は「${type1.dailyActions}」、${type2.name}は「${type2.dailyActions}」という行動パターンを理解し、お互いの時間を大切にし、一緒に過ごす時間と1人の時間のバランスを取りましょう。`
    });
  } else {
    tips.push({
      title: "お互いのペースを尊重する",
      description: "生活リズムが異なる場合、無理に合わせるのではなく、お互いの時間を大切にし、一緒に過ごす時間と1人の時間のバランスを取りましょう。"
    });
  }
  
  return tips;
}

/**
 * コミュニケーションヒントを生成
 */
function generateCommunicationHints(
  type1: PersonalityType,
  type2: PersonalityType
): string[] {
  const hints: string[] = [];
  
  if (type1.traits.communication === "積極型" && type2.traits.communication === "受容型") {
    if (type1.dailyActions) {
      hints.push(`${type1.name}は、相手が話したい時に聞く姿勢を大切にしましょう。「${type1.dailyActions}」という行動パターンがあるため、時には一歩引いて、相手の話に耳を傾けることも大切です`);
    } else {
      hints.push(`${type1.name}は、相手が話したい時に聞く姿勢を大切にしましょう。時には一歩引いて、相手の話に耳を傾けることも大切です`);
    }
    if (type2.dailyActions) {
      hints.push(`${type2.name}は、自分の気持ちを言葉で伝えることを意識してみましょう。「${type2.dailyActions}」という行動パターンがあるため、時には積極的に自分の気持ちを言葉で表現してみてください`);
    } else {
      hints.push(`${type2.name}は、自分の気持ちを言葉で伝えることを意識してみましょう。時には積極的に自分の気持ちを言葉で表現してみてください`);
    }
  } else if (type1.traits.communication === "受容型" && type2.traits.communication === "積極型") {
    if (type1.dailyActions) {
      hints.push(`${type1.name}は、自分の気持ちを言葉で伝えることを意識してみましょう。「${type1.dailyActions}」という行動パターンがあるため、時には積極的に自分の気持ちを言葉で表現してみてください`);
    } else {
      hints.push(`${type1.name}は、自分の気持ちを言葉で伝えることを意識してみましょう。時には積極的に自分の気持ちを言葉で表現してみてください`);
    }
    if (type2.dailyActions) {
      hints.push(`${type2.name}は、相手が話したい時に聞く姿勢を大切にしましょう。「${type2.dailyActions}」という行動パターンがあるため、時には一歩引いて、相手の話に耳を傾けることも大切です`);
    } else {
      hints.push(`${type2.name}は、相手が話したい時に聞く姿勢を大切にしましょう。時には一歩引いて、相手の話に耳を傾けることも大切です`);
    }
  }
  
  if (type1.traits.decision === "論理型" && type2.traits.decision === "感情型") {
    if (type1.romanceTendency) {
      hints.push(`${type1.name}は、相手の感情を理解しようと努めましょう。「${type1.romanceTendency}」という恋愛傾向があるため、時には感情的な側面にも目を向けてみてください`);
    } else {
      hints.push(`${type1.name}は、相手の感情を理解しようと努めましょう。時には感情的な側面にも目を向けてみてください`);
    }
    if (type2.romanceTendency) {
      hints.push(`${type2.name}は、自分の気持ちを論理的に説明することを試してみましょう。「${type2.romanceTendency}」という恋愛傾向があるため、時には感情を言葉で整理して伝えてみてください`);
    } else {
      hints.push(`${type2.name}は、自分の気持ちを論理的に説明することを試してみましょう。時には感情を言葉で整理して伝えてみてください`);
    }
  } else if (type1.traits.decision === "感情型" && type2.traits.decision === "論理型") {
    if (type1.romanceTendency) {
      hints.push(`${type1.name}は、自分の気持ちを論理的に説明することを試してみましょう。「${type1.romanceTendency}」という恋愛傾向があるため、時には感情を言葉で整理して伝えてみてください`);
    } else {
      hints.push(`${type1.name}は、自分の気持ちを論理的に説明することを試してみましょう。時には感情を言葉で整理して伝えてみてください`);
    }
    if (type2.romanceTendency) {
      hints.push(`${type2.name}は、相手の感情を理解しようと努めましょう。「${type2.romanceTendency}」という恋愛傾向があるため、時には感情的な側面にも目を向けてみてください`);
    } else {
      hints.push(`${type2.name}は、相手の感情を理解しようと努めましょう。時には感情的な側面にも目を向けてみてください`);
    }
  }
  
  return hints.length > 0 ? hints : ["お互いの話を聞き、理解しようとする姿勢を大切にしましょう"];
}

/**
 * 会話のきっかけを生成
 */
function generateConversationStarters(
  type1: PersonalityType,
  type2: PersonalityType
): string[] {
  return [
    "この診断結果を見て、どんなことを感じましたか？",
    "お互いのタイプの特徴で、当てはまると思う部分はありますか？",
    "2人の相性の強みについて、実際の関係で感じたことはありますか？",
    "チャレンジポイントについて、2人の関係で経験したことはありますか？",
    "お互いの愛情表現方法について、どう感じていますか？",
    "生活リズムや価値観の違いについて、どう調整していきたいですか？",
    "この診断結果を踏まえて、2人の関係で大切にしたいことは何ですか？"
  ];
}

/**
 * 未来へのメッセージを生成
 */
function generateFutureMessage(
  type1: PersonalityType,
  type2: PersonalityType,
  totalScore: number
): string {
  if (totalScore >= 85) {
    return `2人の相性は素晴らしいものです。${type1.name}と${type2.name}の組み合わせは、お互いを高め合い、支え合える関係を築けるでしょう。違いを楽しみながら、一緒に成長していける未来が待っています。`;
  } else if (totalScore >= 70) {
    return `${type1.name}と${type2.name}の2人は、お互いを理解し、尊重し合うことで、素晴らしい関係を築けます。違いは個性であり、それを活かすことで、より深い絆を育んでいけるでしょう。`;
  } else {
    return `2人のタイプは異なりますが、それはお互いを補い合えるということでもあります。${type1.name}と${type2.name}の組み合わせは、理解と努力によって、かけがえのない関係を築けるでしょう。お互いを大切にしながら、一緒に歩んでいきましょう。`;
  }
}

/**
 * 総合スコアに基づいて各項目のスコアを調整
 * 総合スコアに合わせて各項目も適切な範囲に調整する
 */
function adjustScoresByTotalScore(
  baseScore: number,
  totalScore: number
): number {
  // 総合スコアを基準に、各項目のスコアを適切な範囲に調整
  // 高スコアでも各項目が全部100%にならないようにする
  
  // 総合スコアに基づいて、各項目のスコアを適切な範囲にマッピング
  // 総合スコアが高い場合：各項目も高めに、ただし元のスコアの範囲内で調整
  // 総合スコアが低い場合：各項目も低めに調整
  
  // 総合スコアを基準に、各項目のスコアを調整
  // ただし、元のスコアの相対的な関係は保つ
  
  // 総合スコアが70%を基準として、各項目を調整
  // 総合スコアが70%の場合、調整係数は1.0（そのまま）
  // 総合スコアが46%の場合、調整係数は約0.66（低く調整）
  // 総合スコアが88%の場合、調整係数は約1.26だが、元のスコアを超えないように制限
  
  const baseReference = 70; // 基準スコア
  const adjustmentFactor = totalScore / baseReference;
  
  // 調整後のスコアを計算
  let adjustedScore = Math.round(baseScore * adjustmentFactor);
  
  // 高スコアの場合の制限：
  // - 元のスコアを超えないようにする（元のスコアが80点なら、調整後も80点以下）
  // - ただし、総合スコアが高い場合は、元のスコアに近づける
  if (totalScore > 70) {
    // 高スコアの場合：元のスコアを超えないようにしつつ、総合スコアに近づける
    const maxAllowed = Math.min(100, baseScore + (totalScore - 70) * 0.5);
    adjustedScore = Math.min(maxAllowed, adjustedScore);
  } else {
    // 低スコアの場合：比例して低くする
    adjustedScore = Math.max(20, adjustedScore);
  }
  
  // 最終的な制限：最低20点、最高100点
  adjustedScore = Math.min(100, Math.max(20, adjustedScore));
  
  return adjustedScore;
}

/**
 * 詳細な相性分析を実行
 */
export function analyzeDetailedCompatibility(
  type1: PersonalityType,
  type2: PersonalityType,
  totalScore: number
): DetailedCompatibilityAnalysis {
  const valuesAlignmentDetail = calculateValuesAlignment(type1, type2);
  const emotionalExpressionDetail = calculateEmotionalExpression(type1, type2);
  const communicationStyleDetail = calculateCommunicationStyle(type1, type2);
  const stressResponseDetail = calculateStressResponse(type1, type2);
  const lifestyleRhythmDetail = calculateLifestyleRhythm(type1, type2);
  const loveExpressionDetail = calculateLoveExpression(type1, type2);
  
  // 総合スコアに基づいて各項目のスコアを調整
  const adjustedValuesAlignment = adjustScoresByTotalScore(valuesAlignmentDetail.score, totalScore);
  const adjustedEmotionalExpression = adjustScoresByTotalScore(emotionalExpressionDetail.score, totalScore);
  const adjustedCommunicationStyle = adjustScoresByTotalScore(communicationStyleDetail.score, totalScore);
  const adjustedStressResponse = adjustScoresByTotalScore(stressResponseDetail.score, totalScore);
  const adjustedLifestyleRhythm = adjustScoresByTotalScore(lifestyleRhythmDetail.score, totalScore);
  const adjustedLoveExpression = adjustScoresByTotalScore(loveExpressionDetail.score, totalScore);
  
  // 調整後のスコアで詳細情報も更新
  const adjustedValuesAlignmentDetail = {
    ...valuesAlignmentDetail,
    score: adjustedValuesAlignment
  };
  const adjustedEmotionalExpressionDetail = {
    ...emotionalExpressionDetail,
    score: adjustedEmotionalExpression
  };
  const adjustedCommunicationStyleDetail = {
    ...communicationStyleDetail,
    score: adjustedCommunicationStyle
  };
  const adjustedStressResponseDetail = {
    ...stressResponseDetail,
    score: adjustedStressResponse
  };
  const adjustedLifestyleRhythmDetail = {
    ...lifestyleRhythmDetail,
    score: adjustedLifestyleRhythm
  };
  const adjustedLoveExpressionDetail = {
    ...loveExpressionDetail,
    score: adjustedLoveExpression
  };
  
  const analysis: DetailedCompatibilityAnalysis = {
    valuesAlignment: adjustedValuesAlignment,
    emotionalExpression: adjustedEmotionalExpression,
    communicationStyle: adjustedCommunicationStyle,
    stressResponse: adjustedStressResponse,
    lifestyleRhythm: adjustedLifestyleRhythm,
    loveExpression: adjustedLoveExpression,
    valuesAlignmentDetail: adjustedValuesAlignmentDetail,
    emotionalExpressionDetail: adjustedEmotionalExpressionDetail,
    communicationStyleDetail: adjustedCommunicationStyleDetail,
    stressResponseDetail: adjustedStressResponseDetail,
    lifestyleRhythmDetail: adjustedLifestyleRhythmDetail,
    loveExpressionDetail: adjustedLoveExpressionDetail,
    strengths: [],
    challenges: [],
    improvementTips: [],
    communicationHints: [],
    conversationStarters: [],
    futureMessage: ""
  };
  
  analysis.strengths = extractStrengths(type1, type2, analysis);
  analysis.challenges = extractChallenges(type1, type2, analysis);
  analysis.improvementTips = generateImprovementTips(type1, type2, analysis.challenges);
  analysis.communicationHints = generateCommunicationHints(type1, type2);
  analysis.conversationStarters = generateConversationStarters(type1, type2);
  analysis.futureMessage = generateFutureMessage(type1, type2, totalScore);
  
  return analysis;
}

