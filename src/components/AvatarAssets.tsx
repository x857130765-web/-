import React from 'react';
import { DressUpItem, SVGItemProps } from '../types';

// Asset lists grouped by category, containing interactive SVG layers
// Helper names for the 23 classical eyebrows to make them look authentic and gorgeous
const BROW_NAMES = [
  '远山黛眉', '柳叶纤眉', '小山平眉', '芙蓉娟眉', '抚形广眉',
  '新月柔眉', '倒晕仙眉', '垂珠淡眉', '双叶细眉', '鸳鸯春眉',
  '羽扇奇眉', '分梢楚眉', '秋水弯眉', '一字黛眉', '三叶娟眉',
  '蛾蝶翠眉', '半碧新眉', '轻丝烟眉', '画阁愁眉', '玉阶清眉',
  '弄潮秀眉', '垂柳柔眉', '惊鹊飞眉'
];

export const BROWS_ASSETS: DressUpItem[] = [
  {
    id: 'brows_none',
    name: '原生眉',
    description: '保留图片里精致秀丽的原生眉毛。',
    category: 'brows',
    visualSvg: () => null,
  },
  ...BROW_NAMES.map((name, index) => {
    const num = index + 1;
    const imgName = `mayu${num}`;
    return {
      id: `brows_${imgName}`,
      name: `${name}`,
      description: `精美古典黛眉造型（${imgName}.png）`,
      category: 'brows' as const,
      imagePath: `/resources/makeup/mayu/${imgName}.png`,
      visualSvg: () => {
        const isMayu18 = imgName === 'mayu18';
        const isMayu23 = imgName === 'mayu23';
        const isMayu22 = imgName === 'mayu22';
        const isInLastTwoRows = num >= 16;
        
        let xVal = "0";
        let yVal = "42";
        let widthVal = "119";
        let heightVal = "26";

        if (isInLastTwoRows) {
          if (isMayu18) {
            xVal = "6";
            yVal = "37"; // moved up 4px as requested
            widthVal = "107"; // 119 * 0.9 = 107
            heightVal = "23"; // 26 * 0.9 = 23
          } else if (isMayu23) {
            xVal = "0";
            yVal = "48"; // moved up additional 5px as requested
            widthVal = "118"; // 131 * 0.9 = 118
            heightVal = "26"; // 29 * 0.9 = 26
          } else if (isMayu22) {
            xVal = "9";
            yVal = "34"; // 29 + 5 = 34
            widthVal = "100"; // 118 * 0.85 = 100
            heightVal = "22"; // 26 * 0.85 = 22
          } else {
            xVal = "0";
            yVal = "34"; // 29 + 5 = 34
            widthVal = "118"; // 131 * 0.9 = 118
            heightVal = "26"; // 29 * 0.9 = 26
          }
        } else {
          // Rows 1-4
          if (isMayu18) {
            xVal = "0";
            yVal = "51";
            widthVal = "119";
            heightVal = "26";
          } else if (isMayu23) {
            xVal = "-6";
            yVal = "51";
            widthVal = "131";
            heightVal = "29";
          } else if (isMayu22) {
            xVal = "4";
            yVal = "44";
            widthVal = "111"; // 131 * 0.85 = 111
            heightVal = "25"; // 29 * 0.85 = 25
          } else {
            xVal = "-6";
            yVal = "44"; // was 41, all eyebrows move down 3px
            widthVal = "131";
            heightVal = "29";
          }
        }

        return (
          <image
            href={`/resources/makeup/mayu/${imgName}.png`}
            x={xVal}
            y={yVal}
            width={widthVal}
            height={heightVal}
            referrerPolicy="no-referrer"
          />
        );
      }
    };
  })
];

