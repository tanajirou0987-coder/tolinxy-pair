import type { PersonalityType } from "./types";
import { calculatePercentileRank } from "./calculate";

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
  challenges: {
    title: string;
    description: string;
  }[];
  improvementTips: {
    title: string;
    description: string;
  }[];
  
  // 会話のきっかけ
  conversationStarters: string[];
  
  // 未来へのメッセージ
  futureMessage: string;
}

type AxisKey =
  | "valuesAlignment"
  | "emotionalExpression"
  | "communicationStyle"
  | "stressResponse"
  | "lifestyleRhythm"
  | "loveExpression";

const axisLabels: Record<AxisKey, string> = {
  valuesAlignment: "価値観シンクロ",
  emotionalExpression: "感情共有",
  communicationStyle: "会話テンポ",
  stressResponse: "ケア感度",
  lifestyleRhythm: "生活リズム",
  loveExpression: "愛情表現",
};

const axisCandidateTemplates: Record<
  AxisKey,
  {
    highText: string;
    midText: string;
    highThreshold?: number;
    midThreshold?: number;
  }
> = {
  valuesAlignment: {
    highText: "価値観が近く、物事の判断基準が似ている。",
    midText: "基本的な価値観は共有できている。",
    highThreshold: 85,
    midThreshold: 70,
  },
  emotionalExpression: {
    highText: "感情を素直に表現でき、お互いの気持ちを理解し合える。",
    midText: "感情表現のスタイルに違いはあるが、お互いを理解しようと努められる。",
    highThreshold: 85,
    midThreshold: 70,
  },
  communicationStyle: {
    highText: "会話のスタイルが補い合い、自然に話せる。",
    midText: "コミュニケーションスタイルに違いはあるが、お互いのペースを尊重できる。",
    highThreshold: 85,
    midThreshold: 70,
  },
  stressResponse: {
    highText: "ストレスを感じた時、お互いが自然にサポートし合える。",
    midText: "ストレス対応の方法が異なるが、お互いを理解しようと努められる。",
    highThreshold: 85,
    midThreshold: 70,
  },
  lifestyleRhythm: {
    highText: "生活リズムが自然と合い、無理なく一緒に過ごせる。",
    midText: "生活リズムに違いはあるが、お互いに調整できる。",
    highThreshold: 80,
    midThreshold: 65,
  },
  loveExpression: {
    highText: "愛情表現の方法が補い合い、お互いの愛情を感じ合える。",
    midText: "愛情表現のスタイルに違いはあるが、お互いの方法を理解できる。",
    highThreshold: 85,
    midThreshold: 70,
  },
};

