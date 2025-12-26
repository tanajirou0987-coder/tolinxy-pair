"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonalityType, Compatibility } from '@/lib/types';
import { CompatibilityRank, getRankImagePath } from '@/lib/calculate';
import type { DetailedCompatibilityAnalysis } from '@/lib/compatibility-analysis';
import { ShareButton } from './ShareButton';
import SharePreview from './SharePreview';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { getCharacterImagePath } from '@/lib/character-image-mapping';

interface DiagnosisResultProps {
  type1: PersonalityType;
  type2?: PersonalityType;
  compatibility?: Compatibility;
  rank?: CompatibilityRank;
  analysis?: DetailedCompatibilityAnalysis;
  percentile?: number;
  shareUrl: string;
  diagnosisType?: "18" | "54"; // 診断タイプ（18問 or 54問）
}

const AnimatedCircularProgress: React.FC<{ score: number }> = ({ score }) => {
  const [progress, setProgress] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setProgress(score);
    });
    return () => cancelAnimationFrame(animation);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90" width="200" height="200" viewBox="0 0 200 200">
        <circle className="text-gray-200" strokeWidth="16" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" />
        <circle
          className="text-transparent"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="#FFB6C1"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{score}</span>
        <span className="text-xs md:text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 uppercase tracking-wider text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">pts</span>
      </div>
    </div>
  );
};