export const EYES_ASSETS: DressUpItem[] = [
  {
    id: 'eyes_none',
    name: '原生眼',
    description: '保留图片里灵动可爱的原生眼妆。',
    category: 'eyes',
    visualSvg: () => null,
  },
  {
    id: 'eyes_eye1',
    name: '流光溢彩',
    description: '灵动可爱的古风眼饰 (eye shadow.png)',
    category: 'eyes',
    imagePath: '/resources/makeup/eye/eye shadow.png',
    visualSvg: (props?: SVGItemProps) => (
      <image
        href={(props && props.isThumbnail) ? "/resources/makeup/eye/eye1.png" : "/resources/makeup/eye/eye shadow.png"}
        x={(props && props.isThumbnail) ? "8.25" : "15.3"}
        y={(props && props.isThumbnail) ? "56.25" : "55.6"}
        width={(props && props.isThumbnail) ? "103.5" : "89.4"}
        height={(props && props.isThumbnail) ? "34.5" : "29.8"}
        referrerPolicy="no-referrer"
      />
    ),
  },
  {
    id: 'eyes_eye2',
    name: '醉梦繁星',
    description: '娇媚动人的温婉眼妆 (eye2.png)',
    category: 'eyes',
    imagePath: '/resources/makeup/eye/eye2.png',
    visualSvg: (props?: SVGItemProps) => (
      <image
        href={(props && props.isThumbnail) ? "/resources/makeup/eye/eye2.png" : "/resources/makeup/eye/eyeline.png"}
        x={(props && props.isThumbnail) ? "29.525" : "30.4925"}
        y={(props && props.isThumbnail) ? "61.15" : "63.666"}
        width={(props && props.isThumbnail) ? "60.95" : "59.015"}
        height={(props && props.isThumbnail) ? "20.7" : "19.668"}
        referrerPolicy="no-referrer"
      />
    ),
  },
  {
    id: 'eyes_eye3',
    name: '清雅国风',
    description: '清雅大方的东方眼妆 (eye3.png)',
    category: 'eyes',
    imagePath: '/resources/makeup/eye/eye3.png',
    visualSvg: (props?: SVGItemProps) => (
      <image
        href={(props && props.isThumbnail) ? "/resources/makeup/eye/eye3.png" : "/resources/makeup/eye/eye3-1.png"}
        x="30.85"
        y="63.6"
        width="58.3"
        height="19.8"
        referrerPolicy="no-referrer"
      />
    ),
  },
];

export const LIPS_ASSETS: DressUpItem[] = [
  {
    id: 'lips_none',
    name: '原生唇',
    description: '保留外貌中娇红温润的原生唇瓣。',
    category: 'lips',
    visualSvg: () => null,
  },
  {
    id: 'lips_lip1',
    name: '樱桃红唇',
    description: '经典小巧的樱桃唇形 (lip1.png)',
    category: 'lips',
    imagePath: '/resources/makeup/lips/lip1.png',
    visualSvg: (props?: SVGItemProps) => {
      const isThumb = props && props.isThumbnail;
      return (
        <image
          href="/resources/makeup/lips/lip1.png"
          x={isThumb ? "41" : "40.43"}
          y={isThumb ? "79" : "78.7"}
          width={isThumb ? "38" : "39.14"}
          height={isThumb ? "20" : "20.6"}
          referrerPolicy="no-referrer"
        />
      );
    },
  },
  {
    id: 'lips_lip2',
    name: '粉黛娇唇',
    description: '微翘迷人的温婉唇妆 (lip2.png)',
    category: 'lips',
    imagePath: '/resources/makeup/lips/lip2.png',
    visualSvg: () => (
      <image
        href="/resources/makeup/lips/lip2.png"
        x="41"
        y="79"
        width="38"
        height="20"
        referrerPolicy="no-referrer"
      />
    ),
  },
  {
    id: 'lips_lip3',
    name: '珊瑚朱唇',
    description: '高贵大方的朱砂红吻 (lip3.png)',
    category: 'lips',
    imagePath: '/resources/makeup/lips/lip3.png',
    visualSvg: () => (
      <image
        href="/resources/makeup/lips/lip3.png"
        x="41"
        y="81"
        width="38"
        height="20"
        referrerPolicy="no-referrer"
      />
    ),
  },
  {
    id: 'lips_lip4',
    name: '蜜桃红吻',
    description: '甜美娇嫩的粉樱唇妆 (lip4.png)',
    category: 'lips',
    imagePath: '/resources/makeup/lips/lip4.png',
    visualSvg: () => (
      <image
        href="/resources/makeup/lips/lip4.png"
        x="41"
        y="78"
        width="38"
        height="20"
        referrerPolicy="no-referrer"
      />
    ),
  },
  {
    id: 'lips_lip5',
    name: '赤色烈焰',
    description: '气场全开的复古绛唇 (lip5.png)',
    category: 'lips',
    imagePath: '/resources/makeup/lips/lip5.png',
    visualSvg: () => (
      <image
        href="/resources/makeup/lips/lip5.png"
        x="41"
        y="79"
        width="38"
        height="20"
        referrerPolicy="no-referrer"
      />
    ),
  },
];