const axisFallbackTemplates: Record<AxisKey, { high: string; low: string }> = {
  valuesAlignment: {
    high: "価値観のベースが近く、判断の方向性を自然に共有できる関係です。",
    low: "価値観の土台が似ていて、意見のズレも話し合って調整できる柔軟さがあります。",
  },
  emotionalExpression: {
    high: "感情表現がスムーズで、嬉しい・辛い気持ちをすぐ共有できる関係です。",
    low: "感情表現の違いも理解し合えるゆとりがあり、安心して気持ちを出せます。",
  },
  communicationStyle: {
    high: "コミュニケーションのリズムがうまく合って、自然に会話が続きます。",
    low: "会話のペースを尊重し合える関係で、安心して伝えたいことを話せます。",
  },
  stressResponse: {
    high: "ストレス時も互いが自然に支え合える安心感があります。",
    low: "それぞれのストレスへの反応が違っても、思いやりでカバーし合えます。",
  },
  lifestyleRhythm: {
    high: "生活リズムが合っていて、気負わず一緒に過ごせる関係です。",
    low: "生活スタイルの違いをうまく調整しながら、自然とリズムが整っていく関係です。",
  },
  loveExpression: {
    high: "愛情表現が素直に伝わり、お互いの気持ちを強く感じ合える関係です。",
    low: "愛情の伝え方に違いがあっても、理解しようとする姿勢が安心を生みます。",
  },
};

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
  analysis: DetailedCompatibilityAnalysis,
  totalScore: number,
  percentile: number
): string[] {
  const strengths: string[] = [];
  
  const pushStrength = (text: string) => {
    if (!strengths.includes(text)) {
      strengths.push(text);
    }
  };

  // コミュニケーションが補完的（積極型×受容型）
  if (
    (type1.traits.communication === "積極型" && type2.traits.communication === "受容型") ||
    (type1.traits.communication === "受容型" && type2.traits.communication === "積極型")
  ) {
    const extrovert = type1.traits.communication === "積極型" ? type1 : type2;
    const introvert = extrovert === type1 ? type2 : type1;
    if (extrovert.traits.decision === "感情型" && introvert.traits.decision === "感情型") {
      pushStrength(`${extrovert.name}が話題を広げて${introvert.name}が深く聞いてくれる関係で、飲み会でも2人だけの会話が弾み、長電話でも飽きないコンビです。会話のテンポが絶妙に合っていて、お互いが心地よく話せる関係になっています。`);
    } else if (extrovert.traits.decision === "論理型" && introvert.traits.decision === "論理型") {
      pushStrength(`${extrovert.name}が情報を整理して話し、${introvert.name}がじっくり理解する関係で、議論が深まりやすく、お互いの意見を尊重し合えます。会話を通じてお互いの考えを深め合える、知的な関係です。`);
    } else {
      pushStrength(`${extrovert.name}が話題を広げて${introvert.name}が深く聞いてくれる関係で、会話のテンポが合っていて自然に話が続きます。お互いの話を聞き合える、心地よい関係です。`);
    }
  }
  
  // コミュニケーションが同じ（積極型×積極型）
  if (
    type1.traits.communication === "積極型" && type2.traits.communication === "積極型"
  ) {
    if (type1.traits.decision === "感情型" && type2.traits.decision === "感情型") {
      pushStrength(`2人とも話したいことが多く、会話が途切れない関係です。デート中も「あ、それ聞きたい！」と次々話題が広がり、お互いの話を聞き合える活発な関係になっています。`);
    } else {
      pushStrength(`2人とも積極的に話すタイプで、会話が活発で意見交換が盛り上がります。お互いの意見を尊重し合いながら、楽しく話し合える関係です。`);
    }
  }
  
  // コミュニケーションが同じ（受容型×受容型）
  if (
    type1.traits.communication === "受容型" && type2.traits.communication === "受容型"
  ) {
    pushStrength(`2人とも聞き上手で、お互いの話を深く理解し合える関係です。静かな時間も心地よく、無理に話さなくても通じ合える、落ち着いた関係になっています。`);
  }
  
  // 関係性が補完的（リード型×寄り添い型）
  if (
    (type1.traits.relationship === "リード型" && type2.traits.relationship === "寄り添い型") ||
    (type1.traits.relationship === "寄り添い型" && type2.traits.relationship === "リード型")
  ) {
    const leadType = type1.traits.relationship === "リード型" ? type1 : type2;
    const supportType = type1.traits.relationship === "寄り添い型" ? type1 : type2;
    if (leadType.traits.decision === "論理型" && supportType.traits.decision === "感情型") {
      pushStrength(`${leadType.name}が計画を立て、${supportType.name}が気持ちに寄り添う関係で、旅行の計画は${leadType.name}が立てて${supportType.name}が細かい気遣いをするなど、役割が自然に分かれて動けます。お互いの強みを活かし合える、補完的な関係です。`);
    } else if (leadType.traits.decision === "感情型" && supportType.traits.decision === "感情型") {
      pushStrength(`${leadType.name}が決断し、${supportType.name}が支える関係で、役割が自然に分かれてお互いが無理なく動けます。お互いを尊重し合いながら、一緒に進んでいける関係です。`);
    } else {
      pushStrength(`${leadType.name}が決断し、${supportType.name}が支える関係で、役割が自然に分かれてストレスなく動けます。お互いの役割を理解し合える、バランスの取れた関係です。`);
    }
  }
  
  // 関係性が同じ（リード型×リード型）
  if (
    type1.traits.relationship === "リード型" && type2.traits.relationship === "リード型"
  ) {
    pushStrength(`2人ともリード役になりがちですが、お互いの判断を尊重し合える関係です。意見が合わない時も話し合って最適解を見つけられる、対等な関係になっています。`);
  }
  
  // 関係性が同じ（寄り添い型×寄り添い型）
  if (
    type1.traits.relationship === "寄り添い型" && type2.traits.relationship === "寄り添い型"
  ) {
    pushStrength(`2人ともサポート役になりがちですが、お互いを思いやる気持ちが強い関係です。疲れた時に支え合える、優しく温かい関係になっています。`);
  }
  
  // 関係性が同じ（対等型×対等型）
  if (
    type1.traits.relationship === "対等型" && type2.traits.relationship === "対等型"
  ) {
    pushStrength(`2人とも対等な関係を大切にするタイプで、役割分担が自然にできて無理なく一緒に動けます。お互いを尊重し合いながら、フェアな関係を築けます。`);
  }
  
  // 意思決定が同じ（感情型×感情型）
  if (type1.traits.decision === "感情型" && type2.traits.decision === "感情型") {
    if (type1.traits.communication === "積極型" && type2.traits.communication === "積極型") {
      pushStrength(`2人とも感情豊かで、デート中に「今の気持ち分かる！」と共感し合える関係です。嬉しい時は2人で大はしゃぎでき、感情を共有し合える、温かい関係になっています。`);
    } else {
      pushStrength(`2人とも感情を大切にするタイプで、気持ちを共有しやすく共感し合える関係です。お互いの感情を理解し合いながら、深い絆を築けます。`);
    }
  }
  
  // 意思決定が同じ（論理型×論理型）
  if (type1.traits.decision === "論理型" && type2.traits.decision === "論理型") {
    pushStrength(`2人とも論理的に考えるタイプで、判断基準が似ていて一緒に決めやすい関係です。将来の計画も話し合いやすく、お互いの考えを理解し合える、安定した関係です。`);
  }
  
  // 意思決定が同じ（ハイブリッド型×ハイブリッド型）
  if (type1.traits.decision === "ハイブリッド型" && type2.traits.decision === "ハイブリッド型") {
    pushStrength(`2人とも柔軟に判断できるタイプで、状況に応じて最適な選択ができ、お互いの判断を尊重し合えます。臨機応変に対応しながら、一緒に進んでいける関係です。`);
  }
  
  // 意思決定が補完的（論理型×感情型）
  if (
    (type1.traits.decision === "論理型" && type2.traits.decision === "感情型") ||
    (type1.traits.decision === "感情型" && type2.traits.decision === "論理型")
  ) {
    const logicType = type1.traits.decision === "論理型" ? type1 : type2;
    const emotionType = type1.traits.decision === "感情型" ? type1 : type2;
    pushStrength(`${logicType.name}が論理的に整理し、${emotionType.name}が感情を大切にする関係で、判断基準が違うからこそお互いの視点を尊重し合えます。異なる視点を活かし合える、補完的な関係です。`);
  }
  
  // 高スコアの項目を強みとして追加
  if (analysis.communicationStyle >= 85) {
    if (type1.traits.communication === "積極型" && type2.traits.communication === "受容型") {
      // 既に追加済みの場合はスキップ
      if (!strengths.some(s => s.includes("会話のテンポ"))) {
        pushStrength(`会話のテンポが絶妙に合っていて、長電話でも飽きない関係です。LINEの返信も途切れず、お互いの話を聞き合える、心地よい関係になっています。`);
      }
    } else if (type1.traits.communication === type2.traits.communication && type1.traits.communication === "積極型") {
      // 既に追加済みの場合はスキップ
      if (!strengths.some(s => s.includes("会話が途切れない"))) {
        pushStrength(`2人とも話したいことが多く、会話が途切れない関係です。デート中も次々話題が広がり、お互いの話を聞き合える活発な関係になっています。`);
      }
    } else {
      pushStrength(`会話のテンポが合っていて、長く話していても疲れない関係です。お互いの話を聞き合いながら、自然に会話が続く、心地よい関係です。`);
    }
  }
  
  if (analysis.loveExpression >= 85) {
    if (type1.traits.decision === "感情型" && type2.traits.decision === "感情型") {
      // 既に追加済みの場合はスキップ
      if (!strengths.some(s => s.includes("感情豊か"))) {
        pushStrength(`2人とも感情豊かで、愛情表現が自然に伝わる関係です。「好き」と言い合える関係で、お互いの気持ちが伝わりやすい、温かい関係になっています。`);
      }
    } else if (type1.traits.relationship === "リード型" && type2.traits.relationship === "寄り添い型") {
      pushStrength(`愛情表現の方法が補い合っていて、お互いの気持ちが伝わりやすい関係です。お互いの愛情を感じ合える、温かい関係になっています。`);
    } else {
      pushStrength(`愛情表現の方法が合っていて、お互いの気持ちが伝わりやすい関係です。お互いの愛情を感じ合える、温かい関係です。`);
    }
  }
  
  if (analysis.stressResponse >= 85) {
    if (type1.traits.relationship === "寄り添い型" && type2.traits.relationship === "寄り添い型") {
      // 既に追加済みの場合はスキップ
      if (!strengths.some(s => s.includes("支え合える"))) {
        pushStrength(`2人とも優しく、疲れた時に支え合える関係です。一緒にいると安心できる、温かい関係になっています。`);
      }
    } else {
      pushStrength(`疲れた時に支え合える関係で、一緒にいると安心できる関係です。お互いを思いやりながら、一緒に乗り越えていける関係になっています。`);
    }
  }
  
  if (analysis.emotionalExpression >= 85) {
    if (type1.traits.decision === "感情型" && type2.traits.decision === "感情型") {
      // 既に追加済みの場合はスキップ
      if (!strengths.some(s => s.includes("感情を素直に表現"))) {
        pushStrength(`2人とも感情を素直に表現できる関係で、嬉しい時も悲しい時も分かち合えます。お互いの気持ちを理解し合いながら、深い絆を築けます。`);
      }
    } else {
      pushStrength(`感情を素直に表現でき、お互いの気持ちを理解し合える関係です。お互いの感情を受け止め合いながら、深い絆を築けます。`);
    }
  }
  
  if (analysis.valuesAlignment >= 85) {
    if (type1.traits.decision === type2.traits.decision) {
      pushStrength(`価値観が近く、物事の判断基準が似ている関係です。将来の計画も話し合いやすく、お互いの価値観を理解し合える、安定した関係になっています。`);
    } else {
      pushStrength(`基本的な価値観は共有できている関係で、違いを尊重し合えます。お互いの価値観を理解し合いながら、一緒に進んでいける関係です。`);
    }
  }
  
  if (analysis.lifestyleRhythm >= 80) {
    pushStrength(`生活リズムが合っていて、無理なく一緒に過ごせる関係です。週末の過ごし方も自然に決まり、お互いのペースを尊重し合える、心地よい関係になっています。`);
  }

  const axisAverage =
    (analysis.valuesAlignment +
      analysis.emotionalExpression +
      analysis.communicationStyle +
      analysis.stressResponse +
      analysis.lifestyleRhythm +
      analysis.loveExpression) /
    6;

  const desiredStrengthCount = determineStrengthCount(axisAverage, totalScore, percentile);

  for (const candidate of buildAxisCandidates(analysis)) {
    if (strengths.length >= desiredStrengthCount) break;
    if (candidate.score < 55) continue;
    if (!strengths.includes(candidate.text)) {
      strengths.push(candidate.text);
    }
  }

  addStrengthSummaryIfNeeded(type1, type2, totalScore, strengths, desiredStrengthCount);
  addAxisFallbackStrengths(strengths, analysis, desiredStrengthCount);

  return strengths.length > 0 ? strengths : ["お互いを理解しようとする姿勢がある"];
}

