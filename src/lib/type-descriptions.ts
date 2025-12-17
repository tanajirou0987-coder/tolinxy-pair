import type { Traits } from "./types";

export const communicationSummaries: Record<Traits["communication"], string> = {
  積極型:
    "まずあなたはテンション高めに話題を投げて、沈黙を作らないムードメーカータイプ",
  受容型:
    "あなたは相手の様子をよく観察してペースを合わせる受けとめ上手で、相手が安心して話せる空気をつくれる",
  バランス型:
    'あなたは空気を読みながら盛り上げも聞き役も切り替える"ゆるリズム"の潤滑油で、誰といても程よい距離感をキープできる',
};

export const decisionSummaries: Record<Traits["decision"], string> = {
  論理型:
    "決断するときはデータや経験をサッと整理して合理的な道筋を立てる、頼れるプランナー気質",
  感情型:
    "直感とその場のフィーリングを大事にするので、心が動いた方向へ軽やかに踏み出せる勢いが魅力",
  ハイブリッド型:
    '状況に合わせて頭と心を素早く切り替える柔軟派で、周囲から "相談しやすい" と頼られやすい',
};

export const relationshipSummaries: Record<Traits["relationship"], string> = {
  リード型:
    '恋愛では "やりたいこと" をポジティブに提案して自分が舵を取り、みんなを前に進める役がハマる',
  寄り添い型:
    '相手が心地いいかを最優先で考え、"どうしたい？" を丁寧に聞きながら支えるケア視点を持っている',
  対等型:
    "なんでも一緒に決めて楽しむのが好きで、フェアな役割分担や共同作業を自然と生み出せる",
};

export function buildTypeDescription(traits: Traits): string {
  const parts = [
    communicationSummaries[traits.communication],
    decisionSummaries[traits.decision],
    relationshipSummaries[traits.relationship],
  ];
  return parts.join("。") + "。";
}