export const BLUSH_ASSETS: DressUpItem[] = [
  {
    id: 'blush_none',
    name: '无妆容',
    description: '素净白皙，不施粉黛。',
    category: 'blush',
    visualSvg: () => null,
  },
  {
    id: 'blush_cheek1',
    name: '轻甜幼桃',
    description: '娇羞粉嫩的双颊微红 (cheek1.png)',
    category: 'blush',
    imagePath: '/resources/makeup/cheek/cheek1.png',
    visualSvg: (props) => (
      <g>
        <image
          href="/resources/makeup/cheek/cheek1.png"
          x="24"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
        <image
          href="/resources/makeup/cheek/cheek1.png"
          x="80"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
      </g>
    ),
  },
  {
    id: 'blush_cheek2',
    name: '初熏春樱',
    description: '如沐春风的温暖腮红 (cheek2.png)',
    category: 'blush',
    imagePath: '/resources/makeup/cheek/cheek2.png',
    visualSvg: (props) => (
      <g>
        <image
          href="/resources/makeup/cheek/cheek2.png"
          x="24"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
        <image
          href="/resources/makeup/cheek/cheek2.png"
          x="80"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
      </g>
    ),
  },
  {
    id: 'blush_cheek3',
    name: '凝脂醉霞',
    description: '红晕满面的微醺胭脂妆 (cheek3.png)',
    category: 'blush',
    imagePath: '/resources/makeup/cheek/cheek3.png',
    visualSvg: (props) => (
      <g>
        <image
          href="/resources/makeup/cheek/cheek3.png"
          x="24"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
        <image
          href="/resources/makeup/cheek/cheek3.png"
          x="80"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
      </g>
    ),
  },
  {
    id: 'blush_cheek4',
    name: '娇羞绯红',
    description: '古典端庄的倾城脸红 (cheek4.png)',
    category: 'blush',
    imagePath: '/resources/makeup/cheek/cheek4.png',
    visualSvg: (props) => (
      <g>
        <image
          href="/resources/makeup/cheek/cheek4.png"
          x="24"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
        <image
          href="/resources/makeup/cheek/cheek4.png"
          x="80"
          y="78"
          width="16"
          height="16"
          filter={props?.isThumbnail ? undefined : "url(#blushBlur)"}
          referrerPolicy="no-referrer"
        />
      </g>
    ),
  },
];

export const MARKINGS_ASSETS: DressUpItem[] = [
  {
    id: 'markings_none',
    name: '无装饰',
    description: '素雅自然，不着花钿。',
    category: 'markings',
    visualSvg: () => null,
  },
  ...Array.from({ length: 16 }, (_, i) => {
    const num = i + 1;
    return {
      id: `markings_hana${num}`,
      name: `花钿 ${num}`,
      description: `华美古典面饰款式 ${num} (hana${num}.png)`,
      category: 'markings' as const,
      imagePath: `/resources/makeup/flower/hana${num}.png`,
      visualSvg: (props?: SVGItemProps) => {
        const isThumb = props && props.isThumbnail;
        const isHana10Or11 = num === 10 || num === 11;
        
        let hX = "51";
        let hY = "34";
        let hW = "18";
        let hH = "18";

        if (isHana10Or11) {
          hX = "85";
          hY = "62";
          hW = "22";
          hH = "22";
        } else if (num === 1 || num === 2) {
          if (!isThumb) {
            hX = "71"; // Shifted 20px right
            hY = "16"; // Shifted 18px up (moved up another 3px)
          }
        }

        return (
          <image
            href={`/resources/makeup/flower/hana${num}.png`}
            x={hX}
            y={hY}
            width={hW}
            height={hH}
            referrerPolicy="no-referrer"
          />
        );
      },
    };
  })
];

