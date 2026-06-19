/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EraType, AvatarState } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EraSelectViewProps {
  onSelectEra: (era: EraType, defaultState: Omit<AvatarState, 'era'>) => void;
  onHome?: () => void;
}

interface EraCardInfo {
  id: EraType;
  title: string;
  dynasty: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  statePreset: Omit<AvatarState, 'era'>;
}

const ERA_PRESETS: EraCardInfo[] = [
  {
    id: 'heian',
    title: '平安姬样 · 樱雪月影',
    dynasty: '平安时代 (Heian Era)',
    description: '剃眉引黛，敷白底淡红。身穿十二单华服，长发披垂，流露古典隐秘之美。',
    accentColor: '#db2777',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    statePreset: {
      brows: 'brows_mayu1',
      eyes: 'eyes_gentle',
      lips: 'lips_cherry',
      blush: 'blush_peach',
      markings: 'markings_lotus',
      hair: 'hair_drape',
      clothing: 'clothing_royal',
      accessories: 'acc_none',
      bgColor: 'bg-[#faf5f5]'
    }
  },
  {
    id: 'edo_normal',
    title: '和风町家 · 浅草浮世',
    dynasty: '江户町家 (Edo Normal)',
    description: '蒲梳折扇，温婉日常。高发束头岛田髷，淡扫胭脂，居家贤淑温厚。',
    accentColor: '#b45309',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    statePreset: {
      brows: 'brows_mayu3',
      eyes: 'eyes_apricot',
      lips: 'lips_classic',
      blush: 'blush_peach',
      markings: 'markings_none',
      hair: 'hair_song',
      clothing: 'clothing_song',
      accessories: 'acc_none',
      bgColor: 'bg-[#fcf8f2]'
    }
  },
  {
    id: 'edo_hanayume',
    title: '神圣花嫁 · 纯白誓约',
    dynasty: '江户婚礼 (Edo Hanayume)',
    description: '角隐红唇，无暇白妆。遮覆角隐，白无垢纯洁神圣，愿夫妇长厢厮守。',
    accentColor: '#dc2626',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    statePreset: {
      brows: 'brows_mayu2',
      eyes: 'eyes_gentle',
      lips: 'lips_cherry',
      blush: 'blush_feihong',
      markings: 'markings_none',
      hair: 'hair_qing',
      clothing: 'clothing_qing',
      accessories: 'acc_veil',
      bgColor: 'bg-[#fafafa]'
    }
  },
  {
    id: 'tang',
    title: '大唐盛世 · 丽人自若',
    dynasty: '唐代 (Tang Dynasty)',
    description: '丰腴雍雅，蓬勃自信。描饰精细花钿，齐胸襦裙、轻纱随风，尽显绝色荣光。',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    statePreset: {
      brows: 'brows_mayu5',
      eyes: 'eyes_phoenix',
      lips: 'lips_butterfly',
      blush: 'blush_feihong',
      markings: 'markings_lotus',
      hair: 'hair_tang',
      clothing: 'clothing_tang',
      accessories: 'acc_fan',
      bgColor: 'bg-[#faf6eb]'
    }
  },
  {
    id: 'tsing',
    title: '大拉翅装 · 旗宫锦绣',
    dynasty: '清代 (Qing Dynasty)',
    description: '两把头大拉翅，耳挂一耳三钳。绸缎直筒旗装，尽展满洲名门高贵之气。',
    accentColor: '#1e3a8a',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    statePreset: {
      brows: 'brows_mayu14',
      eyes: 'eyes_apricot',
      lips: 'lips_cherry',
      blush: 'blush_drunken',
      markings: 'markings_none',
      hair: 'hair_qing',
      clothing: 'clothing_qing',
      accessories: 'acc_gold_shake',
      bgColor: 'bg-[#f0f4f8]'
    }
  },
  {
    id: 'tang_maid',
    title: '大唐侍女 ·俏丽双髻',
    dynasty: '唐风民间 (Tang Maid)',
    description: '活泼双丫，轻晕微红。短衫交领对襟，步伐俏皮，大唐民间的一抹清流朝气。',
    accentColor: '#15803d',
    badgeBg: 'bg-green-50 text-green-700 border-green-200',
    statePreset: {
      brows: 'brows_mayu6',
      eyes: 'eyes_apricot',
      lips: 'lips_cherry',
      blush: 'blush_peach',
      markings: 'markings_none',
      hair: 'hair_song',
      clothing: 'clothing_song',
      accessories: 'acc_none',
      bgColor: 'bg-[#f4faf5]'
    }
  }
];

