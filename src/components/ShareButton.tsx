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

  const baseClasses = "rounded-full px-8 py-3 text-base font-semibold transition";
  const darkThemeClasses = "border border-white/20 text-white hover:border-primary hover:text-primary";
  const lightThemeClasses = "bg-indigo-600 text-white hover:bg-indigo-700";

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