export const HAIR_ASSETS: DressUpItem[] = [
  ...Array.from({ length: 7 }, (_, i) => {
    const num = i + 1;
    const pathSuffix = (num === 2 || num === 3) ? "-1.png" : ".png";
    const imgUrl = `/resources/makeup/hair/hair${num}${pathSuffix}`;

    return {
      id: `hair_${num}`,
      name: `发型 ${num}`,
      description: `上品复古华贵发型款式 ${num} (hair${num}.png)`,
      category: 'hair' as const,
      imagePath: imgUrl,
      visualSvg: (props?: SVGItemProps) => {
        const isThumb = props && props.isThumbnail;

        // Default dimensions
        let hX = -33.6;
        let hY = -168.0;
        let hW = 187.2;
        let hH = 390.0;

        let hrefUrl = imgUrl;

        if (isThumb) {
          if (num === 2 || num === 3) {
            hrefUrl = `/resources/makeup/hair/hair${num}.png`;
            hW = 190.5; // Enlarged by another 10% from previous step (totally enlarged 25% from base 150)
            hX = -35.3;  // Perfectly centered horizontally (60 - 190.5/2)
            if (num === 2) {
              hH = 315.0; 
              hY = -142.0; 
            } else if (num === 3) {
              hH = 335.4; 
              hY = -152.0; 
            }
          } else {
            hW = 267.75;
            hX = -73.9; // Centered other thumbnails horizontally (60 - 267.75/2)
            hY = -157.25;
            if (num === 1) {
              hW = 229.6; // Shrunk by another 5% and centered
              hH = 317.8;
              hX = -54.8;
              hY = -132.0;
            }
            if (num === 4) {
              hW = 215.8; // Shrunk by another 5% and centered
              hH = 300.0;
              hX = -47.9;
              hY = -122.5;
            }
            if (num === 5 || num === 6 || num === 7) {
              hW = 241.0;
              hH = 335.1;
              hX = -60.5;
              hY = -168.65;
            }
            if (num !== 1 && num !== 4 && num !== 5 && num !== 6 && num !== 7) {
              hH = 372.3;
            }
          }
        } else {
          // On character, apply bespoke modifications
          if (num === 1) {
            hW = 201.80; // shrunk 2% from 205.92
            hH = 420.42; // shrunk 2% from 429.00
            hX = -39.90; // shifted left 2px extra (from -37.90 to -39.90)
            hY = -169.5; // moved down 2px from -171.5
          } else if (num === 2) {
            hW = 199.66; // enlarged 2% from 195.75
            hH = 415.97; // enlarged 2% from 407.81
            hX = -41.80; // moved left 2px (from -39.80 to -41.80)
            hY = -180.5; // moved down 2px from -182.5
          } else if (num === 3) {
            hW = 192.82; // enlarged 3% from 187.2
            hH = 401.70; // enlarged 3% from 390
            hX = -36.41; // centered and adjusted
            hY = -152.0; // moved up 1px further from -151.0 (requested h3-1 up 1px)
          } else if (num === 4) {
            hW = 192.63; // shrunk 2% from 196.56
            hH = 401.31; // shrunk 2% from 409.5
            hX = -35.32; // centered and adjusted
            hY = -169.79; // shrunk height position
          } else if (num === 5) {
            hW = 196.56;
            hH = 409.5;
            hX = -38.28;
            hY = -182.75;
          } else if (num === 6) {
            hW = 194.07; // shrunk 2% from previous 198.03
            hH = 404.37;
            hX = -38.0; // shifted left 1px (from -37.0 to -38.0)
            hY = -179.0; // moved down 1px from -180.0
          } else if (num === 7) {
            hW = 190.94; 
            hH = 397.80; 
            hX = -35.47; 
            hY = -184.0; // moved up 2px (from -182.0 to -184.0)
          }
        }

        return (
          <image
            href={hrefUrl}
            x={hX.toString()}
            y={hY.toString()}
            width={hW.toString()}
            height={hH.toString()}
            referrerPolicy="no-referrer"
          />
        );
      },
    };
  }),
  {
    id: 'hair_none',
    name: '原生发型',
    description: '保留原图中可爱别致的黑色原生发型。',
    category: 'hair',
    visualSvg: () => null,
  },
];