function determineStrengthCount(axisAverage: number, totalScore: number, percentile: number): number {
  const axisBasedStrengthCount =
    axisAverage >= 85 ? 4 : axisAverage >= 75 ? 3 : axisAverage >= 60 ? 2 : 1;
  const totalBasedStrengthCount =
    totalScore >= 85 ? 4 : totalScore >= 75 ? 3 : totalScore >= 65 ? 2 : 1;
  const percentileBasedStrengthCount =
    percentile >= 80 ? 4 : percentile >= 60 ? 3 : percentile >= 35 ? 2 : 1;
  return Math.max(axisBasedStrengthCount, totalBasedStrengthCount, percentileBasedStrengthCount);
}

function buildAxisCandidates(
  analysis: DetailedCompatibilityAnalysis
): { key: AxisKey; score: number; text: string }[] {
  return (Object.keys(axisLabels) as AxisKey[])
    .map((key) => {
      const score = analysis[key];
      const template = axisCandidateTemplates[key];
      if (!template) {
        return null;
      }

      const highThreshold = template.highThreshold ?? 85;
      const midThreshold = template.midThreshold ?? 70;
      const text =
        score >= highThreshold
          ? template.highText
          : score >= midThreshold
          ? template.midText
          : "";

      return text ? { key, score, text } : null;
    })
    .filter((candidate): candidate is { key: AxisKey; score: number; text: string } => Boolean(candidate))
    .sort((a, b) => b.score - a.score);
}

