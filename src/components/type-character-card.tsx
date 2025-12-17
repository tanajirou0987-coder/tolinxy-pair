"use client";

import { motion } from "framer-motion";
import { TypeProfile } from "@/lib/type-profiles";

type Trait = TypeProfile["traits"]["communication"];

const communicationPalettes: Record<
  TypeProfile["traits"]["communication"],
  { head: string; shadow: string; brow: string }
> = {
  積極型: { head: "#cbf4eb", shadow: "#86d4c4", brow: "#1ca18d" },
  バランス型: { head: "#d3f6ec", shadow: "#9cddcf", brow: "#2aa090" },
  受容型: { head: "#d0f3ea", shadow: "#c5eee4", brow: "#1b9184" },
};

const decisionAccents: Record<
  TypeProfile["traits"]["decision"],
  { accessory: "glasses" | "spark" | "blush"; color: string }
> = {
  論理型: { accessory: "glasses", color: "#1f5a6c" },
  感情型: { accessory: "blush", color: "#8fd9c9" },
  ハイブリッド型: { accessory: "spark", color: "#2ab89f" },
};

const relationshipTokens: Record<
  TypeProfile["traits"]["relationship"],
  { color: string; label: string }
> = {
  リード型: { color: "#bfa893", label: "lead" },
  対等型: { color: "#a7bbb2", label: "equal" },
  寄り添い型: { color: "#d9c6b6", label: "care" },
};

const mouthByCommunication: Record<Trait, { width: number; tilt: string }> = {
  積極型: { width: 26, tilt: "-rotate-1" },
  バランス型: { width: 20, tilt: "" },
  受容型: { width: 16, tilt: "rotate-1" },
};

const eyeOffsets: Record<Trait, number> = {
  積極型: 14,
  バランス型: 16,
  受容型: 18,
};

function CharacterAvatar({ profile }: { profile: TypeProfile }) {
  const palette = communicationPalettes[profile.traits.communication];
  const decision = decisionAccents[profile.traits.decision];
  const token = relationshipTokens[profile.traits.relationship];
  const mouth = mouthByCommunication[profile.traits.communication];
  const eyeOffset = eyeOffsets[profile.traits.communication];

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-[30px] border border-[#ebe3d9] bg-[#fefcf8]/90">
      <div
        className="absolute left-1/2 top-6 h-4 w-16 -translate-x-1/2 rounded-full opacity-40 blur-md"
        style={{ background: palette.shadow }}
      />
      <div
        className="absolute left-1/2 top-4 h-28 w-28 -translate-x-1/2 rounded-[36px] border border-white/70 shadow-inner"
        style={{ background: palette.head }}
      />
      <div className="absolute left-1/2 top-[78px] flex h-6 w-16 -translate-x-1/2 items-center justify-between">
        {["left", "right"].map((side, idx) => (
          <span
            key={side}
            className="block h-3 w-3 rounded-full"
            style={{
              background: palette.brow,
              transform: `translateX(${idx === 0 ? -eyeOffset : eyeOffset}px)`,
            }}
          />
        ))}
      </div>
      {/* eyes */}
      <span
        className="absolute top-[90px] block h-2 w-2 rounded-full"
        style={{
          background: "#1c5a51",
          left: `calc(50% - ${eyeOffset}px)`,
        }}
      />
      <span
        className="absolute top-[90px] block h-2 w-2 rounded-full"
        style={{
          background: "#1c5a51",
          left: `calc(50% + ${eyeOffset - 2}px)`,
        }}
      />
      {/* mouth */}
      <span
        className={`absolute top-[110px] left-1/2 block h-1 -translate-x-1/2 rounded-full bg-[#1ca18d] ${mouth.tilt}`}
        style={{ width: mouth.width }}
      />
      {/* cheeks */}
      <span
        className="absolute top-[100px] block h-3 w-5 rounded-full opacity-70"
        style={{
          background: "#aee8dc",
          left: `calc(50% - ${eyeOffset + 14}px)`,
        }}
      />
      <span
        className="absolute top-[100px] block h-3 w-5 rounded-full opacity-70"
        style={{
          background: "#aee8dc",
          left: `calc(50% + ${eyeOffset + 6}px)`,
        }}
      />
      {/* decision accessory */}
      {decision.accessory === "glasses" && (
        <div
          className="absolute top-[84px] left-1/2 flex -translate-x-1/2 items-center gap-2"
          style={{ color: decision.color }}
        >
          {[0, 1].map((idx) => (
            <span
              key={idx}
              className="block h-5 w-6 rounded-full border"
              style={{ borderColor: decision.color }}
            />
          ))}
          <span
            className="absolute left-1/2 top-1/2 block h-[2px] w-7 -translate-x-1/2"
            style={{ background: decision.color }}
          />
        </div>
      )}
      {decision.accessory === "spark" && (
        <span
          className="absolute left-1/2 top-6 block h-8 w-8 -translate-x-1/2 rotate-12 rounded-full opacity-80"
          style={{
            background: decision.color,
            clipPath: "polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)",
          }}
        />
      )}
      {decision.accessory === "blush" && (
        <>
          <span
            className="absolute top-[108px] block h-3 w-7 rounded-full opacity-60"
            style={{
              background: decision.color,
              left: `calc(50% - ${eyeOffset + 10}px)`,
            }}
          />
          <span
            className="absolute top-[108px] block h-3 w-7 rounded-full opacity-60"
            style={{
              background: decision.color,
              left: `calc(50% + ${eyeOffset - 4}px)`,
            }}
          />
        </>
      )}
      {/* relationship token */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-white"
        style={{ background: token.color }}
      >
        {token.label}
      </div>
    </div>
  );
}

interface TypeCharacterCardProps {
  profile: TypeProfile;
}

export function TypeCharacterCard({ profile }: TypeCharacterCardProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 rounded-[32px] border border-[#c8f0e7] bg-white/90 p-5 shadow-[0_12px_40px_rgba(16,90,78,0.12)]"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <CharacterAvatar profile={profile} />
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#7bc8ba]">type</p>
        <h3 className="mt-1 font-semibold text-[#2b1f2f]">{profile.name}</h3>
        <p className="text-sm text-[#346d63]">{profile.catch}</p>
      </div>
      <p className="text-xs text-[#4c9185]">{profile.description}</p>
      <div className="rounded-2xl bg-[#fefcf8] p-3 text-xs text-[#5f5b56]">
        <p className="font-semibold text-[#7a9a8d]">恋愛モード</p>
        <p>{profile.romanceTendency}</p>
      </div>
    </motion.div>
  );
}
