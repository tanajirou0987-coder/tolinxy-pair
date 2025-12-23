"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';

interface ShareButtonProps {
  shareUrl: string;
  darkTheme?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ shareUrl, darkTheme = false }) => {
  const [buttonText, setButtonText] = useState('結果URLをコピー');

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setButtonText('コピーしました！');
      setTimeout(() => setButtonText('結果URLをコピー'), 2000);
    } else {
      alert('コピーに失敗しました。');
    }
  };

  const baseClasses = "rounded-[16px] px-6 py-3 text-sm md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal transition shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]";
  const darkThemeClasses = "border border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20";
  const lightThemeClasses = "border border-black bg-white text-black hover:bg-gray-100";

  return (
    <Button 
      onClick={handleCopy} 
      className={`${baseClasses} ${darkTheme ? darkThemeClasses : lightThemeClasses}`}
      variant={darkTheme ? "outline" : "default"}
    >
      {buttonText}
    </Button>
  );
};