export const CLOTHING_ASSETS: DressUpItem[] = [
  ...Array.from({ length: 6 }, (_, i) => {
    const num = i + 1;
    let cy = 53;
    if (num === 1) cy = 50; // moved up 3px
    else if (num === 2) cy = 55; // moved down 2px

    return {
      id: `clothing_dress${num}`,
      name: `衣裳 ${num}`,
      description: `精致典雅的古风华服款式 ${num} (dress${num}.png)`,
      category: 'clothing' as const,
      imagePath: `/resources/makeup/cloth/dress${num}.png`,
      visualSvg: (props?: { isThumbnail?: boolean }) => {
        const isThumb = props && props.isThumbnail;
        let cX = "0";
        let cY = cy.toString();
        let cW = "120";
        let cH = isThumb ? "188" : "250";

        if (num === 1 && !isThumb) {
          cX = "-2"; // moved right 1px (-3 + 1)
          cY = "47"; // moved down 1px (from 46 to 47)
          cW = "126";
          cH = "262.5";
        }

        return (
          <image
            href={`/resources/makeup/cloth/dress${num}.png`}
            x={cX}
            y={cY}
            width={cW}
            height={cH}
            style={isThumb ? { height: '188px' } : undefined}
            referrerPolicy="no-referrer"
          />
        );
      },
    };
  }),
  {
    id: 'clothing_none',
    name: '原生衣着',
    description: '保留原图里温婉古典的锁骨姿态。',
    category: 'clothing',
    visualSvg: () => null,
  },
];

export const ACCESSORIES_ASSETS: DressUpItem[] = [
  {
    id: 'acc_none',
    name: '无配饰',
    description: '素净怡然，不挂重器。',
    category: 'accessories',
    visualSvg: () => null,
  },
  {
    id: 'acc_gold_shake',
    name: '九凤金步摇',
    description: '顶端振翅金凤，流苏金坠垂于耳际，步履款款，摇曳生姿。',
    category: 'accessories',
    visualSvg: () => (
      <g>
        {/* Left Side golden hairpin ornament with swaying beads */}
        <path d="M 38 60 Q 30 55 24 64" stroke="#facc15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Tassels dangling beads */}
        <line x1="24" y1="64" x2="21" y2="92" stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="27" y1="64" x2="25" y2="86" stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="21" cy="94" r="1.5" fill="#dc2626" />
        <circle cx="25" cy="88" r="1.2" fill="#3b82f6" />
        <path d="M 30 55 Q 16 48 24 45" stroke="#facc15" strokeWidth="1" fill="none" />

        {/* Right Side golden hairpin ornament with swaying beads */}
        <path d="M 82 60 Q 90 55 96 64" stroke="#facc15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Tassels dangling beads */}
        <line x1="96" y1="64" x2="99" y2="92" stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="93" y1="64" x2="95" y2="86" stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="99" cy="94" r="1.5" fill="#dc2626" />
        <circle cx="95" cy="88" r="1.2" fill="#3b82f6" />
        <path d="M 90 55 Q 104 48 96 45" stroke="#facc15" strokeWidth="1" fill="none" />
      </g>
    ),
  },
  {
    id: 'acc_veil',
    name: '轻纱半遮面纱',
    description: '淡青色半透明丝绸面纱，微风拂动，若隐若现。',
    category: 'accessories',
    visualSvg: () => (
      <g opacity="0.82">
        {/* Hanging mask strings attached on ears */}
        <path d="M 23 98 Q 28 116 60 116 Q 92 116 97 98" stroke="#a5f3fc" strokeWidth="1.2" fill="none" />
        {/* Main translucent hanging veil block (遮面纱) */}
        <path d="M 27 106 C 27 106, 30 148, 40 145 C 50 142, 70 142, 80 145 C 90 148, 93 106, 93 106 Z" fill="#cffafe" stroke="#22d3ee" strokeWidth="0.8" opacity="0.85" />
        {/* Fine gold border */}
        <path d="M 27 106 C 27 106, 30 148, 40 145 C 50 142, 70 142, 80 145 C 90 148, 93 106, 93 106" stroke="#fbbf24" strokeWidth="0.7" fill="none" />
      </g>
    ),
  },
  {
    id: 'acc_fan',
    name: '手执彩绘团扇',
    description: '手捏一柄古典红梅图谱白绸圆扇，流露淑女斯文气质。',
    category: 'accessories',
    visualSvg: () => (
      <g transform="translate(4, -10)" opacity="0.95">
        {/* Fan handle cane */}
        <line x1="88" y1="165" x2="108" y2="235" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        {/* Golden circle wire frame */}
        <circle cx="88" cy="165" r="21" fill="#fcfbf7" stroke="#ca8a04" strokeWidth="1.8" />
        <circle cx="88" cy="165" r="19" fill="none" stroke="#ca8a04" strokeWidth="0.5" />
        {/* Red Plum branches and flowers painted on fan */}
        <path d="M 80 178 Q 88 170 85 158" stroke="#18181b" strokeWidth="1.2" fill="none" />
        <circle cx="85" cy="158" r="2.2" fill="#dc2626" />
        <circle cx="88" cy="161" r="1.5" fill="#dc2626" />
        <circle cx="81" cy="170" r="1.8" fill="#dc2626" />
        <circle cx="92" cy="168" r="1.2" fill="#facc15" /> {/* yellow stamp dot */}
        {/* Hanging red thread tassel at bottom of cane */}
        <path d="M 108 235 L 112 258" stroke="#ca8a04" strokeWidth="1.5" />
        <circle cx="112" cy="260" r="2" fill="#be123c" />
      </g>
    ),
  },
];

