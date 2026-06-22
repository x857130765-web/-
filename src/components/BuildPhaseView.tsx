import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EraType, AvatarState, DressUpItem } from '../types';
import { HintPageView } from './HintPageView';
import { 
  AvatarMannequin, 
  BROWS_ASSETS, 
  EYES_ASSETS, 
  LIPS_ASSETS, 
  BLUSH_ASSETS, 
  MARKINGS_ASSETS, 
  HAIR_ASSETS, 
  CLOTHING_ASSETS, 
  ACCESSORIES_ASSETS,
  CATEGORY_LABELS
} from './AvatarAssets';
import { Sparkles, Info, Undo2, ArrowUpRight, HelpCircle } from 'lucide-react';

interface BuildPhaseViewProps {
  era: EraType;
  phase: 'face_build' | 'overall_build';
  currentState: AvatarState;
  onStateChange: (state: AvatarState | ((prev: AvatarState) => AvatarState)) => void;
  onNext: () => void;
  onPrev: () => void;
  onHome: () => void;
  initialTab?: string;
  onExitToSelection?: () => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

export const BuildPhaseView: React.FC<BuildPhaseViewProps> = ({
  era,
  phase,
  currentState,
  onStateChange,
  onNext,
  onPrev,
  onHome,
  initialTab,
  onExitToSelection,
  isMuted,
  setIsMuted,
}) => {
  // Determine available tabs based on high-level phase
  const faceTabs = ['brows', 'lips', 'blush', 'eyes'] as const;
  const overallTabs = ['hair', 'clothing', 'markings'] as const;
  
  const currentTabs = phase === 'face_build' ? faceTabs : overallTabs;
  const [activeTab, setActiveTab] = useState<string>(initialTab || currentTabs[0]);
  const [showHintPage, setShowHintPage] = useState<boolean>(false);
  const [showEndButton, setShowEndButton] = useState<boolean>(false);

  // States for button image fallbacks
  const [homeImgFailed, setHomeImgFailed] = useState<boolean>(false);
  const [replayImgFailed, setReplayImgFailed] = useState<boolean>(false);
  const [tipImgFailed, setTipImgFailed] = useState<boolean>(false);
  const [musicImgFailed, setMusicImgFailed] = useState<boolean>(false);
  const [btnRightFailed, setBtnRightFailed] = useState<boolean>(false);
  const [btnLeftFailed, setBtnLeftFailed] = useState<boolean>(false);
  const [btnEndFailed, setBtnEndFailed] = useState<boolean>(false);
  const [back1Failed, setBack1Failed] = useState<boolean>(false);
  const [back2Failed, setBack2Failed] = useState<boolean>(false);
  const [closeBtnFailed, setCloseBtnFailed] = useState<boolean>(false);

  // Procedural background music hook removed to favor global netease BGM
  useEffect(() => {
    // Relying on global background music in App.tsx
  }, [isMuted]);

  // Adjust active tab when switching phases
  useEffect(() => {
    setActiveTab(initialTab || currentTabs[0]);
  }, [phase, initialTab]);

  // Delayed timer for showing "おしまい" button in markings tab (3 seconds duration)
  useEffect(() => {
    if (phase === 'overall_build' && activeTab === 'markings') {
      setShowEndButton(false);
      const timer = setTimeout(() => {
        setShowEndButton(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowEndButton(false);
    }
  }, [phase, activeTab]);

  // Dynamic focus/zoom calculation for the face customizer step and full costume step
  const getDynamicPreviewTransform = () => {
    if (phase === 'face_build') {
      return 'scale(1.13) translateY(54px)';
    } else {
      // Step 2 overall build: overall scale reduced by 10% (from 0.82 to 0.738) and shifted down by 50px (from 96px to 146px)
      return 'scale(0.738) translateY(146px)';
    }
  };

  // Helper tooltip for historical trivia to make the app educational and delightful
  const [tooltipText, setTooltipText] = useState<string>('试试点击右侧各种配件，为角色精细装扮吧！');

  // Trigger feedback text on selecting items
  const handleItemSelect = (category: string, itemId: string, item: DressUpItem) => {
    onStateChange((prev) => {
      let nextMarkings = prev.markings;
      if (category === 'markings') {
        if (itemId === 'markings_hana10' || itemId === 'markings_hana11') {
          const currentParts = prev.markings ? prev.markings.split(',') : [];
          if (currentParts.includes(itemId)) {
            // Toggle off
            const filtered = currentParts.filter(p => p !== itemId);
            nextMarkings = filtered.length > 0 ? filtered.join(',') : 'markings_none';
          } else {
            // Toggle on, and make opposite mutually exclusive
            const oppositeId = itemId === 'markings_hana10' ? 'markings_hana11' : 'markings_hana10';
            const filtered = currentParts.filter(p => p !== 'markings_none' && p !== oppositeId);
            filtered.push(itemId);
            nextMarkings = filtered.join(',');
          }
        } else if (itemId === 'markings_none') {
          nextMarkings = 'markings_none';
        } else {
          const currentParts = prev.markings ? prev.markings.split(',') : [];
          const overlays = currentParts.filter(p => p === 'markings_hana10' || p === 'markings_hana11');
          overlays.unshift(itemId);
          nextMarkings = overlays.join(',');
        }
        return {
          ...prev,
          markings: nextMarkings
        };
      }
      return {
        ...prev,
        [category]: itemId,
      };
    });
    setTooltipText(`配置了【${item.name}】：${item.description}`);
  };

  const handleNextStep = () => {
    if (phase === 'face_build') {
      if (activeTab === 'brows') {
        setActiveTab('lips');
        setTooltipText('继续定制：请挑选心仪的口红唇色吧！');
      } else if (activeTab === 'lips') {
        setActiveTab('blush');
        setTooltipText('继续定制：请挑选心仪的腮红胭脂吧！');
      } else if (activeTab === 'blush') {
        setActiveTab('eyes');
        setTooltipText('继续定制：请挑选心仪的眼妆画法吧！');
      } else if (activeTab === 'eyes') {
        onNext();
      }
    } else {
      if (activeTab === 'hair') {
        setActiveTab('clothing');
        setTooltipText('继续定制：选一件高雅古典的华服上装吧！');
      } else if (activeTab === 'clothing') {
        setActiveTab('markings');
        setTooltipText('继续定制：选一枚额间精致的花钿贴吧！');
      } else if (activeTab === 'markings') {
        onNext();
      }
    }
  };

  const handlePrevStep = () => {
    if (phase === 'face_build') {
      if (activeTab === 'lips') {
        setActiveTab('brows');
        setTooltipText('返回到：眉毛定制。');
      } else if (activeTab === 'blush') {
        setActiveTab('lips');
        setTooltipText('返回到：口红唇妆。');
      } else if (activeTab === 'eyes') {
        setActiveTab('blush');
        setTooltipText('返回到：腮红胭脂。');
      } else if (activeTab === 'brows') {
        onPrev();
      }
    } else {
      if (activeTab === 'hair') {
        onPrev();
      } else if (activeTab === 'clothing') {
        setActiveTab('hair');
        setTooltipText('返回到：人物发型定制。');
      } else if (activeTab === 'markings') {
        setActiveTab('clothing');
        setTooltipText('返回到：古典衣裳定制。');
      }
    }
  };

  // Get current list of items in active tab
  const getItemsForActiveTab = (): DressUpItem[] => {
    switch (activeTab) {
      case 'brows': return BROWS_ASSETS;
      case 'lips': return LIPS_ASSETS;
      case 'blush': return BLUSH_ASSETS;
      case 'eyes': return EYES_ASSETS;
      case 'hair': return HAIR_ASSETS;
      case 'clothing': return CLOTHING_ASSETS.filter(c => c.id !== 'towel_base'); // Hide base towel wrapper
      case 'markings': return MARKINGS_ASSETS;
      default: return [];
    }
  };

  // Calculate current active values for tick marks
  const getActiveIdForCategory = (cat: string) => {
    const val = currentState[cat as keyof AvatarState];
    if (typeof val === 'string' && val.includes(',')) {
      return val.split(',');
    }
    return [val];
  };

  // Helper for tab names
  const getTabLabel = (tab: string) => {
    if (tab === 'brows') return '1.蛾眉';
    if (tab === 'lips') return '2.朱唇';
    if (tab === 'blush') return '3.腮红';
    if (tab === 'eyes') return '4.眼妆';
    if (tab === 'hair') return '1.发型';
    if (tab === 'clothing') return '2.服饰';
    if (tab === 'markings') return '3.花钿';
    return tab;
  };

  // Render dummy SVG Thumbnail inside item cells to preview shapes
  const renderThumbnailSvg = (item: DressUpItem) => {
    // Custom viewBox per category to crop & zoom-in dramatically!
    let viewBoxVal = "0 0 120 250";
    if (item.category === 'brows') {
      const isMayu18 = item.id.endsWith('mayu18');
      const isMayu23 = item.id.endsWith('mayu23');
      const isMayu22 = item.id.endsWith('mayu22');
      const numStr = item.id.replace('brows_mayu', '');
      const num = parseInt(numStr, 10);
      const isInLastTwoRows = !isNaN(num) && num >= 16;
      
      if (isInLastTwoRows) {
        if (isMayu18) {
          viewBoxVal = "34 45 52 11";
        } else if (isMayu23) {
          viewBoxVal = "34 52 52 11"; // Centered/moved up to center
        } else if (isMayu22) {
          viewBoxVal = "34 40 52 11";
        } else {
          viewBoxVal = "34 41 52 11";
        }
      } else {
        if (isMayu18) {
          viewBoxVal = "34 58 52 11";
        } else if (isMayu23) {
          viewBoxVal = "34 60 52 11";
        } else if (isMayu22) {
          viewBoxVal = "34 49 52 11";
        } else {
          viewBoxVal = "34 53 52 11";
        }
      }
    }
    else if (item.category === 'eyes') {
      if (item.id.endsWith('eye1')) {
        viewBoxVal = "25.5 62 69 23";
      } else if (item.id.endsWith('eye2')) {
        viewBoxVal = "33.5 68.5 53 18";
      } else {
        viewBoxVal = "33.5 64.5 53 18";
      }
    }
    else if (item.category === 'lips') {
      if (item.id.endsWith('lip1')) viewBoxVal = "41 80 38 20";
      else if (item.id.endsWith('lip2')) viewBoxVal = "41 79 38 20";
      else if (item.id.endsWith('lip3')) viewBoxVal = "41 82 38 20";
      else if (item.id.endsWith('lip4') || item.id.endsWith('lip5')) viewBoxVal = "41 78 38 20";
      else viewBoxVal = "41 81 38 20";
    }
    else if (item.category === 'blush') viewBoxVal = "20 74 80 24";
    else if (item.category === 'markings') {
      if (item.id.endsWith('hana10') || item.id.endsWith('hana11')) {
        viewBoxVal = "85 62 22 22";
      } else {
        viewBoxVal = "51 34 18 18";
      }
    }
    else if (item.category === 'hair') {
      if (item.id === 'hair_none') {
        viewBoxVal = "0 0 120 250";
      } else if (item.id === 'hair_5') {
        viewBoxVal = "-15 -140 150 210"; // shifted up by 40px
      } else {
        viewBoxVal = "-25 -140 170 230"; // shifted up by 50px
      }
    }
    else if (item.category === 'clothing') viewBoxVal = "0 53 120 160";
    else if (item.category === 'accessories') viewBoxVal = "35.7 34.55 48.6 45.9";

    if (item.id.endsWith('_none')) {
      return (
        <img 
          src="/resources/makeup/no_button.png" 
          alt="无" 
          className="w-7 h-7 object-contain rounded-md select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
      );
    }

    // Standard items zoomed in
    return (
      <svg 
        viewBox={viewBoxVal} 
        className={`${
          item.category === 'clothing' ? 'w-full h-full' : item.category === 'hair' ? 'w-full h-full' : 'w-[85px] h-[75px]'
        } max-w-full opacity-90`}
      >
        <g>
          {item.visualSvg({ isThumbnail: true })}
        </g>
      </svg>
    );
  };

  // Helper to trigger specific hint
  const handleBulbTip = () => {
    if (era === 'heian') {
      setTooltipText('★ 仕女典藏：平安姬样流行引眉、敷白底淡红妆，高贵典雅。');
    } else if (era === 'edo_normal') {
      setTooltipText('★ 仕女典藏：江户町家女性日常讲求薄妆，发型经典岛田髷，淡雅温柔。');
    } else if (era === 'edo_hanayume') {
      setTooltipText('★ 仕女典藏：江户花嫁罩白无垢、角隐宽帽，血红唇瓣。');
    } else if (era === 'tang') {
      setTooltipText('★ 仕女典藏：唐代流行柳叶细眉、蝴蝶红唇、以及红莲花钿。搭配朝天髻最合适不过！');
    } else if (era === 'tsing') {
      setTooltipText('★ 仕女典藏：清风宫廷风格重点是横扇形大拉翅旗头、一字细眉以及樱桃朱唇。');
    } else if (era === 'tang_maid') {
      setTooltipText('★ 仕女典藏：唐风侍女梳俏丽双丫髻，薄擦腮红，活泼可爱。');
    } else {
      setTooltipText('★ 仕女典藏：古典丽人华章，选配精致饰品会有意想不到效果。');
    }
  };

  // Reset category items to empty/none
  const handleClearItems = () => {
    if (phase === 'overall_build') {
      onStateChange((prev) => ({
        ...prev,
        markings: 'markings_none',
        hair: 'hair_none',
        clothing: 'clothing_none',
        accessories: 'acc_none',
      }));
      setTooltipText('已重置所有的第二步选项（发型、服饰与花钿装饰）。');
    } else {
      onStateChange((prev) => ({
        ...prev,
        brows: 'brows_none',
        eyes: 'eyes_none',
        lips: 'lips_none',
        blush: 'blush_none',
        markings: 'markings_none',
        hair: 'hair_none',
        clothing: 'clothing_none',
        accessories: 'acc_none',
      }));
      setTooltipText('所有的选项已重置。');
    }
  };

  // Render custom minimal vector icons for pink cabinet dressing drawer tabs
  const renderTabIcon = (tab: string, isSelected: boolean) => {
    const strokeColor = isSelected ? 'text-rose-500' : 'text-white';
    const fillStyle = isSelected ? 'fill-rose-500' : 'fill-white';
    if (tab === 'brows') {
      return (
        <img 
          src="/resources/makeup/mayu_icon.png" 
          alt="眉毛" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (tab === 'lips') {
      return (
        <img 
          src="/resources/makeup/kuchi_icon.png" 
          alt="朱唇" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (tab === 'blush') {
      return (
        <img 
          src="/resources/makeup/cheek_icon.png" 
          alt="腮红" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (tab === 'eyes') {
      return (
        <img 
          src="/resources/makeup/eye_icon.png" 
          alt="眼妆" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (tab === 'hair') {
      return (
        <img 
          src="/resources/makeup/hair_icon.png" 
          alt="发型" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (tab === 'clothing') {
      return (
        <img 
          src="/resources/makeup/cloth_icon.png" 
          alt="服饰" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (tab === 'markings') {
      return (
        <img 
          src="/resources/makeup/flower_icon.png" 
          alt="花钿" 
          className="w-11 h-[22px] object-contain"
          referrerPolicy="no-referrer"
        />
      );
    }
    return <span className="font-bold text-xs">{tab}</span>;
  };

  // Force face phase makeup body focus as shown in Image 3: Wrap towel with simplified hair
  const resolvedStateForPreview = () => {
    if (phase === 'face_build') {
      return {
        ...currentState,
        clothing: 'clothing_none', // Do not overlay any vector towel in face customizer phase
        hair: 'hair_none',         // Do not overlay any vector hair in face customizer phase
        accessories: 'acc_none'    // Remove fan or veil to clear face viewport
      };
    }
    return currentState;
  };

  const showPrevButton = (phase === 'face_build' && ['lips', 'blush', 'eyes'].includes(activeTab)) || phase === 'overall_build';

  return (
    <div className="relative w-full h-full bg-[#fbefe2] flex p-4 select-none font-sans overflow-hidden" id="build-container">
      {/* Background image requested by user */}
      <img 
        src="/resources/makeup/makeup_background.png" 
        alt="背景" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" 
        referrerPolicy="no-referrer"
      />
      
      {/* Background silk flowy dust pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2caa3_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[#fffbeb]/10 pointer-events-none z-10" />

      {/* 1. TOP-LEFT BACK HOME ARROW (Loads custom home_button.png with fallback) */}
      <div className="absolute top-4 left-4 z-40">
        <button
          onClick={onHome}
          className="w-12 h-12 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 bg-transparent border-0 focus:outline-none"
          title="ホーム"
          id="btn-nav-home-main"
        >
          {homeImgFailed ? (
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#fbf5e6] to-[#e6cf9c] border-2 border-[#ca9d54] shadow flex items-center justify-center text-[#735118] text-xl font-bold font-serif shadow-md">
              🏠
            </div>
          ) : (
            <img 
              src="/resources/home_button.png" 
              alt="主页" 
              className="w-full h-full object-contain pointer-events-none"
              onError={() => {
                setHomeImgFailed(true);
              }}
              referrerPolicy="no-referrer"
            />
          )}
        </button>
      </div>

      {/* 2. LEFT SIDE: DYNAMIC CHIBI AVATAR RENDERER WINDOW */}
      <div className="h-full w-[45%] flex flex-col justify-center items-center relative pr-4 z-10 overflow-visible transition-all duration-300">
        {/* Dynamic Avatar - Zoomed in to focus beautifully on the head, chest, and face elements */}
        <div className="w-full h-full relative z-10 flex items-start justify-center overflow-visible select-none pointer-events-none">
          <div 
            className="w-full h-full flex items-start justify-center origin-top overflow-visible"
            style={{ 
              transform: getDynamicPreviewTransform(),
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <AvatarMannequin state={resolvedStateForPreview()} useImageCharacter={true} />
          </div>
        </div>
      </div>

      {/* 3. RIGHT SIDE: DETAILED FOLDER DRESSING BOARD (Pink Cabinet Style) */}
      <div className="h-[97%] w-[55%] pr-[72px] mt-1 flex flex-col relative transition-all duration-300" id="folder-note-board">
        {/* Cabinet custom top-rim pink header panel */}
        <div className={`h-[46px] rounded-t-2xl flex items-end relative z-10 select-none shadow justify-between px-1.5 ${
          phase === 'overall_build' 
            ? 'bg-[#e3bc6a] border-t-4 border-x-4 border-[#ca9d54]' 
            : 'bg-[#fca5a5] border-t-4 border-x-4 border-rose-300'
        }`}>
          {currentTabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-1.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer rounded-t-lg border-t border-x ${
                  isSelected 
                    ? phase === 'overall_build' 
                      ? 'bg-white text-amber-700 border-[#ca9d54] translate-y-[5px] h-[39px] z-20 shadow-sm' 
                      : 'bg-white text-rose-500 border-rose-300 translate-y-[2px] h-[38px] z-20 shadow-sm'
                    : phase === 'overall_build'
                      ? 'bg-[#daab45]/60 hover:bg-[#daab45]/80 text-[#543003] border-transparent translate-y-[7px] h-[33px]'
                      : 'bg-[#ffa6a6]/40 hover:bg-[#ffa6a6]/60 text-white border-transparent translate-y-[4px] h-[33px]'
                }`}
                style={{ flex: 1, margin: '0 4px' }}
              >
                <div className="flex flex-col items-center justify-center">
                  {renderTabIcon(tab, isSelected)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main cabinet drawer-styled grid container with dynamic border image */}
        <div 
          style={{
            backgroundImage: `url(${
              activeTab === 'clothing' 
                ? '/resources/makeup/cloth_border.png' 
                : phase === 'overall_build' 
                ? '/resources/makeup/border2.png' 
                : '/resources/makeup/make_border.png'
            })`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'transparent'
          }}
          className="flex-1 relative flex flex-col overflow-hidden mt-[-8px] p-8 pb-10"
        >
          {/* Scrolling Drawers of options */}
          <div 
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 select-none custom-scrollbar z-10 scroll-smooth" 
            id="components-grid-container"
            style={
              activeTab === 'brows' ? { maxHeight: '396px', scrollBehavior: 'smooth' } :
              activeTab === 'hair' ? { maxHeight: '406px', scrollBehavior: 'smooth' } :
              activeTab === 'clothing' ? { maxHeight: '490px', scrollBehavior: 'smooth' } :
              activeTab === 'markings' ? { maxHeight: '406px', scrollBehavior: 'smooth' } : { maxHeight: '396px', scrollBehavior: 'smooth' }
            }
          >
            {activeTab === 'hair' ? (
              <div className="grid grid-cols-3 gap-y-[12px] gap-x-[12px] px-2 w-full items-start">
                {getItemsForActiveTab().map((item) => {
                  const activeIds = getActiveIdForCategory(item.category);
                  const isSelected = activeIds.includes(item.id);
                  const isTall = item.id === 'hair_2' || item.id === 'hair_3';
                  const bgUrl = isTall ? "/resources/makeup/make_border2.png" : "/resources/makeup/make_border1.png";
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => handleItemSelect(item.category, item.id, item)}
                      className={`relative p-1.5 cursor-pointer flex flex-col items-center justify-center bg-transparent select-none transition-all duration-200 ${
                        isTall ? 'row-span-2 h-[268px]' : 'h-[128px]'
                      } ${
                        isSelected 
                          ? 'ring-2 ring-[#ea923b] scale-[1.03] shadow-md z-10'
                          : 'hover:scale-[1.02]'
                      }`}
                      style={{
                        backgroundImage: `url('${bgUrl}')`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {/* SVG thumbnail container - borderless, seamless & maximized */}
                      <div className={`w-full h-full flex items-center justify-center overflow-hidden rounded-lg relative z-0 ${
                        item.id.endsWith('_none')
                          ? 'scale-[1.0] translate-y-1.5'
                          : isTall 
                            ? 'scale-[1.15] -translate-y-[28px]' 
                            : 'scale-[1.04] -translate-y-[22px]'
                      }`}>
                        {renderThumbnailSvg(item)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
                <div className={`grid p-1 w-full gap-2.5 items-start ${
                  activeTab === 'clothing' 
                    ? 'grid-cols-3 gap-x-0 gap-y-[47px]' 
                    : 'grid-cols-4 gap-x-2.5 gap-y-2.5'
                }`}>
                  {getItemsForActiveTab().map((item) => {
                    const activeIds = getActiveIdForCategory(item.category);
                    const isSelected = activeIds.includes(item.id);
                    const isMarking = activeTab === 'markings';
                    const isClothing = activeTab === 'clothing';
                    
                    const optionHeightClass = 
                      isClothing 
                        ? 'h-[210px]' 
                        : activeTab === 'brows'
                          ? 'h-[75px]' 
                          : isMarking
                            ? 'h-[80px]' 
                            : 'h-[75px]';

                    const optionBorderClass = 
                      isClothing
                        ? 'border-0'
                        : isMarking
                          ? 'border-0 rounded-xl'
                          : 'border rounded-xl';

                    const selectedClass = 
                      isSelected
                        ? isClothing
                          ? 'bg-amber-50/25 scale-[1.03] z-10'
                          : isMarking
                            ? 'ring-2 ring-[#ea923b] scale-[1.03] shadow-md z-10'
                            : phase === 'overall_build'
                              ? 'border-[#E6B942] bg-amber-50/25 ring-2 ring-[#ea923b] scale-[1.03] shadow-md z-10'
                              : 'border-[#FFB6B3] bg-rose-50/20 ring-2 ring-[#FFB6B3] scale-[1.03] shadow-md z-10'
                        : phase === 'overall_build'
                          ? isClothing
                            ? 'hover:bg-amber-50/10'
                            : isMarking
                              ? 'hover:scale-[1.02]'
                              : 'border border-amber-200/60 hover:border-[#E6B942] hover:bg-amber-50/10'
                          : 'border border-rose-200 hover:border-[#FFB6B3] hover:bg-rose-50/10';

                    return (
                      <motion.div
                        key={item.id}
                        onClick={() => handleItemSelect(item.category, item.id, item)}
                        className={`relative p-1.5 cursor-pointer flex flex-col items-center justify-center bg-transparent select-none transition-all duration-200 ${optionHeightClass} ${optionBorderClass} ${selectedClass}`}
                        style={
                          isMarking
                            ? {
                                backgroundImage: "url('/resources/makeup/make_border1.png')",
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                              }
                            : undefined
                        }
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {/* SVG thumbnail container - borderless, seamless & maximized */}
                        <div className={`w-full h-full flex items-center justify-center overflow-hidden rounded-lg relative z-0 ${
                          activeTab === 'clothing' 
                            ? 'scale-[1.25] -translate-y-[10px]' 
                            : isMarking
                            ? 'scale-[0.63] -translate-y-0.5' 
                            : activeTab === 'eyes'
                            ? 'scale-[0.822] translate-y-0'
                            : activeTab === 'brows'
                            ? 'scale-[1.07]'
                            : 'scale-[1.25]'
                        }`}>
                          {renderThumbnailSvg(item)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. UPPER-RIGHT FLOATING ACTION BUTTON PANEL (Matches mockups custom replay/tip/music icons) */}
      <div className="absolute top-4 right-4 flex flex-col items-center space-y-3.5 z-30" id="right-rail-floating-actions">
        {/* Back to previous page close button */}
        <button
          onClick={onExitToSelection || onPrev}
          className="w-11 h-11 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 bg-transparent border-0 focus:outline-none"
          title="キャラクター選択に戻る"
          id="btn-nav-close-right"
        >
          {closeBtnFailed ? (
            <div className="w-11 h-11 rounded-full bg-[#fca5a5] border-2 border-white text-rose-600 flex items-center justify-center shadow-lg text-lg font-bold">
              ✕
            </div>
          ) : (
            <img 
              src="/resources/close_button.png" 
              alt="キャラクター選択に戻る" 
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setCloseBtnFailed(true)}
              referrerPolicy="no-referrer"
            />
          )}
        </button>

        {/* Replay / Restart Choice Button */}
        <button
          onClick={handleClearItems}

          className="w-11 h-11 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 bg-transparent border-0 focus:outline-none"
          title="初めから"
        >
          {replayImgFailed ? (
            <div className="w-11 h-11 rounded-full bg-[#eea71a] border-2 border-white text-white flex items-center justify-center shadow-lg text-lg font-bold">
              ↻
            </div>
          ) : (
            <img 
              src="/resources/makeup/replay_button.png" 
              alt="初めから" 
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setReplayImgFailed(true)}
              referrerPolicy="no-referrer"
            />
          )}
        </button>

        {/* Dynamic Tip Guide Button */}
        <motion.button
          onClick={() => {
            handleBulbTip();
            setShowHintPage(true);
          }}
          className="w-11 h-11 flex items-center justify-center cursor-pointer bg-transparent border-0 focus:outline-none"
          title="ヒント"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {tipImgFailed ? (
            <div className="w-11 h-11 rounded-full bg-[#fca5a5] border-2 border-white text-rose-600 flex items-center justify-center shadow-lg text-lg font-bold animate-pulse">
              💡
            </div>
          ) : (
            <img 
              src="/resources/makeup/tip_botton.png" 
              alt="ヒント" 
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setTipImgFailed(true)}
              referrerPolicy="no-referrer"
            />
          )}
        </motion.button>

        {/* Ambient background music Toggle Button */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
          }}
          className="w-11 h-11 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 bg-transparent border-0 focus:outline-none"
          title={isMuted ? "音楽を始める" : "音楽を止める"}
        >
          {musicImgFailed ? (
            <div className="w-11 h-11 rounded-full bg-[#eedcbd] border-2 border-white text-amber-800 flex items-center justify-center shadow-lg text-sm font-bold">
              {isMuted ? "🔇" : "🎵"}
            </div>
          ) : (
            <img 
              src={isMuted ? "/resources/makeup/music_off.png" : "/resources/makeup/music_on.png"} 
              alt="音楽" 
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setMusicImgFailed(true)}
              referrerPolicy="no-referrer"
            />
          )}
        </button>
      </div>

      {/* BOTTOM STEP BUTTONS (Positioned relative to #build-container) */}
      {showPrevButton && (
        <div className="absolute bottom-[146px] left-[35%] z-20 pointer-events-none">
          <motion.button
            onClick={handlePrevStep}
            className="pointer-events-auto cursor-pointer bg-transparent border-0 focus:outline-none flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="btn-nav-step-prev"
            title="前のステップ"
          >
            {btnLeftFailed ? (
              <div className="px-5 py-2 rounded-full bg-gradient-to-b from-[#fef08a] to-[#cbd5e1] hover:from-[#f3f4f6] hover:to-[#e5e7eb] border-2 border-rose-300 shadow-lg flex items-center justify-center font-bold font-serif text-sm text-gray-700">
                前のステップ
              </div>
            ) : (
              <img 
                src="/resources/era_selection/button_left.png" 
                alt="前のステップ" 
                className="w-28 h-12 object-contain pointer-events-none"
                onError={() => setBtnLeftFailed(true)}
                referrerPolicy="no-referrer"
              />
            )}
          </motion.button>
        </div>
      )}

      {/* BOTTOM RIGHT: LARGER NAVIGATION IMAGE NEXT-BUTTON (Positioned relative to #build-container) */}
      {!(phase === 'overall_build' && activeTab === 'markings') && (
        <div className="absolute bottom-[146px] right-[-12px] z-20 pointer-events-none">
          <motion.button
            onClick={handleNextStep}
            className="pointer-events-auto cursor-pointer bg-transparent border-0 focus:outline-none flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="btn-nav-step-next"
            title="次へ"
          >
            {btnRightFailed ? (
              <div className="px-5 py-2 rounded-full bg-gradient-to-b from-[#fef08a] to-[#eab308] hover:from-[#fef3c7] hover:to-[#facc15] border-2 border-[#ca8a04] shadow-lg flex items-center justify-center font-bold font-serif text-sm text-[#78350f]">
                次へ
              </div>
            ) : (
              <img 
                src="/resources/era_selection/button_right.png" 
                alt="次へ" 
                className="w-28 h-12 object-contain pointer-events-none"
                onError={() => setBtnRightFailed(true)}
                referrerPolicy="no-referrer"
              />
            )}
          </motion.button>
        </div>
      )}

      {/* SPECIAL COMPLETED MARKINGS PAGE: NEW LARGE SHINY DOWNLOAD BUTTON */}
      <AnimatePresence>
        {phase === 'overall_build' && activeTab === 'markings' && showEndButton && (
          <div className="absolute bottom-[44px] right-[-2px] z-30 pointer-events-none">
            <motion.button
              onClick={handleNextStep}
              className="pointer-events-auto cursor-pointer bg-none border-none focus:outline-none flex items-center justify-center transition-all scale-[0.85]"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 0.85 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 0.92 }}
              whileTap={{ scale: 0.8 }}
              id="btn-nav-step-end"
              title="おしまい"
            >
              {btnEndFailed ? (
                <div className="inset-0 flex items-center justify-center font-bold text-amber-900 bg-gradient-to-b from-[#fbe3b5] to-[#f4be6e] border-2 border-[#d6a54f] rounded-full shadow-lg text-sm px-6 py-2.5 font-serif pointer-events-none">
                  おしまい 🌸
                </div>
              ) : (
                <img 
                  src="/resources/makeup/end_button.png" 
                  alt="おしまい" 
                  className="w-52 h-14 object-contain pointer-events-none hover:brightness-105 transition-all"
                  onError={() => setBtnEndFailed(true)}
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* 5. FULL-SCREEN HINT OVERLAY */}
      <AnimatePresence>
        {showHintPage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="absolute -inset-4 z-50 overflow-hidden"
          >
            <HintPageView 
              era={era} 
              currentState={currentState} 
              onClose={() => setShowHintPage(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
