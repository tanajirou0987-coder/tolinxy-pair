"use client";

/**
 * Copies the provided text to the clipboard.
 * Uses the modern Clipboard API when possible and falls back to a hidden textarea.
 * Returns true on success so callers can show a success UI, otherwise false.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // モダンブラウザでの標準API
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("[clipboard] navigator.clipboard.writeText failed", err);
  }

  // フォールバック: execCommand を使ったコピー
  if (typeof document !== "undefined") {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    textArea.style.left = "-1000px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      return successful;
    } catch (err) {
      console.warn("[clipboard] document.execCommand('copy') failed", err);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  return false;
}