export const EraSelectView: React.FC<EraSelectViewProps> = ({ onSelectEra, onHome }) => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0); // -1 for left, 1 for right
  const [bgError, setBgError] = useState<boolean>(false);
  const [leftBtnError, setLeftBtnError] = useState<boolean>(false);
  const [rightBtnError, setRightBtnError] = useState<boolean>(false);

  // Rotating Slider handlers (Infinite circular wrap)
  const handleSlideLeft = () => {
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + ERA_PRESETS.length) % ERA_PRESETS.length);
  };

  const handleSlideRight = () => {
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % ERA_PRESETS.length);
  };

  // Extract exactly 3 eras to show simultaneously based on loop start index
  const visibleEras = [
    ERA_PRESETS[startIndex],
    ERA_PRESETS[(startIndex + 1) % ERA_PRESETS.length],
    ERA_PRESETS[(startIndex + 2) % ERA_PRESETS.length]
  ];

  return (
    <div 
      className="relative w-full h-full bg-[#ebdcb9] flex flex-col items-center justify-between p-6 select-none font-sans overflow-hidden" 
      id="era-select-container"
    >
      {/* 1. PHYSICAL FILE INPUT FOR resources/era_selection/background.png */}
      {!bgError && (
        <img 
          src="/resources/era_selection/background.png" 
          alt="朝代背景" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          onError={() => {
            console.log("era_selection background.png not found, falling back to gorgeous high-fidelity SVGs.");
            setBgError(true);
          }}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Elegant Left Top Home Button (Matching the screenshot icon and style) */}
      {onHome && (
        <button
          onClick={onHome}
          className="absolute left-6 top-6 z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform outline-none"
          title="ホーム"
          id="btn-go-home"
        >
          <img 
            src="/resources/home_button.png" 
            alt="ホーム" 
            className="w-12 h-12 object-contain" 
            referrerPolicy="no-referrer"
          />
        </button>
      )}

      {/* Elegant Header Title */}
      <div className="text-center mt-3 z-10" id="era-header-text">
        <h2 
          className="font-black text-[28px] md:text-[34px] leading-tight tracking-wider"
          style={{
            color: '#f05357',
            fontFamily: '"Trebuchet MS", "Yu Gothic", sans-serif',
            textShadow: '3px 3px 0px #fff, -3px -3px 0px #fff, 3px -3px 0px #fff, -3px 3px 0px #fff, 3px 4px 0px rgba(190,50,50,0.18)'
          }}
        >
          キャラクターをえらんでね！
        </h2>
      </div>

      {/* 3 Arched Niches showing the looped items as raw images with visible overflow to prevent clip */}
      <div className="w-full flex justify-center items-center px-12 h-[78%] z-10 relative overflow-visible" id="era-arches-layout">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={startIndex}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 180 : -180,
                opacity: 0,
                scale: 0.92
              }),
              center: {
                x: 0,
                opacity: 1,
                scale: 1
              },
              exit: (dir: number) => ({
                x: dir > 0 ? -180 : 180,
                opacity: 0,
                scale: 0.92
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 280, damping: 26 },
              opacity: { duration: 0.22 },
              scale: { duration: 0.22 }
            }}
            className="w-full h-full flex justify-center items-center space-x-6 md:space-x-8 px-12"
          >
            {visibleEras.map((era) => (
              <motion.div
                key={era.id}
                onClick={() => onSelectEra(era.id, era.statePreset)}
                className="flex-1 max-w-[215px] h-full flex items-center justify-center relative cursor-pointer"
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              >
                <img
                  src={`/resources/era_selection/${era.id}.png`}
                  alt={era.title}
                  className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)] selection-img"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 
        Symmetrical slider buttons vertically centered (纵向居中) 
        Loading physical assets respectively: button_left.png / button_right.png
      */}
      <button
        onClick={handleSlideLeft}
        className="absolute left-4 top-[55%] -translate-y-1/2 z-20 cursor-pointer active:scale-95 transition-all outline-none"
        title="左へ"
        id="btn-slide-left"
      >
        {!leftBtnError ? (
          <img
            src="/resources/era_selection/button_left.png"
            alt="左へ"
            className="w-14 h-14 object-contain hover:scale-110 transition-transform drop-shadow"
            onError={() => setLeftBtnError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-[#92400e]/70 flex items-center justify-center text-[#78350f] hover:text-[#991b1b] bg-[#fdfaf2] hover:bg-[#ebdcb9] hover:border-[#991b1b] transition-all shadow-md group">
            <div className="relative flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 absolute z-10 group-hover:-translate-x-0.5 transition-transform" />
              <svg viewBox="0 0 40 40" className="w-9 h-9 fill-[#78350f]/10 opacity-70 group-hover:scale-110 transition-transform">
                <path d="M 20 2 C 10 9, 10 31, 20 38 C 30 31, 30 9, 20 2 M 20 12 C 16 16, 16 24, 20 28 C 24 24, 24 16, 20 12" />
              </svg>
            </div>
          </div>
        )}
      </button>

      <button
        onClick={handleSlideRight}
        className="absolute right-4 top-[55%] -translate-y-1/2 z-20 cursor-pointer active:scale-95 transition-all outline-none"
        title="右へ"
        id="btn-slide-right"
      >
        {!rightBtnError ? (
          <img
            src="/resources/era_selection/button_right.png"
            alt="右へ"
            className="w-14 h-14 object-contain hover:scale-110 transition-transform drop-shadow"
            onError={() => setRightBtnError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-[#92400e]/70 flex items-center justify-center text-[#78350f] hover:text-[#991b1b] bg-[#fdfaf2] hover:bg-[#ebdcb9] hover:border-[#991b1b] transition-all shadow-md group">
            <div className="relative flex items-center justify-center">
              <ChevronRight className="w-5 h-5 absolute z-10 group-hover:translate-x-0.5 transition-transform" />
              <svg viewBox="0 0 40 40" className="w-9 h-9 fill-[#78350f]/10 opacity-70 group-hover:scale-110 transition-transform">
                <path d="M 20 2 C 10 9, 10 31, 20 38 C 30 31, 30 9, 20 2 M 20 12 C 16 16, 16 24, 20 28 C 24 24, 24 16, 20 12" />
              </svg>
            </div>
          </div>
        )}
      </button>

      {/* Slight negative margin dummy space to anchor bottom cleanly */}
      <div className="h-2" />
    </div>
  );
};
