/**
 * 27タイプに名前を当てはめるスクリプト
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { buildTypeDescription } from "../src/lib/type-descriptions";
import type { Traits } from "../src/lib/types";

// 27タイプの名前データ
const typeNames: Record<
  string,
  {
    typeName: string;
    icon: string;
    catch: string;
  }
> = {
  "AAA": {
    "typeName": "はちゃめちゃキャプテン",
    "icon": "🎹",
    "catch": "突き進む知性派",
  },
  "AAB": {
    "typeName": "お調子マイスター",
    "icon": "🎼",
    "catch": "調整力のリーダー",
  },
  "AAC": {
    "typeName": "世話焼きフォアマン",
    "icon": "🎸",
    "catch": "熱血の共感ファイター",
  },
  "ABA": {
    "typeName": "情熱カーニバル",
    "icon": "🥁",
    "catch": "高速実行派",
  },
  "ABB": {
    "typeName": "アイデアシャワーくん",
    "icon": "🎺",
    "catch": "発想共有名人",
  },
  "ABC": {
    "typeName": "ほのぼのサポーター",
    "icon": "🎷",
    "catch": "居心地の魔術師",
  },
  "ACA": {
    "typeName": "わが道モンスター",
    "icon": "🪕",
    "catch": "熱中発想型",
  },
  "ACB": {
    "typeName": "ゆるっとオーロラ",
    "icon": "🎶",
    "catch": "感情を伝える共振型",
  },
  "ACC": {
    "typeName": "ふわとろスチーム",
    "icon": "🎤",
    "catch": "愛されリーダー",
  },
  "BAA": {
    "typeName": "しっかりインストラクター",
    "icon": "🎧",
    "catch": "仲間想いの知性派",
  },
  "BAB": {
    "typeName": "平和まもりびと",
    "icon": "🎻",
    "catch": "万能カウンセラー",
  },
  "BAC": {
    "typeName": "やさしみチャージャー",
    "icon": "🪈",
    "catch": "共感＋理性の調停者",
  },
  "BBA": {
    "typeName": "ゆるペースナビゲーター",
    "icon": "🪄",
    "catch": "気配り推進派",
  },
  "BBB": {
    "typeName": "どっちつかずフェロー",
    "icon": "☁️",
    "catch": "心地よい調和の達人",
  },
  "BBC": {
    "typeName": "おっとりデイリスト",
    "icon": "🎺",
    "catch": "平和ファシリテーター",
  },
  "BCA": {
    "typeName": "なみだ腺クラフター",
    "icon": "🎻",
    "catch": "気分屋の起爆剤",
  },
  "BCB": {
    "typeName": "波長あわせスケッチャー",
    "icon": "🔔",
    "catch": "柔軟発想サポーター",
  },
  "BCC": {
    "typeName": "ほわほわストックマン",
    "icon": "🎤",
    "catch": "癒しの調整役",
  },
  "CAA": {
    "typeName": "しずかなガーデナー",
    "icon": "🧠",
    "catch": "じっくり論理協力型",
  },
  "CAB": {
    "typeName": "おだやかトーンメーカー",
    "icon": "📯",
    "catch": "控えめな調整屋",
  },
  "CAC": {
    "typeName": "ヒーリングウォーカー",
    "icon": "🎻",
    "catch": "穏やか癒しリーダー",
  },
  "CBA": {
    "typeName": "まったりランタン職人",
    "icon": "🎵",
    "catch": "慎重な調整役",
  },
  "CBB": {
    "typeName": "上品モデレーターさん",
    "icon": "🌿",
    "catch": "無垢な優しさの象徴",
  },
  "CBC": {
    "typeName": "ぽわぽわスロースター",
    "icon": "🌙",
    "catch": "癒し専門案内人",
  },
  "CCA": {
    "typeName": "エモーションクリエイター",
    "icon": "🥁",
    "catch": "控えめ新星リーダー",
  },
  "CCB": {
    "typeName": "ほんわかハグドロップ",
    "icon": "🌌",
    "catch": "不思議包容力",
  },
  "CCC": {
    "typeName": "やさしみフェアリー",
    "icon": "🛏️",
    "catch": "究極の静寂ナビゲーター",
  }
};

// タイプコードのマッピング
// A = 積極型, B = バランス型, C = 受容型 (コミュニケーション)
// A = 論理型, B = ハイブリッド型, C = 感情型 (意思決定)
// A = リード型, B = 対等型, C = 寄り添い型 (関係性)
function convertTypeCode(code: string): string {
  const [comm, dec, rel] = code.split("");
  
  const commMap: Record<string, string> = {
    "A": "積極型",
    "B": "バランス型",
    "C": "受容型"
  };
  
  const decMap: Record<string, string> = {
    "A": "論理型",
    "B": "ハイブリッド型",
    "C": "感情型"
  };
  
  const relMap: Record<string, string> = {
    "A": "リード型",
    "B": "対等型",
    "C": "寄り添い型"
  };
  
  return `${commMap[comm]}_${decMap[dec]}_${relMap[rel]}`;
}

function extractTraits(typeCode: string): Traits {
  const [communication, decision, relationship] = typeCode.split("_");
  return {
    communication: communication as Traits["communication"],
    decision: decision as Traits["decision"],
    relationship: relationship as Traits["relationship"],
  };
}

// 既存のtypes.jsonを読み込む
const types18Path = join(process.cwd(), "data/diagnoses/compatibility-18/types.json");
const types54Path = join(process.cwd(), "data/diagnoses/compatibility-54/types.json");

const types18 = JSON.parse(readFileSync(types18Path, "utf-8"));
const types54 = JSON.parse(readFileSync(types54Path, "utf-8"));

// 各タイプコードに名前を当てはめる
for (const [code, nameData] of Object.entries(typeNames)) {
  const typeCode = convertTypeCode(code);
  const traits = extractTraits(typeCode);
  const description = buildTypeDescription(traits);
  
  if (types18[typeCode]) {
    types18[typeCode] = {
      ...types18[typeCode],
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description,
      catch: nameData.catch,
      traits,
    };
  } else {
    types18[typeCode] = {
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description,
      catch: nameData.catch,
      traits,
    };
  }
  
  // 54問用も同じデータで更新
  if (types54[typeCode]) {
    types54[typeCode] = {
      ...types54[typeCode],
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description,
      catch: nameData.catch,
      traits,
    };
  } else {
    types54[typeCode] = {
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description,
      catch: nameData.catch,
      traits,
    };
  }
}

// ファイルに保存
writeFileSync(types18Path, JSON.stringify(types18, null, 2), "utf-8");
writeFileSync(types54Path, JSON.stringify(types54, null, 2), "utf-8");

console.log(`✅ 27タイプの名前を更新しました`);
console.log(`   - ${types18Path}`);
console.log(`   - ${types54Path}`);
console.log(`   総タイプ数: ${Object.keys(types18).length}`);
