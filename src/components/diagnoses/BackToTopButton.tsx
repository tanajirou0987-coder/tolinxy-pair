import { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackToTopButtonProps {
  variant?: "mobile" | "desktop";
}

export const BackToTopButton = memo(function BackToTopButton({
  variant = "mobile",
}: BackToTopButtonProps) {
  const router = useRouter();
  const isMobile = variant === "mobile";

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end ${isMobile ? "px-6 pt-6" : "px-8 pt-8"}`}>
      <Button
        type="button"
        onClick={() => router.push("/")}
        className={`pointer-events-auto rounded-[16px] border border-black bg-white font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-gray-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${isMobile ? "px-5 py-2 text-sm" : "px-6 py-3 text-base"}`}
      >
        トップに戻る
      </Button>
    </div>
  );
});


