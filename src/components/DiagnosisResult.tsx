"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonalityType, Compatibility } from '@/lib/types';
import { CompatibilityRank, getRankImagePath } from '@/lib/calculate';
import type { DetailedCompatibilityAnalysis } from '@/lib/compatibility-analysis';
import { ShareButton } from './ShareButton';
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
        <circle className="text-white/10" strokeWidth="16" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" />
        <circle
          className="text-transparent"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="url(#gradient)"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff006e" />
            <stop offset="50%" stopColor="#8338ec" />
            <stop offset="100%" stopColor="#00f5ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-black bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] bg-clip-text text-transparent">{score}</span>
        <span className="text-sm font-black text-white/60 uppercase tracking-wider">pts</span>
      </div>
    </div>
  );
};

const TypeProfile: React.FC<{ type: PersonalityType, isUser?: boolean }> = ({ type, isUser }) => (
  <div className="flex flex-col items-center text-center space-y-3">
    <div className="text-xs font-black uppercase tracking-[0.4em] text-white/50 mb-1">
        {isUser ? "あなた" : "パートナー"}
    </div>
    {type.icon && (
      <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full border-4 border-white/30 bg-gradient-to-br from-[#ff006e]/30 to-[#8338ec]/30 text-5xl shadow-[0_0_40px_rgba(255,0,110,0.4)]">
        {type.icon}
      </div>
    )}
    <div className="text-center">
        <h3 className="text-2xl font-black text-white">{type.name}</h3>
    </div>
    <p className="text-sm text-white/80 max-w-xs px-4 text-center leading-relaxed">{type.description}</p>
    <div className="flex flex-wrap gap-2 justify-center pt-2">
        <span className="text-xs font-black bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white px-4 py-2 rounded-full border-2 border-white/20">{type.traits.communication}</span>
        <span className="text-xs font-black bg-gradient-to-r from-[#8338ec] to-[#00f5ff] text-white px-4 py-2 rounded-full border-2 border-white/20">{type.traits.decision}</span>
        <span className="text-xs font-black bg-gradient-to-r from-[#00f5ff] to-[#ff006e] text-white px-4 py-2 rounded-full border-2 border-white/20">{type.traits.relationship}</span>
    </div>
  </div>
);

const AccordionItem: React.FC<{ title: string; children: React.ReactNode, initialOpen?: boolean }> = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="border-b-2 border-white/20 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h3 className="text-xl font-black text-white">{title}</h3>
        <ChevronDown className={`transform transition-transform duration-300 text-white/60 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="text-white/90">
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
            <span className="font-black text-white">{label}</span>
            <span className="font-black text-white">{value}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-4 border-2 border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] h-full rounded-full transition-all duration-1000" style={{ width: `${value}%` }}></div>
        </div>
        <p className="text-xs text-white/70 mt-2">{description}</p>
    </div>
);

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
            className="flex flex-col items-center justify-center p-4 min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="w-full max-w-md rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#ff006e]/20 to-[#8338ec]/20 p-8 text-center backdrop-blur-2xl shadow-[0_0_80px_rgba(255,0,110,0.3)]">
                <h1 className="text-3xl font-black text-white mb-4">あなたのタイプ</h1>
                <TypeProfile type={type1} isUser={true} />
                <div className="mt-8">
                    <ShareButton shareUrl={shareUrl} darkTheme={true} />
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
      {/* 背景エフェクト */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1a0033] to-[#000033]" />
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[#ff006e] opacity-20 blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00f5ff] opacity-20 blur-[200px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="flex flex-col gap-10 lg:gap-14 px-4 py-10 relative z-10">
        <motion.header 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <p className="text-xs font-black uppercase tracking-[0.5em] text-white/50 mb-2">診断結果</p>
            <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] bg-clip-text text-transparent">
              相性診断
            </h1>
        </motion.header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#ff006e]/20 via-[#8338ec]/20 to-[#00f5ff]/20 p-6 md:p-8 space-y-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,0,110,0.3)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-start gap-6">
              <TypeProfile type={type1} isUser={true} />
              <div className="my-6 md:my-0 mx-auto order-first md:order-none">
                <AnimatedCircularProgress score={compatibility.total} />
              </div>
              <TypeProfile type={type2} isUser={false} />
            </div>
            <div className="text-center border-t-4 border-white/20 pt-6">
              <h2 className="text-3xl font-black text-white mb-2">{compatibility.message}</h2>
              <p className="text-white/80 max-w-xl mx-auto mt-2 leading-relaxed">{compatibility.detail}</p>
            </div>
          </motion.div>

          <motion.aside 
            className="space-y-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#8338ec]/20 to-[#ff006e]/20 p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(131,56,236,0.3)]">
                <h3 className="text-base font-black uppercase tracking-[0.3em] text-white/60 mb-4">サマリー</h3>
                {rank && percentile !== undefined && (
                  <div className="mb-4 flex items-center justify-center">
                    <div className="relative w-full h-48">
                      <Image
                        src={getRankImagePath(rank.rank)}
                        alt={rank.tier}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-white/20">
                        <span className="text-white/80 font-bold">相性ランク</span>
                        <span className="font-black text-2xl text-white">{rank.rank}</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-white/20">
                        <span className="text-white/80 font-bold">ランク帯</span>
                        <span className="font-black text-xl text-white">{rank.tier}</span>
                    </div>
                )}
                {percentile !== undefined && (
                    <div className="flex justify-between items-baseline py-3 border-b-2 border-white/20">
                        <span className="text-white/80 font-bold">上位</span>
                        <span className="font-black text-2xl bg-gradient-to-r from-[#ff006e] to-[#00f5ff] bg-clip-text text-transparent">{percentile.toFixed(1)}%</span>
                    </div>
                )}
            </div>

            {analysis && (
              <div className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#00f5ff]/20 to-[#8338ec]/20 p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,245,255,0.3)]">
                <h3 className="text-base font-black uppercase tracking-[0.3em] text-white/60 mb-2">詳細分析</h3>
                <AccordionItem title="二人の強み" initialOpen={true}>
                  <ul className="list-disc pl-5 space-y-2 text-white/90">
                    {analysis.strengths.map((item, index) => <li key={index} className="leading-relaxed">{item}</li>)}
                  </ul>
                </AccordionItem>
                <AccordionItem title="二人の課題">
                   <ul className="list-disc pl-5 space-y-3">
                    {analysis.challenges.map((item, index) => (
                      <li key={index} className="leading-relaxed">
                        <strong className="font-black text-white">{item.title}:</strong> {item.description}
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
                            <h4 className="font-black text-white mb-2">あなたへ</h4>
                            <p className="text-white/90 leading-relaxed">{compatibility.adviceUser}</p>
                        </div>
                        <div>
                            <h4 className="font-black text-white mb-2">パートナーへ</h4>
                            <p className="text-white/90 leading-relaxed">{compatibility.advicePartner}</p>
                        </div>
                        <div className="pt-2">
                            <h4 className="font-black text-white mb-2">会話のきっかけ</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {analysis.conversationStarters.map((starter, i) => (
                                    <span key={i} className="text-xs font-bold bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white px-4 py-2 rounded-full border-2 border-white/20">
                                      {starter}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="pt-4 border-t-2 border-white/20 text-white/90 leading-relaxed">{analysis.futureMessage}</p>
                    </div>
                </AccordionItem>
              </div>
            )}
             <div className="rounded-[40px] border-4 border-white/30 bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] p-6 text-center backdrop-blur-2xl shadow-[0_0_80px_rgba(255,0,110,0.4)]">
                <h3 className="text-base font-black uppercase tracking-[0.3em] text-white/90 mb-4">結果を共有</h3>
                <ShareButton shareUrl={shareUrl} darkTheme={true} />
             </div>
          </motion.aside>
        </main>
    </div>
    </div>
  );
};