function addStrengthSummaryIfNeeded(
  type1: PersonalityType,
  type2: PersonalityType,
  totalScore: number,
  strengths: string[],
  desiredStrengthCount: number
) {
  if (strengths.length >= desiredStrengthCount) return;

  const summary =
    totalScore >= 85
      ? `${type1.name}と${type2.name}の総合スコアが非常に高く、お互いのタイプが自然と補完し合える関係です。`
      : totalScore >= 75
      ? `総合スコアが高く、${type1.name}と${type2.name}は安心感のある関係を築けています。`
      : totalScore >= 65
      ? `相性スコアが安定していて、お互いの補完性を活かしやすい関係です。`
      : `${type1.name}と${type2.name}には、協力し合える下地ができてきています。`;

  if (!strengths.includes(summary)) {
    strengths.push(summary);
  }
}

function addAxisFallbackStrengths(
  strengths: string[],
  analysis: DetailedCompatibilityAnalysis,
  desiredStrengthCount: number
) {
  if (strengths.length >= desiredStrengthCount) return;

  const axisPriority = (Object.keys(axisLabels) as AxisKey[]).sort(
    (a, b) => analysis[b] - analysis[a]
  );

  for (const axisKey of axisPriority) {
    if (strengths.length >= desiredStrengthCount) break;
    const fallback = getAxisFallbackMessage(axisKey, analysis[axisKey]);
    if (!fallback || strengths.includes(fallback)) continue;
    strengths.push(fallback);
  }
}

function getAxisFallbackMessage(key: AxisKey, score: number): string {
  const template = axisFallbackTemplates[key];
  if (!template) return "";
  return score >= 75 ? template.high : template.low;
}

/**
 * 診断結果をもとにチャレンジ提案を生成
 */
