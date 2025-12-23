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

interface DiagnosisResultProps {
  type1: PersonalityType;
  type2?: PersonalityType;
  compatibility?: Compatibility;
  rank?: CompatibilityRank;
  analysis?: DetailedCompatibilityAnalysis;
  percentile?: number;
  shareUrl: string;
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
          stroke="#e2bef1"
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

const TypeProfile: React.FC<{ type: PersonalityType, isUser?: boolean }> = ({ type, isUser }) => (
  <div className="flex flex-col items-center text-center space-y-3">
    <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] text-black/60 mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        {isUser ? "あなた" : "パートナー"}
    </div>
    {type.icon && (
      <div className="flex items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full border-2 border-black bg-[#e2bef1] text-4xl md:text-5xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        {type.icon}
      </div>
    )}
    <div className="text-center">
        <h3 className="text-xl md:text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.name}</h3>
    </div>
    <p className="text-sm md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 w-full px-4 text-center leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.description}</p>
    <div className="flex flex-wrap gap-2 justify-center pt-2">
        <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#e2bef1] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.traits.communication}</span>
        <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#f97b83] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.traits.decision}</span>
        <span className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#f9ded7] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{type.traits.relationship}</span>
    </div>
  </div>
);

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
            <div className="bg-[#e2bef1] h-full rounded-full transition-all duration-1000" style={{ width: `${value}%` }}></div>
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
}> = ({ score, percentile, userNickname, partnerNickname, message }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-[16px] border border-black bg-white px-6 py-3 text-sm md:text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black transition hover:bg-gray-100 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
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
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!type2 || !compatibility) {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center p-4 min-h-screen bg-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* スマホ用レイアウト */}
            <div className="w-full max-w-md rounded-[16px] border border-black bg-[#e2bef1] p-8 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] md:hidden">
                <h1 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">あなたのタイプ</h1>
                <TypeProfile type={type1} isUser={true} />
                <div className="mt-8">
                    <ShareButton shareUrl={shareUrl} darkTheme={false} />
                </div>
            </div>
            {/* PC用レイアウト */}
            <div className="hidden md:block w-full max-w-2xl rounded-[16px] border border-black bg-[#e2bef1] p-12 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
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
    <div className="relative min-h-screen overflow-hidden bg-white">
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

      {/* スマホ用レイアウト */}
      <div className="flex flex-col gap-8 px-4 py-10 relative z-10 md:hidden">
        <motion.header 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.5em] text-black/60 mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断結果</p>
            <h1 className="text-5xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              PAIRLY LAB
            </h1>
        </motion.header>

        <main className="grid grid-cols-1 gap-6">
          <motion.div 
            className="rounded-[16px] border border-black bg-[#e2bef1] p-6 space-y-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full grid grid-cols-1 items-start gap-6">
              <div className="order-2 mx-auto">
                <AnimatedCircularProgress score={compatibility.total} />
              </div>
              <div className="order-1">
                <TypeProfile type={type1} isUser={true} />
              </div>
              <div className="order-3">
                <TypeProfile type={type2} isUser={false} />
              </div>
            </div>
            <div className="text-center border-t-2 border-black/20 pt-6">
              <h2 className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.message}</h2>
              <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-xl mx-auto mt-2 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.detail}</p>
            </div>
          </motion.div>

          <motion.aside 
            className="space-y-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-[16px] border border-black bg-white p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">サマリー</h3>
                {rank && percentile !== undefined && (
                  <div className="mb-4 flex flex-col items-center justify-center">
                    <div className="relative w-full h-48">
                      <RankImage rank={rank} />
                    </div>
                    <p className="mt-2 text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                      この画像はあなたのランク帯画像です
                    </p>
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
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">上位</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-2xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </div>

            {analysis && (
              <div className="rounded-[16px] border border-black bg-[#fbf7d5] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">詳細分析</h3>
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
                                    <span key={i} className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#e2bef1] text-black px-3 py-1 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                                      {starter}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="pt-4 border-t-2 border-black/20 text-black/90 leading-relaxed font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{analysis.futureMessage}</p>
                    </div>
                </AccordionItem>
              </div>
            )}
             <div className="rounded-[16px] border border-black bg-[#f97b83] p-6 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">結果を共有</h3>
                <div className="flex flex-col gap-3">
                  <ShareButton shareUrl={shareUrl} darkTheme={false} />
                  {compatibility && percentile !== undefined && type2 && (
                    <ShareImageButton 
                      score={compatibility.total}
                      percentile={percentile}
                      userNickname={type1.name}
                      partnerNickname={type2.name}
                      message={compatibility.message}
                    />
                  )}
                </div>
             </div>
          </motion.aside>
        </main>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden md:flex flex-col gap-12 px-8 py-16 relative z-10 max-w-7xl mx-auto">
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

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div 
            className="lg:col-span-2 rounded-[16px] border border-black bg-[#e2bef1] p-10 space-y-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full grid grid-cols-[1fr,auto,1fr] items-start gap-10">
              <TypeProfile type={type1} isUser={true} />
              <div className="my-0 mx-auto">
                <AnimatedCircularProgress score={compatibility.total} />
              </div>
              <TypeProfile type={type2} isUser={false} />
            </div>
            <div className="text-center border-t-2 border-black/20 pt-8">
              <h2 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.message}</h2>
              <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-2xl mx-auto mt-4 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{compatibility.detail}</p>
            </div>
          </motion.div>

          <motion.aside 
            className="space-y-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-[16px] border border-black bg-white p-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black/60 mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">サマリー</h3>
                {rank && percentile !== undefined && (
                  <div className="mb-6 flex flex-col items-center justify-center">
                    <div className="relative w-full h-64">
                      <RankImage rank={rank} />
                    </div>
                    <p className="mt-3 text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/60 text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                      この画像はあなたのランク帯画像です
                    </p>
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
                    <div className="flex justify-between items-baseline py-4 border-b-2 border-black/20">
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-lg text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">上位</span>
                        <span className="font-['Coming_Soon:Regular',sans-serif] font-normal text-3xl text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </div>

            {analysis && (
              <div className="rounded-[16px] border border-black bg-[#fbf7d5] p-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
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
                                    <span key={i} className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal bg-[#e2bef1] text-black px-5 py-2 rounded-[16px] border border-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                                      {starter}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="pt-4 border-t-2 border-black/20 text-black/90 leading-relaxed text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{analysis.futureMessage}</p>
                    </div>
                </AccordionItem>
              </div>
            )}
             <div className="rounded-[16px] border border-black bg-[#f97b83] p-8 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
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
                    />
                  )}
                </div>
             </div>
          </motion.aside>
        </main>
      </div>
    </div>
  );
};
