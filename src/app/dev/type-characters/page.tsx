import { typeProfiles } from "@/lib/type-profiles";
import { TypeCharacterCard } from "@/components/type-character-card";

export default function TypeCharactersShowcase() {
  return (
    <div className="pairly-legacy mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[#7bc8ba]">Character Lab</p>
        <h1 className="serif-heading mt-2 text-3xl font-semibold text-[#2f2722]">タイプ別キャラクター図鑑</h1>
        <p className="mt-2 text-sm text-[#346d63]">
          data/diagnoses/compatibility-54/types.json にある27タイプの性格プロファイルをもとに、Pairly Labの紙っぽいトーンで
          生成されるマスコットを一覧できるページです。
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {typeProfiles.map((profile) => (
          <TypeCharacterCard key={profile.type} profile={profile} />
        ))}
      </div>
    </div>
  );
}
