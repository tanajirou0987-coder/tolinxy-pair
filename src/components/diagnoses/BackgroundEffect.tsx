import { memo } from "react";

export const BackgroundEffect = memo(function BackgroundEffect() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1a0033] to-[#000033]" />
      <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#ff006e] opacity-10 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#00f5ff] opacity-10 blur-[100px]" />
    </div>
  );
});