// Helper asset arrays for lookups and categorizations
export const CATEGORY_LABELS = {
  brows: '眉毛',
  eyes: '眼睛',
  lips: '唇妆',
  blush: '腮红',
  markings: '花钿',
  hair: '发型',
  clothing: '上装服饰',
  accessories: '手配挂饰',
};

export const ALL_ASSETS_MAP: Record<string, DressUpItem> = {};
const allAssetsList = [
  ...BROWS_ASSETS,
  ...EYES_ASSETS,
  ...LIPS_ASSETS,
  ...BLUSH_ASSETS,
  ...MARKINGS_ASSETS,
  ...HAIR_ASSETS,
  ...CLOTHING_ASSETS,
  ...ACCESSORIES_ASSETS,
];

allAssetsList.forEach((item) => {
  ALL_ASSETS_MAP[item.id] = item;
});

// Chibi Manequin Base structure SVG
export const AvatarMannequin: React.FC<{
  state: {
    brows: string;
    eyes: string;
    lips: string;
    blush: string;
    markings: string;
    hair: string;
    clothing: string;
    accessories: string;
  };
  showBackHairOnly?: boolean;
  useImageCharacter?: boolean;
}> = ({ state, useImageCharacter }) => {
  const getAssetSvg = (id: string) => {
    const item = ALL_ASSETS_MAP[id];
    return item ? item.visualSvg({}) : null;
  };

  return (
    <svg
      id="avatar-canvas-svg"
      viewBox="0 0 120 250"
      className="w-full h-full drop-shadow-xl overflow-visible"
      style={{ overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients and Filters */}
        <linearGradient id="bodySkin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#ffe4e6" />
        </linearGradient>
        <radialGradient id="faceColor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff5f5" />
          <stop offset="100%" stopColor="#fecdd3" />
        </radialGradient>
        <filter id="shadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" />
        </filter>
        <filter id="blushBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* 1. Underlying Back Hair Layer if hair style has a separate back layer */}
      {state.hair === 'hair_2' && (
        <image 
          href="/resources/makeup/hair/hair2-2.png"
          x="-40.28" 
          y="-68.0" 
          width="196.56" 
          height="409.5" 
          referrerPolicy="no-referrer"
        />
      )}
      {state.hair === 'hair_3' && (
        <image 
          href="/resources/makeup/hair/hair3-2.png"
          x="-33.6" 
          y="-45.0" // moved up 2px (from -43.0 to -45.0)
          width="187.2" 
          height="390.0" 
          referrerPolicy="no-referrer"
        />
      )}

      {/* 2. Character Body Base & Face Outline (either custom high fidelity image or robust fallback vector) */}
      {useImageCharacter ? (
        <image 
          href="/resources/makeup/sta_character.png" 
          x="0" 
          y="0" 
          width="120" 
          height="250" 
          referrerPolicy="no-referrer"
        />
      ) : (
        <>
          {/* 1. Underlying Back Hair Layer if draping */}
          {state.hair === 'hair_drape' && (
            <path d="M 23 80 C 12 110, 10 170, 15 220 L 105 220 C 110 170, 108 110, 97 80 Z" fill="#1d1d20" />
          )}
          {state.hair === 'hair_tang' && (
            <path d="M 25 80 C 15 130, 22 180, 25 210 L 95 210 C 98 180, 105 130, 95 80 Z" fill="#18181b" />
          )}
          {state.hair === 'hair_song' && (
            <path d="M 23 80 C 15 100, 18 170, 20 215 L 100 215 C 102 170, 105 100, 97 80 Z" fill="#18181b" />
          )}

          {/* 2a. Body Silhouette, Arms, Legs & Torso */}
          <g id="body-mannequin">
            {/* Legs and feet */}
            <rect x="42" y="210" width="10" height="35" rx="3" fill="url(#bodySkin)" />
            <rect x="68" y="210" width="10" height="35" rx="3" fill="url(#bodySkin)" />
            <circle cx="47" cy="245" r="5" fill="#fecdd3" />
            <circle cx="73" cy="245" r="5" fill="#fecdd3" />

            {/* Neck */}
            <rect x="52" y="115" width="16" height="20" rx="2" fill="url(#bodySkin)" />
            <path d="M 52 125 Q 60 133 68 125" fill="#fda4af" opacity="0.5" />

            {/* Torso Base */}
            <path d="M 32 135 C 32 135, 34 212, 38 215 L 82 215 C 86 211, 88 135, 88 135 Z" fill="url(#bodySkin)" />

            {/* Left Arm & Elegant Hand fingers pointing out */}
            <path d="M 33 138 C 22 148, 11 155, 14 163 C 17 170, 25 158, 33 148" fill="url(#bodySkin)" stroke="#fda4af" strokeWidth="0.5" />
            <ellipse cx="14" cy="163" rx="2" ry="3.5" fill="url(#bodySkin)" />

            {/* Right Arm & Elegant Hand fingers pointing out */}
            <path d="M 87 138 C 98 148, 109 155, 106 163 C 103 170, 95 158, 87 148" fill="url(#bodySkin)" stroke="#fda4af" strokeWidth="0.5" />
            <ellipse cx="106" cy="163" rx="2" ry="3.5" fill="url(#bodySkin)" />
          </g>

          {/* 2b. Base Face Head, Ears, and Skin Details */}
          <g id="head-base">
            {/* Left ear */}
            <ellipse cx="23" cy="98" rx="4" ry="6.5" transform="rotate(-15, 23, 98)" fill="url(#bodySkin)" />
            <path d="M 23 95 Q 25 98 23 101" stroke="#fecdd3" strokeWidth="1" fill="none" />
            
            {/* Right ear */}
            <ellipse cx="97" cy="98" rx="4" ry="6.5" transform="rotate(15, 97, 98)" fill="url(#bodySkin)" />
            <path d="M 97 95 Q 95 98 97 101" stroke="#fecdd3" strokeWidth="1" fill="none" />

            {/* Face circle-polygon */}
            <path
              d="M 23 85 C 23 55, 97 55, 97 85 C 97 115, 87 132, 60 132 C 33 132, 23 115, 23 85 Z"
              fill="url(#faceColor)"
              stroke="#fca5a5"
              strokeWidth="0.5"
            />

            {/* Tiny nose */}
            <path d="M 58 102 Q 60 104 62 102" stroke="#fda4af" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        </>
      )}

      {/* 4. Layer: Blush & Cheeks */}
      <g id="layer-blush">{getAssetSvg(state.blush)}</g>

      {/* 5. Layer: Forehead Markings/Flower Stamp (花钿) */}
      <g id="layer-markings">
        {state.markings.split(',')
          .filter((id) => id !== 'markings_hana1' && id !== 'markings_hana2')
          .map((partId) => {
            const element = getAssetSvg(partId);
            return element ? <React.Fragment key={partId}>{element}</React.Fragment> : null;
          })}
      </g>

      {/* 6. Layer: Eyebrows */}
      <g id="layer-brows">{getAssetSvg(state.brows)}</g>

      {/* 7. Layer: Eyes */}
      <g id="layer-eyes">{getAssetSvg(state.eyes)}</g>

      {/* 8. Layer: Lips/Mouth */}
      <g id="layer-lips">{getAssetSvg(state.lips)}</g>

      {/* 9. Layer: Clothing Base + Chosen Outfits (Covers Torso) */}
      <g id="layer-clothing">{getAssetSvg(state.clothing)}</g>

      {/* 10. Layer: Hair Structure Over Face (Buns, front wigs, side frames) */}
      <g id="layer-hair">
        {state.hair === 'hair_drape' && (
          <g>
            <path d="M 23 80 C 23 45, 97 45, 97 80 Z" fill="#18181b" />
            <path d="M 23 80 Q 40 55 60 80" stroke="#27272a" strokeWidth="1" fill="none" />
            <path d="M 97 80 Q 80 55 60 80" stroke="#27272a" strokeWidth="1" fill="none" />
            {/* Front bangs */}
            <path d="M 23 80 Q 28 95 24 105 M 97 80 Q 92 95 96 105" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}
        {state.hair === 'hair_tang' && (
          <g>
            <path d="M 23 80 C 23 52, 97 52, 97 80 Z" fill="#18181b" />
            <path d="M 40 55 C 30 10, 90 10, 80 55 Z" fill="#111827" />
            <path d="M 45 48 C 45 28, 75 28, 75 48" stroke="#374151" strokeWidth="2" fill="none" />
            <path d="M 38 54 Q 60 52 82 54" stroke="#dc2626" strokeWidth="2.2" fill="none" />
            <path d="M 23 78 Q 28 92 25 105 M 97 78 Q 92 92 95 105" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        )}
        {state.hair === 'hair_qing' && (
          <g>
            <path d="M 23 80 C 20 53, 100 53, 97 80 Z" fill="#18181b" />
            <path d="M 12 52 C 22 42, 35 44, 60 48 C 85 44, 98 42, 108 52 C 118 62, 120 40, 104 22 C 85 14, 35 14, 16 22 C 0 40, 2 62, 12 52 Z" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
            <path d="M 42 45 L 78 45" stroke="#27272a" strokeWidth="3" />
            <circle cx="60" cy="30" r="6" fill="#e11d48" />
            <circle cx="56" cy="27" r="4" fill="#f43f5e" />
            <circle cx="64" cy="27" r="4" fill="#f43f5e" />
            <circle cx="55" cy="33" r="4" fill="#f43f5e" />
            <circle cx="65" cy="33" r="4" fill="#f43f5e" />
            <circle cx="60" cy="35" r="4" fill="#f43f5e" />
            <circle cx="60" cy="30" r="1.8" fill="#facc15" />
            <circle cx="34" cy="33" r="3" fill="#3b82f6" />
            <circle cx="86" cy="33" r="3" fill="#3b82f6" />
            <circle cx="34" cy="33" r="1" fill="#facc15" />
            <circle cx="86" cy="33" r="1" fill="#facc15" />
            <path d="M 22 41 L 22 68" stroke="#facc15" strokeWidth="1.2" strokeDasharray="2 1" />
            <circle cx="22" cy="70" r="2" fill="#e11d48" />
            <path d="M 98 41 L 98 68" stroke="#facc15" strokeWidth="1.2" strokeDasharray="2 1" />
            <circle cx="98" cy="70" r="2" fill="#e11d48" />
          </g>
        )}
        {state.hair === 'hair_song' && (
          <g>
            <path d="M 23 80 C 23 48, 97 48, 97 80 Z" fill="#18181b" />
            <path d="M 23 70 C 5 60, 4 40, 21 55 C 23 60, 25 70, 23 75" fill="none" stroke="#18181b" strokeWidth="8" strokeLinecap="round" />
            <path d="M 23 70 C 5 60, 4 40, 21 55 C 23 60, 25 70, 23 75" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" />
            <path d="M 97 70 C 115 60, 116 40, 99 55 C 97 60, 95 70, 97 75" fill="none" stroke="#18181b" strokeWidth="8" strokeLinecap="round" />
            <path d="M 97 70 C 115 60, 116 40, 99 55 C 97 60, 95 70, 97 75" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" />
            <path d="M 12 62 Q 8 68 6 74" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            <path d="M 14 62 Q 13 70 14 77" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            <circle cx="16" cy="62" r="3" fill="#dc2626" />
            <path d="M 108 62 Q 112 68 114 74" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            <path d="M 106 62 Q 107 70 106 77" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            <circle cx="104" cy="62" r="3" fill="#dc2626" />
          </g>
        )}
        {getAssetSvg(state.hair)}
      </g>

      {/* 10.5. Layer: Over-hair Markings (specifically markings_hana1 and markings_hana2) */}
      <g id="layer-overhair-markings">
        {state.markings.split(',')
          .filter((id) => id === 'markings_hana1' || id === 'markings_hana2')
          .map((partId) => {
            const element = getAssetSvg(partId);
            return element ? <React.Fragment key={partId}>{element}</React.Fragment> : null;
          })}
      </g>

      {/* 11. Layer: Accessories (Hairpin, Earrings, Hand items) */}
      <g id="layer-accessories">{getAssetSvg(state.accessories)}</g>
    </svg>
  );
};