const TypeProfile: React.FC<{ type: PersonalityType, isUser?: boolean, showCharacterImage?: boolean }> = ({ type, isUser, showCharacterImage = false }) => {
  const characterImagePath = showCharacterImage ? getCharacterImagePath({ 
    userTypeCode: type.type,
    preferTypeIndividual: true 
  }) : null;

  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] text-black/60 mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          {isUser ? "あなた" : "パートナー"}
      </div>
      {showCharacterImage && characterImagePath ? (
        <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-[16px] overflow-hidden border-2 border-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={characterImagePath}
            alt={type.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // 画像が見つからない場合はアイコンを表示
              e.currentTarget.style.display = 'none';
            }}
          />
          {type.icon && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#FFB6C1] text-4xl md:text-5xl">
              {type.icon}
            </div>
          )}
        </div>
      ) : type.icon ? (
        <div className="flex items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full border-2 border-black bg-[#FFB6C1] text-4xl md:text-5xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          {type.icon}
        </div>
      ) : null}
      <div className="text-center">
          <h3 className="text-xl md:text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.name}</h3>
      </div>
      <p className="text-sm md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 w-full px-4 text-center leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.description}</p>
      <div className="flex flex-wrap gap-2 justify-center pt-2">
          <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#FFB6C1] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.traits.communication}</span>
          <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#87CEEB] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.traits.decision}</span>
          <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#FFF8DC] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.traits.relationship}</span>
      </div>
    </div>
  );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode, initialOpen?: boolean }> = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="border-b-2 border-black/20 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h3 className="text-lg md:text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{title}</h3>
        <ChevronDown className={`transform transition-transform duration-300 text-black/60 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="text-black/90 font-['Coming_Soon:Regular',sans-serif] font-normal">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AxisInsight: React.FC<{ label: string; value: number; description: string }> = ({ label, value, description }) => (
    <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm">
            <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{label}</span>
            <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{value}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-4 border border-black overflow-hidden">
            <div className="bg-[#FFB6C1] h-full rounded-full transition-all duration-1000" style={{ width: `${value}%` }}></div>
        </div>
        <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black/70 mt-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{description}</p>
    </div>
);

// ランク画像コンポーネント（エラーハンドリング付き、正方形にクロップ）
const RankImage: React.FC<{ rank: CompatibilityRank }> = ({ rank }) => {
  const imagePath = getRankImagePath(rank.rank);

  // 画像を正方形にクロップ（横の長さを維持し、上を少し切り取って下を伸ばす）
  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt={rank.tier}
        className="w-full h-full object-cover"
        style={{
          objectPosition: "center bottom", // 下を基準に配置
          width: "100%",
          height: "auto",
          minHeight: "100%",
          transform: "translateY(-10%)", // 上を10%切り取る
        }}
        onError={(e) => {
          console.error("画像の読み込みエラー:", imagePath);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

// 画像共有ボタンコンポーネント
const ShareImageButton: React.FC<{
  score: number;
  percentile: number;
  userNickname: string;
  partnerNickname: string;
  message: string;
  userTypeCode: string;
  partnerTypeCode: string;
}> = ({ score, percentile, userNickname, partnerNickname, message, userTypeCode, partnerTypeCode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-[28px] sm:rounded-[32px] border border-white/70 bg-white/95 backdrop-blur-md px-6 py-3 text-sm md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-white shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_8px_24px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.9)] text-shadow-[0px_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0px_20px_60px_rgba(0,0,0,0.16),0px_10px_30px_rgba(0,0,0,0.12),inset_0px_1px_0px_rgba(255,255,255,1)] transform hover:scale-105 hover:-translate-y-1"
      >
        画像をダウンロード
      </button>
      <SharePreview
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        score={score}
        percentile={percentile}
        userNickname={userNickname}
        partnerNickname={partnerNickname}
        message={message}
        userTypeCode={userTypeCode}
        partnerTypeCode={partnerTypeCode}
      />
    </>
  );
};

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  type1,
  type2,
  compatibility,
  rank,
  analysis,
  percentile,
  shareUrl,
  diagnosisType = "54",
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!type2 || !compatibility) {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center p-4 min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* スマホ用レイアウト */}
            <div className="w-full max-w-md rounded-[32px] sm:rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-8 text-center shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)] md:hidden">
                <h1 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたのタイプ</h1>
                <TypeProfile type={type1} isUser={true} />
                <div className="mt-8">
                    <ShareButton shareUrl={shareUrl} darkTheme={false} />
                </div>
            </div>
            {/* PC用レイアウト */}
            <div className="hidden md:block w-full max-w-2xl rounded-[48px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-12 text-center shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]">
                <h1 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたのタイプ</h1>
                <TypeProfile type={type1} isUser={true} />
                <div className="mt-10">
                    <ShareButton shareUrl={shareUrl} darkTheme={false} />
                </div>
            </div>
        </motion.div>
    );
  }
  
  const analysisItems = analysis ? [
    { label: "価値観", value: analysis.valuesAlignment, description: analysis.valuesAlignmentDetail.description },
    { label: "感情表現", value: analysis.emotionalExpression, description: analysis.emotionalExpressionDetail.description },
    { label: "会話", value: analysis.communicationStyle, description: analysis.communicationStyleDetail.description },
    { label: "ストレス反応", value: analysis.stressResponse, description: analysis.stressResponseDetail.description },
    { label: "生活リズム", value: analysis.lifestyleRhythm, description: analysis.lifestyleRhythmDetail.description },
    { label: "愛情表現", value: analysis.loveExpression, description: analysis.loveExpressionDetail.description },
  ] : [];


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 装飾的なハートアイコン（背景に散りばめる） */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const positions = [
            { top: "10%", left: "5%", size: "w-8 h-8", opacity: "opacity-20" },
            { top: "15%", right: "8%", size: "w-6 h-6", opacity: "opacity-15" },
            { top: "25%", left: "12%", size: "w-10 h-10", opacity: "opacity-25" },
            { top: "30%", right: "15%", size: "w-7 h-7", opacity: "opacity-18" },
            { top: "45%", left: "3%", size: "w-9 h-9", opacity: "opacity-22" },
            { top: "50%", right: "5%", size: "w-5 h-5", opacity: "opacity-15" },
            { top: "65%", left: "8%", size: "w-8 h-8", opacity: "opacity-20" },
            { top: "70%", right: "12%", size: "w-6 h-6", opacity: "opacity-18" },
            { top: "80%", left: "15%", size: "w-7 h-7", opacity: "opacity-20" },
            { top: "85%", right: "8%", size: "w-9 h-9", opacity: "opacity-22" },
            { top: "20%", left: "50%", size: "w-5 h-5", opacity: "opacity-15" },
            { top: "60%", right: "50%", size: "w-8 h-8", opacity: "opacity-20" },
          ];
          const pos = positions[i] || positions[0];
          return (
            <motion.div
              key={i}
              className={`absolute ${pos.size} ${pos.opacity}`}
              style={{
                top: pos.top,
                left: pos.left || undefined,
                right: pos.right || undefined,
              }}
              initial={{ 
                opacity: 0,
                scale: 0,
                rotate: -180
              }}
              animate={{ 
                opacity: [0.15, 0.25, 0.15],
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            >
              <img 
                src="/72f91e3276d006e7d8906111a5588ff06189af12.png" 
                alt="" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // 画像が見つからない場合は非表示
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 18問診断用レイアウト（スマホ） */}
      {diagnosisType === "18" ? (
        <div className="flex flex-col gap-5 sm:gap-6 px-3 sm:px-4 py-6 sm:py-8 pb-16 sm:pb-20 relative z-10 md:hidden">
          <motion.header 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
              <p className="text-[10px] sm:text-xs font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] sm:tracking-[0.5em] text-black/60 mb-1.5 sm:mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断結果</p>
              <h1 className="text-4xl sm:text-5xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                PAIRLY LAB
              </h1>
          </motion.header>

          <main className="grid grid-cols-1 gap-4 sm:gap-5">
            {/* サマリーセクション */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60 mb-3 sm:mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">サマリー</h3>
                {compatibility && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性スコア</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.total}点</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性ランク</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.rank}</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ランク帯</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.bandName}</span>
                    </div>
                )}
                {percentile !== undefined && (
                    <div className="flex justify-between items-baseline py-3">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">上位</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </motion.div>

            {/* カップルの説明 */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-1.5 sm:mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.message}</h2>
                  <p className="text-xs sm:text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-xl mx-auto mt-1.5 sm:mt-2 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.detail}</p>
                </div>
              </div>
            </motion.div>

            {/* 区切り */}
            <div className="border-t-2 border-black/20 my-3 sm:my-4"></div>

            {/* タイププロフィール */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60 mb-4 sm:mb-6 text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたたちのタイプ</h3>
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <TypeProfile type={type1} isUser={true} showCharacterImage={true} />
                <div className="border-t-2 border-black/20"></div>
                <TypeProfile type={type2} isUser={false} showCharacterImage={true} />
              </div>
            </motion.div>

            {/* 結果を共有 */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-4 sm:p-5 md:p-6 text-center shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black mb-3 sm:mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">結果を共有</h3>
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <ShareButton shareUrl={shareUrl} darkTheme={false} />
                {compatibility && percentile !== undefined && type2 && (
                  <ShareImageButton 
                    score={compatibility.total}
                    percentile={percentile}
                    userNickname={type1.name}
                    partnerNickname={type2.name}
                    message={compatibility.message}
                    userTypeCode={type1.type}
                    partnerTypeCode={type2.type}
                  />
                )}
              </div>
            </motion.div>
          </main>
        </div>
      ) : (
        /* 54問診断用レイアウト（スマホ） */
        <>
        <div className="flex flex-col gap-5 sm:gap-6 px-3 sm:px-4 py-6 sm:py-8 pb-16 sm:pb-20 relative z-10 md:hidden">
          <motion.header 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
              <p className="text-[10px] sm:text-xs font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] sm:tracking-[0.5em] text-black/60 mb-1.5 sm:mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断結果</p>
              <h1 className="text-4xl sm:text-5xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                PAIRLY LAB
              </h1>
          </motion.header>

          <main className="grid grid-cols-1 gap-4 sm:gap-5">
            {/* カップルの説明 */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-1.5 sm:mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.message}</h2>
                  <p className="text-xs sm:text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-xl mx-auto mt-1.5 sm:mt-2 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.detail}</p>
                </div>
              </div>
            </motion.div>

            {/* サマリーセクション */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60 mb-3 sm:mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">サマリー</h3>
                {compatibility && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性スコア</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.total}点</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性ランク</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.rank}</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ランク帯</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.bandName}</span>
                    </div>
                )}
                {percentile !== undefined && (
                    <div className="flex justify-between items-baseline py-3">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">上位</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </motion.div>

            {/* 区切り */}
            <div className="border-t-2 border-black/20 my-3 sm:my-4"></div>

            {/* タイププロフィール */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60 mb-4 sm:mb-6 text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたたちのタイプ</h3>
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <TypeProfile type={type1} isUser={true} showCharacterImage={true} />
                <div className="border-t-2 border-black/20"></div>
                <TypeProfile type={type2} isUser={false} showCharacterImage={true} />
              </div>
            </motion.div>

            {/* 詳細分析 */}
            {analysis && (
              <motion.div 
                className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-gradient-to-br from-green-200/80 via-green-100/80 to-green-200/80 backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-[0px_30px_80px_rgba(144,238,144,0.2),0px_15px_40px_rgba(144,238,144,0.15),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60 mb-3 sm:mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">詳細分析</h3>
                <AccordionItem title="二人の強み" initialOpen={true}>
                  <ul className="list-disc pl-5 space-y-2 text-black/90">
                    {analysis.strengths.map((item, index) => <li key={index} className="leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal">{item}</li>)}
                  </ul>
                </AccordionItem>
                <AccordionItem title="二人の課題">
                   <ul className="list-disc pl-5 space-y-3">
                    {analysis.challenges.map((item, index) => (
                      <li key={index} className="leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal">
                        <strong className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black">{item.title}:</strong> {item.description}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
                <AccordionItem title="6つの相性軸">
                    {analysisItems.map(item => <AxisInsight key={item.label} {...item} />)}
                </AccordionItem>
                <AccordionItem title="関係を深めるヒント">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたへ</h4>
                            <p className="text-black/90 leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.adviceUser}</p>
                        </div>
                        <div>
                            <h4 className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">パートナーへ</h4>
                            <p className="text-black/90 leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.advicePartner}</p>
                        </div>
                        <div className="pt-2">
                            <h4 className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">会話のきっかけ</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {analysis.conversationStarters.map((starter, i) => (
                                    <span key={i} className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#FFB6C1] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                                      {starter}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="pt-4 border-t-2 border-black/20 text-black/90 leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{analysis.futureMessage}</p>
                    </div>
                </AccordionItem>
              </motion.div>
            )}

            {/* 結果を共有 */}
            <motion.div 
              className="rounded-[32px] sm:rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-4 sm:p-5 md:p-6 text-center shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm sm:text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black mb-3 sm:mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">結果を共有</h3>
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <ShareButton shareUrl={shareUrl} darkTheme={false} />
                {compatibility && percentile !== undefined && type2 && (
                  <ShareImageButton 
                    score={compatibility.total}
                    percentile={percentile}
                    userNickname={type1.name}
                    partnerNickname={type2.name}
                    message={compatibility.message}
                    userTypeCode={type1.type}
                    partnerTypeCode={type2.type}
                  />
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </>
      )}
      
      {/* PC用レイアウト */}
      {diagnosisType === "18" ? (
        /* 18問診断用レイアウト（PC） */
        <div className="hidden md:flex flex-col gap-12 px-8 py-16 pb-24 relative z-10 max-w-7xl mx-auto">
          <motion.header 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.5em] text-black/60 mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断結果</p>
              <h1 className="text-7xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                PAIRLY LAB
              </h1>
          </motion.header>

          <main className="grid grid-cols-1 gap-10">
            {/* サマリーセクション */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">サマリー</h3>
                {compatibility && (
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性スコア</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.total}点</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性ランク</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.rank}</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ランク帯</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.bandName}</span>
                    </div>
                )}
                {percentile !== undefined && (
                    <div className="flex justify-between items-baseline py-4">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">上位</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </motion.div>

            {/* カップルの説明 */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-10 shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.message}</h2>
                  <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-3xl mx-auto mt-4 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.detail}</p>
                </div>
              </div>
            </motion.div>

            {/* 区切り */}
            <div className="border-t-2 border-black/20 my-4"></div>

            {/* タイププロフィール */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-10 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-8 text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたたちのタイプ</h3>
              <div className="grid grid-cols-2 gap-12 relative">
                <TypeProfile type={type1} isUser={true} showCharacterImage={true} />
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/20 -translate-x-1/2"></div>
                <TypeProfile type={type2} isUser={false} showCharacterImage={true} />
              </div>
            </motion.div>

            {/* 結果を共有 */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-8 text-center shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">結果を共有</h3>
              <div className="flex flex-col gap-4">
                <ShareButton shareUrl={shareUrl} darkTheme={false} />
                {compatibility && percentile !== undefined && type2 && (
                  <ShareImageButton 
                    score={compatibility.total}
                    percentile={percentile}
                    userNickname={type1.name}
                    partnerNickname={type2.name}
                    message={compatibility.message}
                    userTypeCode={type1.type}
                    partnerTypeCode={type2.type}
                  />
                )}
              </div>
            </motion.div>
          </main>
        </div>
      ) : (
        /* 54問診断用レイアウト（PC） */
        <div className="hidden md:flex flex-col gap-12 px-8 py-16 pb-24 relative z-10 max-w-7xl mx-auto">
          {/* PC用の装飾的なハートアイコン（背景に散りばめる） */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(15)].map((_, i) => {
              const positions = [
                { top: "8%", left: "3%", size: "w-12 h-12", opacity: "opacity-20" },
                { top: "12%", right: "5%", size: "w-10 h-10", opacity: "opacity-15" },
                { top: "20%", left: "8%", size: "w-14 h-14", opacity: "opacity-25" },
                { top: "25%", right: "10%", size: "w-11 h-11", opacity: "opacity-18" },
                { top: "35%", left: "2%", size: "w-13 h-13", opacity: "opacity-22" },
                { top: "40%", right: "4%", size: "w-9 h-9", opacity: "opacity-15" },
                { top: "50%", left: "6%", size: "w-12 h-12", opacity: "opacity-20" },
                { top: "55%", right: "8%", size: "w-10 h-10", opacity: "opacity-18" },
                { top: "65%", left: "10%", size: "w-11 h-11", opacity: "opacity-20" },
                { top: "70%", right: "6%", size: "w-13 h-13", opacity: "opacity-22" },
                { top: "80%", left: "4%", size: "w-9 h-9", opacity: "opacity-18" },
                { top: "85%", right: "12%", size: "w-12 h-12", opacity: "opacity-20" },
                { top: "15%", left: "50%", size: "w-8 h-8", opacity: "opacity-15" },
                { top: "45%", right: "50%", size: "w-10 h-10", opacity: "opacity-18" },
                { top: "75%", left: "50%", size: "w-9 h-9", opacity: "opacity-20" },
              ];
              const pos = positions[i] || positions[0];
              return (
                <motion.div
                  key={i}
                  className={`absolute ${pos.size} ${pos.opacity}`}
                  style={{
                    top: pos.top,
                    left: pos.left || undefined,
                    right: pos.right || undefined,
                  }}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    rotate: -180
                  }}
                  animate={{ 
                    opacity: [0.15, 0.25, 0.15],
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src="/heart.png" 
                    alt="" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // 画像が見つからない場合は非表示
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
          <motion.header 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.5em] text-black/60 mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断結果</p>
              <h1 className="text-7xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                PAIRLY LAB
              </h1>
          </motion.header>

          <main className="grid grid-cols-1 gap-10">
            {/* カップルの説明 */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-10 shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.message}</h2>
                  <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-3xl mx-auto mt-4 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.detail}</p>
                </div>
              </div>
            </motion.div>

            {/* サマリーセクション */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">サマリー</h3>
                {compatibility && (
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性スコア</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.total}点</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">相性ランク</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.rank}</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">ランク帯</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{rank.bandName}</span>
                    </div>
                )}
                {percentile !== undefined && (
                    <div className="flex justify-between items-baseline py-4">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">上位</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </motion.div>

            {/* 区切り */}
            <div className="border-t-2 border-black/20 my-4"></div>

            {/* タイププロフィール */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-8 text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたたちのタイプ</h3>
              <div className="grid grid-cols-2 gap-12 relative">
                <TypeProfile type={type1} isUser={true} showCharacterImage={true} />
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/20 -translate-x-1/2"></div>
                <TypeProfile type={type2} isUser={false} showCharacterImage={true} />
              </div>
            </motion.div>

            {/* 詳細分析 */}
            {analysis && (
              <motion.div 
                className="rounded-[48px] border border-white/70 bg-gradient-to-br from-green-200/80 via-green-100/80 to-green-200/80 backdrop-blur-md p-8 shadow-[0px_30px_80px_rgba(144,238,144,0.2),0px_15px_40px_rgba(144,238,144,0.15),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">詳細分析</h3>
                <AccordionItem title="二人の強み" initialOpen={true}>
                  <ul className="list-disc pl-5 space-y-3 text-black/90 text-base">
                    {analysis.strengths.map((item, index) => <li key={index} className="leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal">{item}</li>)}
                  </ul>
                </AccordionItem>
                <AccordionItem title="二人の課題">
                   <ul className="list-disc pl-5 space-y-4">
                    {analysis.challenges.map((item, index) => (
                      <li key={index} className="leading-relaxed text-base font-['Coming_Soon:Regular',sans-serif] font-normal">
                        <strong className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black">{item.title}:</strong> {item.description}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
                <AccordionItem title="6つの相性軸">
                    {analysisItems.map(item => <AxisInsight key={item.label} {...item} />)}
                </AccordionItem>
                <AccordionItem title="関係を深めるヒント">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-3 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたへ</h4>
                            <p className="text-black/90 leading-relaxed text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.adviceUser}</p>
                        </div>
                        <div>
                            <h4 className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-3 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">パートナーへ</h4>
                            <p className="text-black/90 leading-relaxed text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.advicePartner}</p>
                        </div>
                        <div className="pt-2">
                            <h4 className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-3 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">会話のきっかけ</h4>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {analysis.conversationStarters.map((starter, i) => (
                                    <span key={i} className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#FFB6C1] text-black px-5 py-2 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                                      {starter}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="pt-4 border-t-2 border-black/20 text-black/90 leading-relaxed text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{analysis.futureMessage}</p>
                    </div>
                </AccordionItem>
              </motion.div>
            )}

            {/* 結果を共有 */}
            <motion.div 
              className="rounded-[48px] border border-white/70 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md p-8 text-center shadow-[0px_30px_80px_rgba(255,182,193,0.25),0px_15px_40px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">結果を共有</h3>
              <div className="flex flex-col gap-4">
                <ShareButton shareUrl={shareUrl} darkTheme={false} />
                {compatibility && percentile !== undefined && type2 && (
                  <ShareImageButton 
                    score={compatibility.total}
                    percentile={percentile}
                    userNickname={type1.name}
                    partnerNickname={type2.name}
                    message={compatibility.message}
                    userTypeCode={type1.type}
                    partnerTypeCode={type2.type}
                  />
                )}
              </div>
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
};
