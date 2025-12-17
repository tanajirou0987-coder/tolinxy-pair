/**
 * type-profiles.jsonの内容をtypes.jsonに統合するスクリプト
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// タイプコードのマッピング
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

// データを読み込む
const profilesPath = join(process.cwd(), "data/diagnoses/type-profiles.json");
const types18Path = join(process.cwd(), "data/diagnoses/compatibility-18/types.json");
const types54Path = join(process.cwd(), "data/diagnoses/compatibility-54/types.json");

const profiles = JSON.parse(readFileSync(profilesPath, "utf-8"));
const types18 = JSON.parse(readFileSync(types18Path, "utf-8"));
const types54 = JSON.parse(readFileSync(types54Path, "utf-8"));

// 各プロファイルをtypes.jsonに統合
interface ProfileData {
  personality?: string;
  romanceTendency?: string;
  dailyActions?: string;
  innerMotivation?: string;
  futureVision?: string;
}

for (const [code, profileData] of Object.entries(profiles)) {
  const typeCode = convertTypeCode(code);
  const profile = profileData as ProfileData;
  
  if (types18[typeCode]) {
    types18[typeCode] = {
      ...types18[typeCode],
      personality: profile.personality,
      romanceTendency: profile.romanceTendency,
      dailyActions: profile.dailyActions,
      innerMotivation: profile.innerMotivation,
      futureVision: profile.futureVision,
    };
  }
  
  if (types54[typeCode]) {
    types54[typeCode] = {
      ...types54[typeCode],
      personality: profile.personality,
      romanceTendency: profile.romanceTendency,
      dailyActions: profile.dailyActions,
      innerMotivation: profile.innerMotivation,
      futureVision: profile.futureVision,
    };
  }
}

// ファイルに保存
writeFileSync(types18Path, JSON.stringify(types18, null, 2), "utf-8");
writeFileSync(types54Path, JSON.stringify(types54, null, 2), "utf-8");

console.log(`✅ 27タイプの詳細プロファイルを統合しました`);
console.log(`   - ${types18Path}`);
console.log(`   - ${types54Path}`);



