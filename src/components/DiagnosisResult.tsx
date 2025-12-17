"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonalityType, Compatibility } from '@/lib/types';
import { CompatibilityRank } from '@/lib/calculate';
import type { DetailedCompatibilityAnalysis } from '@/lib/compatibility-analysis';
import { ShareButton } from './ShareButton';
import { ChevronDown } from 'lucide-react';

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
      <svg className="transform -rotate-90" width="180" height="180" viewBox="0 0 180 180">
        <circle className="text-white/10" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="90" cy="90" />
        <circle
          className="text-primary"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="90"
          cy="90"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-semibold text-white">{score}</span>
        <span className="text-sm font-medium text-muted-foreground">pts</span>
      </div>
    </div>
  );
};

const TypeProfile: React.FC<{ type: PersonalityType, isUser?: boolean }> = ({ type, isUser }) => (
  <div className="flex flex-col items-center text-center space-y-3">
    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {isUser ? "あなた" : "パートナー"}
    </div>
    {type.icon && (
      <div className="flex items-center justify-center w-[90px] h-[90px] rounded-full border-2 border-white/10 shadow-lg bg-white/5 text-4xl">
        {type.icon}
      </div>
    )}
    <div className="text-center">
        <h3 className="text-xl font-semibold text-white">{type.name}</h3>
    </div>
    <p className="text-sm text-muted-foreground max-w-xs px-4 text-center">{type.description}</p>
    <div className="flex flex-wrap gap-2 justify-center pt-2">
        <span className="text-xs bg-black/20 border border-white/10 text-muted-foreground px-3 py-1 rounded-full">{type.traits.communication}</span>
        <span className="text-xs bg-black/20 border border-white/10 text-muted-foreground px-3 py-1 rounded-full">{type.traits.decision}</span>
        <span className="text-xs bg-black/20 border border-white/10 text-muted-foreground px-3 py-1 rounded-full">{type.traits.relationship}</span>
    </div>
  </div>
);


const AccordionItem: React.FC<{ title: string; children: React.ReactNode, initialOpen?: boolean }> = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="border-b border-white/10 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <ChevronDown className={`transform transition-transform duration-300 text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="prose prose-sm text-muted-foreground prose-strong:text-white/90 prose-headings:text-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AxisInsight: React.FC<{ label: string; value: number; description: string }> = ({ label, value, description }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-semibold text-white/90">{label}</span>
            <span className="font-medium text-muted-foreground">{value}%</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary via-[#7ff6f2] to-[#9a8cff] h-2 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
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
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-8 text-center">
                <h1 className="text-2xl font-semibold text-white mb-4">あなたのタイプ</h1>
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
    <div className="flex flex-col gap-10 lg:gap-14 px-4 py-10">
        <motion.header 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Compatibility Result</p>
            <h1 className="text-4xl font-semibold text-white mt-2">診断結果</h1>
        </motion.header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl shadow-[0_35px_120px_rgba(0,0,0,0.45)] p-6 md:p-8 space-y-8"
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
            <div className="text-center border-t border-white/10 pt-6">
              <h2 className="text-2xl font-semibold text-white">{compatibility.message}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mt-2">{compatibility.detail}</p>
            </div>
          </motion.div>

          <motion.aside 
            className="space-y-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-6">
                <h3 className="text-base uppercase tracking-[0.3em] text-muted-foreground mb-4">Summary</h3>
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b border-white/10">
                        <span className="text-muted-foreground">相性ランク</span>
                        <span className="font-semibold text-lg text-white">{rank.rank}</span>
                    </div>
                )}
                {rank && (
                    <div className="flex justify-between items-baseline py-3 border-b border-white/10">
                        <span className="text-muted-foreground">ランク帯</span>
                        <span className="font-semibold text-lg text-white">{rank.tier}</span>
                    </div>
                )}
                {percentile !== undefined && (
                    <div className="flex justify-between items-baseline py-3 border-b border-white/10">
                        <span className="text-muted-foreground">上位</span>
                        <span className="font-semibold text-lg text-primary">{percentile.toFixed(1)}%</span>
                    </div>
                )}
                 {rank && (
                    <div className="text-center pt-4">
                        <p className="font-semibold text-xl text-white">{rank.tier}</p>
                    </div>
                )}
            </div>

            {analysis && (
              <div className="bg-white/5 border border-white/10 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-6">
                <h3 className="text-base uppercase tracking-[0.3em] text-muted-foreground mb-2">Detailed Analysis</h3>
                <AccordionItem title="二人の強み" initialOpen={true}>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {analysis.strengths.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </AccordionItem>
                <AccordionItem title="二人の課題">
                   <ul className="list-disc pl-5 space-y-2">
                    {analysis.challenges.map((item, index) => <li key={index}><strong className="font-semibold">{item.title}:</strong> {item.description}</li>)}
                  </ul>
                </AccordionItem>
                <AccordionItem title="6つの相性軸">
                    {analysisItems.map(item => <AxisInsight key={item.label} {...item} />)}
                </AccordionItem>
                <AccordionItem title="関係を深めるヒント">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-white/90">あなたへ</h4>
                            <p>{compatibility.adviceUser}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white/90">パートナーへ</h4>
                            <p>{compatibility.advicePartner}</p>
                        </div>
                        <div className="pt-2">
                            <h4 className="font-semibold text-white/90">会話のきっかけ</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {analysis.conversationStarters.map((starter, i) => (
                                    <span key={i} className="text-xs bg-black/20 border border-white/10 text-muted-foreground px-3 py-1 rounded-full">{starter}</span>
                                ))}
                            </div>
                        </div>
                        <p className="pt-4 border-t border-white/10">{analysis.futureMessage}</p>
                    </div>
                </AccordionItem>
              </div>
            )}
             <div className="bg-white/5 border border-white/10 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-6 text-center">
                <h3 className="text-base uppercase tracking-[0.3em] text-muted-foreground mb-4">Share Result</h3>
                <ShareButton shareUrl={shareUrl} darkTheme={true} />
             </div>
          </motion.aside>
        </main>
    </div>
  );
};