function generateChallenges(
  type1: PersonalityType,
  type2: PersonalityType,
  analysis: DetailedCompatibilityAnalysis
): { title: string; description: string }[] {
  const challenges: { title: string; description: string }[] = [];
  const addChallenge = (title: string, description: string) => {
    challenges.push({ title, description });
  };

  // コミュニケーションが似すぎている場合
  if (
    type1.traits.communication === type2.traits.communication &&
    type1.traits.communication !== "バランス型"
  ) {
    const style = type1.traits.communication;
    const title = `交互に話す5分セッション（${style}同士）`;
    const description =
      type1.dailyActions && type2.dailyActions
        ? `${type1.name}は「${type1.dailyActions}」、${type2.name}は「${type2.dailyActions}」タイプで、会話のペースが似ています。5分ずつ交代で「話し役・聞き役」になる時間を作って、お互いの話を最後まで聞くチャレンジをしてみよう。`
        : "会話のテンポが似ている2人だからこそ、5分ごとに話し役と聞き役を交代してみるチャレンジを。互いの話を丁寧に聞くことで理解度が一気に深まります。";
    addChallenge(title, description);
  }

  // 意思決定が正反対
  if (
    (type1.traits.decision === "論理型" && type2.traits.decision === "感情型") ||
    (type1.traits.decision === "感情型" && type2.traits.decision === "論理型")
  ) {
    const logicType = type1.traits.decision === "論理型" ? type1 : type2;
    const emotionType = type1.traits.decision === "感情型" ? type1 : type2;
    const title = "理由と気持ちをセットで共有するDAY";
    const description =
      logicType.innerMotivation && emotionType.innerMotivation
        ? `${logicType.name}は「${logicType.innerMotivation}」視点、${emotionType.name}は「${emotionType.innerMotivation}」視点で考える傾向があります。週1回、1つのテーマについて「まず感情」、「次に理由」を順番に話す練習をして、判断基準の違いを楽しく擦り合わせてみよう。`
        : "論理派と感情派のペアなので、週1回「テーマを決めて感情→理由の順で話す」チャレンジを。順番を決めることで、お互いの判断基準を噛みしめながら共有できます。";
    addChallenge(title, description);
  }

  // 関係性が同じ極端なタイプ
  if (
    type1.traits.relationship === type2.traits.relationship &&
    type1.traits.relationship !== "対等型"
  ) {
    const style = type1.traits.relationship;
    const title = `役割チェンジウィーク（${style}コンビ）`;
    const description =
      type1.romanceTendency && type2.romanceTendency
        ? `${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」で同じ役割に偏りがち。1週間ごとに「リードする側」と「委ねる側」を入れ替えて、違う立場の気持ちを体験してみよう。`
        : "似た役割スタイルの2人なので、週替わりでリード役とサポート役を入れ替えるチャレンジを設定。違う立場を経験すると、相手の大変さやありがたさが体感できます。";
    addChallenge(title, description);
  }

  // 感情表現スコアが低い
  if (analysis.emotionalExpression < 60) {
    const title = `感情表現${analysis.emotionalExpression}点→気持ちログ交換`;
    const description =
      type1.romanceTendency && type2.romanceTendency
        ? `今回は感情表現スコアが${analysis.emotionalExpression}点。${type1.name}の「${type1.romanceTendency}」と${type2.name}の「${type2.romanceTendency}」の違いを楽しみつつ、毎晩寝る前に「今日嬉しかったこと」「不安だったこと」を文章かボイスで送り合うチャレンジを1週間続けてみよう。`
        : `感情表現スコアが${analysis.emotionalExpression}点だったので、1日1つ「今日の感情」を送り合う習慣を試してみて。結果を見返すと、お互いの感じ方の癖が把握できます。`;
    addChallenge(title, description);
  }

  // 生活リズムスコアが低い
  if (analysis.lifestyleRhythm < 65) {
    const title = `生活リズム${analysis.lifestyleRhythm}点→時間割シェア`;
    const description =
      type1.dailyActions && type2.dailyActions
        ? `${type1.name}は「${type1.dailyActions}」、${type2.name}は「${type2.dailyActions}」という動き方。Googleカレンダーやメモアプリで「集中タイム」「オフの時間」を共有し、週末に「一緒に過ごしたい時間」を予約するチャレンジをしてみよう。`
        : `生活リズムスコアが${analysis.lifestyleRhythm}点だったので、毎週日曜に「来週一緒に過ごせそうな時間」を30分だけすり合わせるチャレンジを設定。習慣化するとズレが小さくなります。`;
    addChallenge(title, description);
  }

  if (!challenges.length) {
    addChallenge(
      "ウィークリーチェックイン",
      "今週の嬉しかったこと・直してほしいことを5分ずつ話す時間をつくって、お互いの変化に気づけるようにしよう。"
    );
  }

  return challenges;
}

/**
 * 改善のヒントを生成（このカップル特有のチャレンジと具体的な行動提案）
 */
