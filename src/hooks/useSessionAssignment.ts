import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UseSessionAssignmentOptions {
  sessionId: string | null;
  participant: string | null;
  enabled?: boolean;
}

export function useSessionAssignment({
  sessionId,
  participant,
  enabled = true,
}: UseSessionAssignmentOptions) {
  const router = useRouter();
  const [isAssigning, setIsAssigning] = useState(false);
  const isValidParticipant = participant === "user" || participant === "partner";

  useEffect(() => {
    if (!enabled || !sessionId || isValidParticipant) return;

    setIsAssigning(true);
    const assignRole = async () => {
      try {
        // セッション作成者の場合は自動で「user」ロールを割り当て
        if (typeof window !== "undefined") {
          const isCreator = localStorage.getItem(`session_creator_${sessionId}`) === "true";
          if (isCreator) {
            router.replace(
              `/diagnoses/compatibility-54/questions?sessionId=${sessionId}&role=user`
            );
            setIsAssigning(false);
            return;
          }
        }

        // セッション作成者でない場合は、APIで自動割り当て
        const response = await fetch(`/api/sessions/${sessionId}/assign-role`, {
          method: "POST",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "役割の割り当てに失敗しました");
        }

        const data = await response.json();

        if (data.role) {
          router.replace(
            `/diagnoses/compatibility-54/questions?sessionId=${sessionId}&role=${data.role}`
          );
        } else {
          router.replace(`/diagnoses/compatibility-54/multi?error=full`);
        }
      } catch (err) {
        console.error("[useSessionAssignment] 役割割り当てエラー:", err);
        router.replace(`/diagnoses/compatibility-54/multi?error=assign`);
      } finally {
        setIsAssigning(false);
      }
    };

    assignRole();
  }, [sessionId, isValidParticipant, router, enabled]);

  return { isAssigning, isValidParticipant };
}