function generateImprovementTips(
  type1: PersonalityType,
  type2: PersonalityType,
  analysis: DetailedCompatibilityAnalysis
): { title: string; description: string }[] {
  const tips: { title: string; description: string }[] = [];
  const pushTip = (title: string, description: string) => {
    if (tips.length < 3) tips.push({ title, description });
  };
  const describeCommunication = (type: PersonalityType) => `${type.name}は${type.traits.communication}タイプ`;
  const describeDecision = (type: PersonalityType) => `${type.name}は${type.traits.decision}で物事を判断`;
  const describeRelation = (type: PersonalityType) => `${type.name}は${type.traits.relationship}ポジション`;

  if (analysis.communicationStyle < 85) {
    const detail = `今回のコミュニケーションスコアは${analysis.communicationStyle}点。${analysis.communicationStyleDetail.description}${describeCommunication(type1)}と${describeCommunication(type2)}という組み合わせは、会話のペースが合わないことがある。`;
    const action =
      type1.traits.communication === type2.traits.communication && type1.traits.communication === "積極型"
        ? "2人とも話したいことが多いタイプなので、LINEで「今日話したいこと3つ」を先に送り合って、どれから話すか決めてから電話や会話を始めてみて。事前にネタを共有しておくと、会話が重ならずに済む。"
        : type1.traits.communication === type2.traits.communication && type1.traits.communication === "受容型"
        ? "2人とも聞き役になりがちなので、週1回「今日は私が話す日」と決めて、もう片方は相槌と質問だけに徹する時間を作ってみて。聞く側も「ここで笑ってほしい」ポイントを事前に伝えておくと、リアクションが合いやすい。"
        : "会話のテンポが違うので、LINEで「今話せる？」「5分だけ聞いてほしい」と先に伝えてから電話や会話を始めてみて。相手の準備ができてから話すと、聞いてもらえる安心感が違う。";
    pushTip(`${type1.name}×${type2.name}の会話テンポ調整`, `${detail}${action}`);
  }

  if (analysis.emotionalExpression < 85) {
    const romance =
      type1.romanceTendency && type2.romanceTendency
        ? `${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」。`
        : '';
    const action =
      type1.traits.decision === "論理型" && type2.traits.decision === "論理型"
        ? "2人とも感情を言葉にするのが苦手なタイプなので、LINEで「今日嬉しかったこと1つ」を毎晩送り合ってみて。短くてOK。続けると、どんな表現が相手に伝わりやすいかが分かってくる。"
        : type1.traits.decision === "感情型" && type2.traits.decision === "感情型"
        ? "2人とも感情豊かなタイプなので、週1回「今週の感情ベスト3」を送り合って、お互いがどんなことに喜びや不安を感じるか共有してみて。同じ出来事でも感じ方が違うことが分かると、理解が深まる。"
        : "感情表現の方法が違うので、週2回「今日の気持ち」を絵文字1つと短い文章で送り合ってみて。続けると、相手がどんな時にどんな気持ちになるかが分かって、リアクションが合いやすくなる。";
    pushTip('感情表現のすり合わせ', `${analysis.emotionalExpressionDetail.description}${romance}${action}`);
  }

  if (analysis.valuesAlignment < 80) {
    const action =
      type1.traits.decision === "論理型" && type2.traits.decision === "感情型"
        ? "判断基準が違うので、週1回「今週大事にしたこと1つ」を送り合って、なぜそれを大事にしたかも一言添えてみて。理由を聞くと、お互いの価値観が見えてくる。"
        : "価値観に違いがあるので、週1回「今週譲れなかったこと」と「今週妥協できたこと」を1つずつ送り合ってみて。何を優先するかが分かると、衝突する前に調整できる。";
    pushTip('価値観のすり合わせ', `${analysis.valuesAlignmentDetail.description}${action}`);
  }

  if (analysis.lifestyleRhythm < 75) {
    const rhythm =
      type1.dailyActions && type2.dailyActions
        ? `${type1.name}は「${type1.dailyActions}」、${type2.name}は「${type2.dailyActions}」。`
        : '';
    const action =
      "生活リズムが違うので、週の初めに「今週忙しい日」と「今週余裕がある日」を1つずつ送り合ってみて。お互いのスケジュールが見えると、連絡するタイミングや会うタイミングが分かりやすい。";
    pushTip('生活リズムの共有', `${analysis.lifestyleRhythmDetail.description}${rhythm}${action}`);
  }

  if (analysis.stressResponse < 80) {
    const action =
      type1.traits.communication === type2.traits.communication && type1.traits.communication === "積極型"
        ? "2人ともストレスを1人で抱えがちなので、疲れた時に「今疲れてる」と一言送るだけのルールを作ってみて。返事は「わかった、無理しないで」だけでOK。伝えるだけで楽になることがある。"
        : "ストレス対応の方法が違うので、疲れた時に「1人で過ごしたい」か「話を聞いてほしい」かを先に伝え合うルールを作ってみて。相手のニーズが分かると、適切なサポートができる。";
    pushTip('ストレスサインの共有', `${analysis.stressResponseDetail.description}${action}`);
  }

  if (analysis.loveExpression < 80) {
    const action =
      type1.traits.relationship === type2.traits.relationship && type1.traits.relationship === "リード型"
        ? "2人ともリード役になりがちなので、週1回「今週してもらって嬉しかったこと」を1つずつ送り合ってみて。どんな行動が愛情として伝わるかが分かると、自然とその行動が増える。"
        : type1.traits.relationship === type2.traits.relationship && type1.traits.relationship === "寄り添い型"
        ? "2人ともサポート役になりがちなので、週1回「今週してあげたこと」と「してもらって嬉しかったこと」を1つずつ送り合ってみて。お互いの愛情表現が見えてくる。"
        : "愛情表現の方法が違うので、週1回「今週してもらって嬉しかったこと」を1つずつ送り合ってみて。どんな行動が愛情として伝わるかが分かると、自然とその行動が増える。";
    pushTip('愛情表現のすり合わせ', `${analysis.loveExpressionDetail.description}${action}`);
  }

  if (type1.traits.decision !== type2.traits.decision) {
    const logicType = type1.traits.decision === "論理型" ? type1 : type2;
    const emotionType = type1.traits.decision === "感情型" ? type1 : type2;
    const action =
      `${logicType.name}は論理で判断、${emotionType.name}は感情で判断するタイプなので、意見が合わない時は「まず気持ちを聞いて、その後に理由を整理する」順番で話してみて。順番を変えるだけで、理解しやすくなる。`;
    pushTip('意思決定の順番調整', `${describeDecision(type1)}、${describeDecision(type2)}ため判断基準がズレやすい。${action}`);
  }

  if (type1.traits.relationship !== type2.traits.relationship) {
    const leadType = type1.traits.relationship === "リード型" ? type1 : type2;
    const supportType = type1.traits.relationship === "寄り添い型" ? type1 : type2;
    const action =
      `${leadType.name}はリード役、${supportType.name}はサポート役になりがちなので、週1回「今週は私が決めること」と「今週はあなたに決めてほしいこと」を1つずつ交換してみて。役割を意識すると、負担が偏らなくなる。`;
    pushTip('リード役のバランス調整', `${describeRelation(type1)}、${describeRelation(type2)}なので役割が偏りがち。${action}`);
  }

  if (!tips.length && analysis.strengths.length) {
    const cleanedStrength = analysis.strengths[0].replace(/（[^）]*）/g, '');
    pushTip('強みの定例化', `${cleanedStrength}という強みが出ているので、その状況を週1でわざと再現し、得意なリズムをキープした状態で課題に取り組める“ホームグラウンド”を作ろう。`);
  }

  if (!tips.length) {
    pushTip('ウィークリーチェックイン', '毎週15分、嬉しかったことと改善してほしいことを交互に1つずつ出し合い、すれ違いが溜まる前に微調整できる時間を確保しよう。');
  }

  return tips;
}

/**
 * 会話のきっかけを生成

/**
 * 会話のきっかけを生成
 */
type AxisKey =
  | "valuesAlignment"
  | "emotionalExpression"
  | "communicationStyle"
  | "stressResponse"
  | "lifestyleRhythm"
  | "loveExpression";

const axisQuestionTemplates: Record<
  AxisKey,
  {
    strength: (label: string, score: number, detail: string) => string;
    growth: (label: string, score: number, detail: string) => string;
  }
> = {
  valuesAlignment: {
    strength: (label, score, detail) => {
      const snippet = detail ? `${detail.replace(/[。．.]+$/, "")}って診断に書かれてたし、` : "";
      return `診断で「${label}${score}点」って出てたし、${snippet}今週の予定を決める前に一番大事にしたいことって何か言い合ってみない？`;
    },
    growth: (label, score) =>
      `「${label}${score}点」ってまだ伸びしろあるみたいだから、譲れないマイルールと「ここは合わせられるよ」ってポイントを1つずつ出してみない？`,
  },
  emotionalExpression: {
    strength: (label, score, detail) => {
      const snippet = detail ? `${detail.replace(/[。．.]+$/, "")}ってコメントもあったし、` : "";
      return `診断では「${label}${score}点」って褒められてたし、${snippet}最近テンション上がった出来事ってどう伝えたら一緒にもっと盛り上がれそう？`;
    },
    growth: (label, score) =>
      `「${label}${score}点」って結果だったから、嬉しいときとモヤっとしたとき、それぞれどんな合図やスタンプなら受け止めやすい？`,
  },
  communicationStyle: {
    strength: (label, score, detail) => {
      const snippet = detail ? `${detail.replace(/[。．.]+$/, "")}って書かれてたし、` : "";
      return `診断で「${label}${score}点」って出てたし、${snippet}今いちばんじっくり語りたいテーマって何？時間決めて話してみよ？`;
    },
    growth: (label, score) =>
      `「${label}${score}点」って少し課題ありみたいだから、どんなタイミングで会話が途切れがちか共有して、途中で割り込みOKの合図決めない？`,
  },
  stressResponse: {
    strength: (label, score, detail) => {
      const snippet = detail ? `${detail.replace(/[。．.]+$/, "")}って言われてたし、` : "";
      return `診断だと「${label}${score}点」ってサポート力が高いらしいし、${snippet}最近どんなケアをしてもらえたら助かった？同じやり方もう一回やってみない？`;
    },
    growth: (label, score) =>
      `「${label}${score}点」ってまだ上げられそうだから、私が疲れてるときのサインってどんなふうに見えてる？気づいたらどう接してほしい？`,
  },
  lifestyleRhythm: {
    strength: (label, score, detail) => {
      const snippet = detail ? `${detail.replace(/[。．.]+$/, "")}って診断にあったし、` : "";
      return `診断では「${label}${score}点」って安定してるらしいし、${snippet}土日や夜の空いた時間、どの枠を「ふたり時間」にするかゆるっと決めてみる？`;
    },
    growth: (label, score) =>
      `「${label}${score}点」って今は様子見らしいから、平日どの時間なら一番連絡返しやすいかスケジュール共有してみない？`,
  },
  loveExpression: {
    strength: (label, score, detail) => {
      const snippet = detail ? `${detail.replace(/[。．.]+$/, "")}って褒められてたし、` : "";
      return `診断で「${label}${score}点」って出てたし、${snippet}最近もらって刺さった愛情表現、次はどうアップデートしてみたい？`;
    },
    growth: (label, score) =>
      `「${label}${score}点」って結果だったから、どんなリアクションが返ってくると「ちゃんと伝わった」って安心できる？具体例教えて？`,
  },
};

function generateConversationStarters(
  type1: PersonalityType,
  type2: PersonalityType,
  analysis: DetailedCompatibilityAnalysis
): string[] {
  const starters: string[] = [];
  const romanceQuestion =
    type1.romanceTendency && type2.romanceTendency
      ? `診断で${type1.name}は「${type1.romanceTendency}」、${type2.name}は「${type2.romanceTendency}」って出てたし、お互いどんな甘え方や声かけがいちばん嬉しいか今日決めてみない？`
      : `診断結果を見ながら、お互いにされて嬉しい甘やかし方を具体的に3つ出し合ってみない？`;
  starters.push(romanceQuestion);

  const dailyQuestion =
    type1.dailyActions && type2.dailyActions
      ? `日常モードでは${type1.name}が「${type1.dailyActions}」、${type2.name}が「${type2.dailyActions}」って書かれてたし、今週どの時間帯なら一緒に動けそうかざっくり合わせてみようよ？`
      : "今週の生活リズムをざっくり共有して、連絡しやすい時間と完全オフの時間を先に宣言し合わない？";
  starters.push(dailyQuestion);

  const axisInfo: { key: AxisKey; label: string; score: number; detail: string }[] = [
    { key: "valuesAlignment", label: "価値観シンクロ度", score: analysis.valuesAlignment, detail: analysis.valuesAlignmentDetail.description },
    { key: "emotionalExpression", label: "感情共有モード", score: analysis.emotionalExpression, detail: analysis.emotionalExpressionDetail.description },
    { key: "communicationStyle", label: "会話テンポ", score: analysis.communicationStyle, detail: analysis.communicationStyleDetail.description },
    { key: "stressResponse", label: "ストレス察知力", score: analysis.stressResponse, detail: analysis.stressResponseDetail.description },
    { key: "lifestyleRhythm", label: "生活リズムシンクロ", score: analysis.lifestyleRhythm, detail: analysis.lifestyleRhythmDetail.description },
    { key: "loveExpression", label: "愛情表現バランス", score: analysis.loveExpression, detail: analysis.loveExpressionDetail.description },
  ];

  const sortedAxes = [...axisInfo].sort((a, b) => b.score - a.score);
  const topAxis = sortedAxes[0];
  let growthAxis = sortedAxes.find((axis, index) => index > 0 && axis.key !== topAxis?.key);
  if (!growthAxis) {
    growthAxis = sortedAxes[sortedAxes.length - 1];
  }

  const toDisplayScore = (value?: number) => (typeof value === "number" ? Math.round(value) : 0);

  if (topAxis) {
    const template = axisQuestionTemplates[topAxis.key];
    starters.push(template.strength(topAxis.label, toDisplayScore(topAxis.score), topAxis.detail));
  }

  if (growthAxis) {
    const template = axisQuestionTemplates[growthAxis.key];
    starters.push(template.growth(growthAxis.label, toDisplayScore(growthAxis.score), growthAxis.detail));
  }

  return starters;
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
    conversationStarters: [],
    futureMessage: ""
  };
  
  const percentileRank = calculatePercentileRank(totalScore);
  analysis.strengths = extractStrengths(type1, type2, analysis, totalScore, percentileRank);
  analysis.challenges = generateChallenges(type1, type2, analysis);
  analysis.improvementTips = generateImprovementTips(type1, type2, analysis);
  analysis.conversationStarters = generateConversationStarters(type1, type2, analysis);
  analysis.futureMessage = generateFutureMessage(type1, type2, totalScore);
  
  return analysis;
}
