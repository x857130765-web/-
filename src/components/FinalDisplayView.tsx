/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AvatarState } from '../types';
import { AvatarMannequin } from './AvatarAssets';

interface FinalDisplayViewProps {
  currentState: AvatarState;
  onHome: () => void;
  onRestart: () => void; // Connects back to customization view
}

interface BgOption {
  id: string;
  name: string;
  imagePath: string;
  buttonPath: string;
  glowColor: string;
  textColor: string;
}

const BG_OPTIONS: BgOption[] = [
  {
    id: 'down_back1',
    name: '背景画像1',
    imagePath: '/resources/down_back1.png',
    buttonPath: '/resources/back1_button.png',
    glowColor: 'border-rose-400',
    textColor: 'text-rose-700',
  },
  {
    id: 'down_back2',
    name: '背景画像2',
    imagePath: '/resources/down_back2.png',
    buttonPath: '/resources/back2_button.png',
    glowColor: 'border-yellow-400',
    textColor: 'text-yellow-700',
  },
  {
    id: 'down_back3',
    name: '背景画像3',
    imagePath: '/resources/down_back3.png',
    buttonPath: '/resources/back3_button.png',
    glowColor: 'border-blue-400',
    textColor: 'text-blue-700',
  }
];

// Helper to load images safely with canvas context
const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

export const FinalDisplayView: React.FC<FinalDisplayViewProps> = ({
  currentState,
  onHome,
  onRestart,
}) => {
  const [selectedBg, setSelectedBg] = useState<BgOption>(BG_OPTIONS[0]);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downBtnFailed, setDownBtnFailed] = useState<boolean>(false);

  // High-fidelity Multi-layer Canvas Composite Drawing
  const handleDownloadImage = async () => {
    try {
      setIsExporting(true);

      const bgSrc = selectedBg.imagePath;
      const charSrc = "/resources/makeup/sta_character.png";

      const blushNum = currentState.blush && currentState.blush.startsWith('blush_cheek') 
        ? currentState.blush.replace('blush_cheek', '') 
        : '';
      const blushSrc = blushNum ? `/resources/makeup/cheek/cheek${blushNum}.png` : '';

      const markingsList = currentState.markings 
        ? currentState.markings.split(',').filter(id => id.startsWith('markings_hana'))
        : [];

      const markingsPromises = markingsList.map(async (markingId) => {
        const num = markingId.replace('markings_hana', '');
        const img = await loadImage(`/resources/makeup/flower/hana${num}.png`);
        return { id: markingId, img };
      });
      const loadedMarkingsList = await Promise.all(markingsPromises);
      const markingsImgMap = Object.fromEntries(
        loadedMarkingsList.map(item => [item.id, item.img])
      );

      const eyesNum = currentState.eyes && currentState.eyes.startsWith('eyes_eye') 
        ? currentState.eyes.replace('eyes_eye', '') 
        : '';
      const eyesSrc = eyesNum === '1'
        ? '/resources/makeup/eye/eye shadow.png'
        : eyesNum === '2' 
        ? '/resources/makeup/eye/eyeline.png'
        : eyesNum === '3' 
        ? '/resources/makeup/eye/eye3-1.png'
        : eyesNum 
        ? `/resources/makeup/eye/eye${eyesNum}.png` 
        : '';

      const browsNum = currentState.brows && currentState.brows.startsWith('brows_mayu') 
        ? currentState.brows.replace('brows_mayu', '') 
        : '';
      const browsSrc = browsNum ? `/resources/makeup/mayu/mayu${browsNum}.png` : '';

      const lipsNum = currentState.lips && currentState.lips.startsWith('lips_lip') 
        ? currentState.lips.replace('lips_lip', '') 
        : '';
      const lipsSrc = lipsNum ? `/resources/makeup/lips/lip${lipsNum}.png` : '';

      const clothingNum = currentState.clothing && currentState.clothing.startsWith('clothing_dress') 
        ? currentState.clothing.replace('clothing_dress', '') 
        : '';
      const clothingSrc = clothingNum ? `/resources/makeup/cloth/dress${clothingNum}.png` : '';

      const hairNum = currentState.hair && currentState.hair.startsWith('hair_') 
        ? currentState.hair.replace('hair_', '') 
        : '';
      
      const hairSrc = (hairNum === '2' || hairNum === '3')
        ? `/resources/makeup/hair/hair${hairNum}-1.png`
        : hairNum 
        ? `/resources/makeup/hair/hair${hairNum}.png` 
        : '';

      const hairBackSrc = (hairNum === '2' || hairNum === '3')
        ? `/resources/makeup/hair/hair${hairNum}-2.png`
        : '';

      // Load all required assets in parallel
      const [
        bgImg,
        charImg,
        blushImg,
        eyesImg,
        browsImg,
        lipsImg,
        clothingImg,
        hairImg,
        hairBackImg
      ] = await Promise.all([
        loadImage(bgSrc),
        loadImage(charSrc),
        blushSrc ? loadImage(blushSrc) : Promise.resolve(null),
        eyesSrc ? loadImage(eyesSrc) : Promise.resolve(null),
        browsSrc ? loadImage(browsSrc) : Promise.resolve(null),
        lipsSrc ? loadImage(lipsSrc) : Promise.resolve(null),
        clothingSrc ? loadImage(clothingSrc) : Promise.resolve(null),
        hairSrc ? loadImage(hairSrc) : Promise.resolve(null),
        hairBackSrc ? loadImage(hairBackSrc) : Promise.resolve(null),
      ]);

      if (!bgImg) {
        setIsExporting(false);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      const naturalWidth = bgImg.naturalWidth || 450;
      const naturalHeight = bgImg.naturalHeight || 700;

      // 900px height for exquisite resolution
      const targetHeight = 900;
      canvas.height = targetHeight;
      canvas.width = Math.round(naturalWidth * (targetHeight / naturalHeight));

      // Draw poster background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Character rendering metrics (derived from same proportions as step previews - shrunk to 70%)
      const charHeight = Math.round(canvas.height * 0.70);
      const charWidth = Math.round(charHeight * (120 / 250));
      const charX = Math.round((canvas.width - charWidth) / 2);
      const charY = Math.round((canvas.height - charHeight) / 2 + charHeight * 0.12);

      const scaleX = charWidth / 120;
      const scaleY = charHeight / 250;

      const drawLayer = (img: HTMLImageElement | null, rx: number, ry: number, rw: number, rh: number) => {
        if (!img) return;

        // Get the natural aspect ratio of the image
        const nw = img.naturalWidth || img.width || rw;
        const nh = img.naturalHeight || img.height || rh;
        const imgRatio = nw / nh;

        // Target aspect ratio of the assigned bounding box
        const targetRatio = rw / rh;

        let finalRx = rx;
        let finalRy = ry;
        let finalRw = rw;
        let finalRh = rh;

        // Emulate preserveAspectRatio="xMidYMid meet"
        if (imgRatio > targetRatio) {
          finalRw = rw;
          finalRh = rw / imgRatio;
          finalRx = rx;
          finalRy = ry + (rh - finalRh) / 2;
        } else {
          finalRh = rh;
          finalRw = rh * imgRatio;
          finalRx = rx + (rw - finalRw) / 2;
          finalRy = ry;
        }

        // Convert to scaled canvas space coordinates
        const cx = Math.round(charX + finalRx * scaleX);
        const cy = Math.round(charY + finalRy * scaleY);
        const cw = Math.round(finalRw * scaleX);
        const ch = Math.round(finalRh * scaleY);

        ctx.drawImage(img, cx, cy, cw, ch);
      };

      const drawPath = (pathStr: string, fill: string, stroke?: string, strokeWidth?: number, strokeDash?: number[]) => {
        const path = new Path2D(pathStr);
        ctx.save();
        ctx.translate(charX, charY);
        ctx.scale(scaleX, scaleY);
        if (fill && fill !== 'none') {
          ctx.fillStyle = fill;
          ctx.fill(path);
        }
        if (stroke && stroke !== 'none') {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth || 1;
          if (strokeDash) {
            ctx.setLineDash(strokeDash);
          }
          ctx.stroke(path);
        }
        ctx.restore();
      };

      const drawCircle = (cx: number, cy: number, r: number, fill: string, stroke?: string, strokeWidth?: number) => {
        ctx.save();
        ctx.translate(charX, charY);
        ctx.scale(scaleX, scaleY);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        if (fill && fill !== 'none') {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke && stroke !== 'none') {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth || 1;
          ctx.stroke();
        }
        ctx.restore();
      };

      const drawLine = (x1: number, y1: number, x2: number, y2: number, stroke: string, strokeWidth: number, strokeDash?: number[]) => {
        ctx.save();
        ctx.translate(charX, charY);
        ctx.scale(scaleX, scaleY);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        if (strokeDash) {
          ctx.setLineDash(strokeDash);
        }
        ctx.stroke();
      };

      // Composite avatar sequentially to preserve layering stack
      // 1. Underlying Back Hair Layer (either vector or image-based)
      if (currentState.hair === 'hair_drape') {
        drawPath("M 23 80 C 12 110, 10 170, 15 220 L 105 220 C 110 170, 108 110, 97 80 Z", "#1d1d20");
      } else if (currentState.hair === 'hair_tang') {
        drawPath("M 25 80 C 15 130, 22 180, 25 210 L 95 210 C 98 180, 105 130, 95 80 Z", "#18181b");
      } else if (currentState.hair === 'hair_song') {
        drawPath("M 23 80 C 15 100, 18 170, 20 215 L 100 215 C 102 170, 105 100, 97 80 Z", "#18181b");
      } else if (hairBackImg) {
        let hY2 = -18.0;
        let hX2 = -33.6;
        let hW2 = 187.2;
        let hH2 = 390.0;
        const hairNumVal = parseInt(hairNum, 10);
        if (hairNumVal === 2) {
          hY2 = -68.0;
          hX2 = -40.28; // shifted left 2px to match AvatarAssets
          hW2 = 196.56;
          hH2 = 409.5;
        } else if (hairNumVal === 3) {
          hY2 = -45.0; // matched hair3-2 move up 2px
        }
        drawLayer(hairBackImg, hX2, hY2, hW2, hH2);
      }

      // 2. Character body silhouette
      if (charImg) {
        drawLayer(charImg, 0, 0, 120, 250);
      }

      // 3. Cheeks blush
      if (blushImg) {
        drawLayer(blushImg, 24, 78, 16, 16);
        drawLayer(blushImg, 80, 78, 16, 16);
      }

      // 4. Markings (flower stamp under hair)
      for (const markingId of markingsList) {
        const num = parseInt(markingId.replace('markings_hana', ''), 10);
        if (num === 1 || num === 2) continue; // draw later on top of hair layer
        const markingImg = markingsImgMap[markingId];
        if (markingImg) {
          if (num === 10 || num === 11) {
            drawLayer(markingImg, 85, 62, 22, 22);
          } else {
            drawLayer(markingImg, 51, 34, 18, 18);
          }
        }
      }

      // 5. Eyebrows
      if (browsImg && browsNum) {
        const num = parseInt(browsNum, 10);
        let bx = -6, by = 44, bw = 131, bh = 29;
        if (!isNaN(num) && num >= 16) {
          bx = 0;
          by = num === 23 ? 29 : 34;
          bw = 118;
          bh = 26;
        }
        drawLayer(browsImg, bx, by, bw, bh);
      }

      // 6. Eyes
      if (eyesSrc && eyesImg) {
        const num = parseInt(eyesNum, 10);
        if (num === 1) {
          drawLayer(eyesImg, 15.3, 55.6, 89.4, 29.8);
        } else if (num === 2) {
          drawLayer(eyesImg, 30.4925, 63.666, 59.015, 19.668);
        } else if (num === 3) {
          drawLayer(eyesImg, 30.85, 63.6, 58.3, 19.8);
        } else {
          drawLayer(eyesImg, 33.5, 64.5, 53, 18);
        }
      }

      // 7. Lips
      if (lipsImg) {
        if (lipsNum === '1') {
          drawLayer(lipsImg, 40.43, 79.7, 39.14, 20.6);
        } else {
          let ly = 76;
          if (lipsNum === '2') ly = 79;
          else if (lipsNum === '3') ly = 81;
          else if (lipsNum === '4') ly = 78;
          else if (lipsNum === '5') ly = 79;
          drawLayer(lipsImg, 41, ly, 38, 20);
        }
      }

      // 8. Clothing
      if (clothingImg) {
        let cy = 53;
        let cx = 0;
        let cw = 120;
        let ch = 250;
        if (clothingNum === '1') {
          cx = -2;
          cy = 47;
          cw = 126;
          ch = 262.5;
        } else if (clothingNum === '2') {
          cy = 55;
        }
        drawLayer(clothingImg, cx, cy, cw, ch);
      }

      // 9. Hair (Both image or vector styles)
      if (currentState.hair === 'hair_drape') {
        drawPath("M 23 80 C 23 45, 97 45, 97 80 Z", "#18181b");
        drawPath("M 23 80 Q 40 55 60 80", "none", "#27272a", 1);
        drawPath("M 97 80 Q 80 55 60 80", "none", "#27272a", 1);
        drawPath("M 23 80 Q 28 95 24 105", "none", "#18181b", 2.5);
        drawPath("M 97 80 Q 92 95 96 105", "none", "#18181b", 2.5);
      } else if (currentState.hair === 'hair_tang') {
        drawPath("M 23 80 C 23 52, 97 52, 97 80 Z", "#18181b");
        drawPath("M 40 55 C 30 10, 90 10, 80 55 Z", "#111827");
        drawPath("M 45 48 C 45 28, 75 28, 75 48", "none", "#374151", 2);
        drawPath("M 38 54 Q 60 52 82 54", "none", "#dc2626", 2.2);
        drawPath("M 23 78 Q 28 92 25 105", "none", "#111827", 2.8);
        drawPath("M 97 78 Q 92 92 95 105", "none", "#111827", 2.8);
      } else if (currentState.hair === 'hair_song') {
        drawPath("M 23 80 C 23 48, 97 48, 97 80 Z", "#18181b");
        drawPath("M 23 70 C 5 60, 4 40, 21 55 C 23 60, 25 70, 23 75", "none", "#18181b", 8);
        drawPath("M 23 70 C 5 60, 4 40, 21 55 C 23 60, 25 70, 23 75", "none", "#2d3748", 2);
        drawPath("M 97 70 C 115 60, 116 40, 99 55 C 97 60, 95 70, 97 75", "none", "#18181b", 8);
        drawPath("M 97 70 C 115 60, 116 40, 99 55 C 97 60, 95 70, 97 75", "none", "#2d3748", 2);
        drawPath("M 12 62 Q 8 68 6 74", "none", "#dc2626", 1.5);
        drawPath("M 14 62 Q 13 70 14 77", "none", "#dc2626", 1.5);
        drawCircle(16, 62, 3, "#dc2626");
        drawPath("M 108 62 Q 112 68 114 74", "none", "#dc2626", 1.5);
        drawPath("M 106 62 Q 107 70 106 77", "none", "#dc2626", 1.5);
        drawCircle(104, 62, 3, "#dc2626");
      } else if (currentState.hair === 'hair_qing') {
        drawPath("M 23 80 C 20 53, 100 53, 97 80 Z", "#18181b");
        drawPath("M 12 52 C 22 42, 35 44, 60 48 C 85 44, 98 42, 108 52 C 118 62, 120 40, 104 22 C 85 14, 35 14, 16 22 C 0 40, 2 62, 12 52 Z", "#09090b", "#27272a", 0.8);
        drawPath("M 42 45 L 78 45", "none", "#27272a", 3);
        drawCircle(60, 30, 6, "#e11d48");
        drawCircle(56, 27, 4, "#f43f5e");
        drawCircle(64, 27, 4, "#f43f5e");
        drawCircle(55, 33, 4, "#f43f5e");
        drawCircle(65, 33, 4, "#f43f5e");
        drawCircle(60, 35, 4, "#f43f5e");
        drawCircle(60, 30, 1.8, "#facc15");
        drawCircle(34, 33, 3, "#3b82f6");
        drawCircle(86, 33, 3, "#3b82f6");
        drawCircle(34, 33, 1, "#facc15");
        drawCircle(86, 33, 1, "#facc15");
        drawLine(22, 41, 22, 68, "#facc15", 1.2, [2, 1]);
        drawCircle(22, 70, 2, "#e11d48");
        drawLine(98, 41, 98, 68, "#facc15", 1.2, [2, 1]);
        drawCircle(98, 70, 2, "#e11d48");
      } else if (hairImg) {
        // Hair wig with customized offset and scaling
        const hairNumVal = parseInt(hairNum, 10);
        let hX = -33.6;
        let hY = -168.0;
        let hW = 187.2;
        let hH = 390.0;

        if (hairNumVal === 1) {
          hW = 201.80; // shrunk 2% from 205.92
          hH = 420.42; // shrunk 2% from 429.00
          hX = -39.90; // shifted left 2px extra (from -37.90 to -39.90)
          hY = -171.5;
        } else if (hairNumVal === 2) {
          hW = 199.66; // enlarged 2% from 195.75
          hH = 415.97; // enlarged 2% from 407.81
          hX = -41.80; // moved left 2px (from -39.80 to -41.80)
          hY = -180.5; // moved down 2px from -182.5
        } else if (hairNumVal === 3) {
          hW = 192.82; // enlarged 3% from 187.2
          hH = 401.70; // enlarged 3% from 390
          hX = -36.41; // centered
          hY = -148.0; // keep y
        } else if (hairNumVal === 4) {
          hW = 192.63; // shrunk 2% from 196.56
          hH = 401.31; // shrunk 2% from 409.5
          hX = -35.32; // centered and adjusted
          hY = -169.79; // shrunk height position
        } else if (hairNumVal === 5) {
          hW = 196.56;
          hH = 409.5;
          hX = -38.28;
          hY = -182.75;
        } else if (hairNumVal === 6) {
          hW = 194.07; // shrunk 2% from previous 198.03
          hH = 404.37;
          hX = -38.0; // shifted left 1px (from -37.0 to -38.0)
          hY = -181.0; // moved down 2px from -183.0
        } else if (hairNumVal === 7) {
          hW = 190.94; 
          hH = 397.80; 
          hX = -35.47;
          hY = -184.0; // moved up 2px (from -182.0 to -184.0)
        }

        drawLayer(hairImg, hX, hY, hW, hH);
      }

      // 10. Render markings hana1 & hana2 over hair
      for (const markingId of markingsList) {
        const num = parseInt(markingId.replace('markings_hana', ''), 10);
        if (num === 1 || num === 2) {
          const markingImg = markingsImgMap[markingId];
          if (markingImg) {
            drawLayer(markingImg, 71, 16, 18, 18); // moved up another 3px (y from 19 to 16)
          }
        }
      }

      // 11. Accessories (Vector-based)
      if (currentState.accessories === 'acc_gold_shake') {
        drawPath("M 38 60 Q 30 55 24 64", "none", "#facc15", 2.2);
        drawLine(24, 64, 21, 92, "#facc15", 1, [3, 2]);
        drawLine(27, 64, 25, 86, "#facc15", 1, [3, 2]);
        drawCircle(21, 94, 1.5, "#dc2626");
        drawCircle(25, 88, 1.2, "#3b82f6");
        drawPath("M 30 55 Q 16 48 24 45", "none", "#facc15", 1);

        drawPath("M 82 60 Q 90 55 96 64", "none", "#facc15", 2.2);
        drawLine(96, 64, 99, 92, "#facc15", 1, [3, 2]);
        drawLine(93, 64, 95, 86, "#facc15", 1, [3, 2]);
        drawCircle(99, 94, 1.5, "#dc2626");
        drawCircle(95, 88, 1.2, "#3b82f6");
        drawPath("M 90 55 Q 104 48 96 45", "none", "#facc15", 1);
      } else if (currentState.accessories === 'acc_veil') {
        drawPath("M 23 98 Q 28 116 60 116 Q 92 116 97 98", "none", "#a5f3fc", 1.2);
        drawPath("M 27 106 C 27 106, 30 148, 40 145 C 50 142, 70 142, 80 145 C 90 148, 93 106, 93 106 Z", "rgba(207, 250, 254, 0.82)", "#22d3ee", 0.8);
        drawPath("M 27 106 C 27 106, 30 148, 40 145 C 50 142, 70 142, 80 145 C 90 148, 93 106, 93 106", "none", "#fbbf24", 0.7);
      } else if (currentState.accessories === 'acc_fan') {
        ctx.save();
        ctx.translate(charX, charY);
        ctx.scale(scaleX, scaleY);
        ctx.translate(4, -10);

        // Fan handle cane
        ctx.beginPath();
        ctx.moveTo(88, 165);
        ctx.lineTo(108, 235);
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Golden circle wire frame
        ctx.beginPath();
        ctx.arc(88, 165, 21, 0, 2 * Math.PI);
        ctx.fillStyle = "#fcfbf7";
        ctx.fill();
        ctx.strokeStyle = "#ca8a04";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Inner circle wire frame
        ctx.beginPath();
        ctx.arc(88, 165, 19, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ca8a04";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Red Plum branches and flowers painted on fan
        const fanBranch = new Path2D("M 80 178 Q 88 170 85 158");
        ctx.strokeStyle = "#18181b";
        ctx.lineWidth = 1.2;
        ctx.stroke(fanBranch);

        ctx.beginPath();
        ctx.arc(85, 158, 2.2, 0, 2 * Math.PI);
        ctx.fillStyle = "#dc2626";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(88, 161, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = "#dc2626";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(81, 170, 1.8, 0, 2 * Math.PI);
        ctx.fillStyle = "#dc2626";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(92, 168, 1.2, 0, 2 * Math.PI);
        ctx.fillStyle = "#facc15";
        ctx.fill();

        // Hanging thread
        ctx.beginPath();
        ctx.moveTo(108, 235);
        ctx.lineTo(112, 258);
        ctx.strokeStyle = "#ca8a04";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(112, 260, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#be123c";
        ctx.fill();

        ctx.restore();
      }

      const pngUrl = canvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.href = pngUrl;
      dlLink.download = `古典留影_韶华国风_${Date.now()}.png`;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3200);

    } catch (err) {
      console.error('Multi-layer canvas generation error:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#FEFAE6] flex flex-col items-center justify-between p-4 select-none font-sans overflow-hidden" id="final-display-container">
      {/* 0. Elegant Header Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10" id="final-header-text">
        <h2 
          className="font-black text-[22px] md:text-[25px] leading-tight tracking-wider text-center whitespace-nowrap"
          style={{
            color: '#f05357',
            fontFamily: '"Trebuchet MS", "Yu Gothic", sans-serif',
            textShadow: '3px 3px 0px #fff, -3px -3px 0px #fff, 3px -3px 0px #fff, -3px 3px 0px #fff, 3px 4px 0px rgba(190,50,50,0.18)'
          }}
        >
          背景画像を選んでね
        </h2>
      </div>

      {/* 1. TOP-LEFT BACK HOME BUTTON (Matches Image 5 yellow home badge) */}
      <button 
        onClick={onHome}
        className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 bg-transparent border-0 focus:outline-none z-20"
        title="ホーム"
        id="btn-final-home"
      >
        <img 
          src="/resources/home_button.png" 
          alt="首页" 
          className="w-full h-full object-contain pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </button>

      {/* 2. TOP-RIGHT CLOSE/CANCEL RESTART BUTTON (Matches Image 5 red circle X) */}
      <button 
        onClick={onRestart}
        className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 bg-transparent border-0 focus:outline-none z-20"
        title="メイクを続ける"
        id="btn-final-restart"
      >
        <img 
          src="/resources/close_button.png" 
          alt="返回上一步" 
          className="w-full h-full object-contain pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </button>

      {/* 3. CENTER SCROLL DISPLAY FRAME */}
      <div 
        className="w-[72%] h-[78%] mt-14 border-4 border-[#855e24]/75 rounded-[24px] relative p-1 bg-white overflow-hidden"
        style={{
          boxShadow: '0 12px 36px rgba(100, 75, 45, 0.2), inset 0 2px 8px rgba(0,0,0,0.1)'
        }}
        id="poster-panel-canvas-bounding"
      >
        {/* Dynamic Inner Background with selected background image */}
        <div className="w-full h-full rounded-[18px] relative overflow-hidden flex items-center justify-center">
          <img 
            src={selectedBg.imagePath} 
            alt={selectedBg.name} 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0" 
            referrerPolicy="no-referrer"
          />

          {/* Glistening sparkles of stars around character */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <span className="absolute top-8 left-1/4 text-white text-lg animate-pulse">✦</span>
            <span className="absolute top-20 right-1/4 text-[#fffbeb] text-[10px] animate-pulse delay-700">✦</span>
            <span className="absolute bottom-40 left-12 text-[#fffbeb] text-sm animate-pulse delay-200">✦</span>
            <span className="absolute bottom-32 right-12 text-white text-base animate-pulse delay-500">✦</span>
          </div>

          {/* Fully customized dynamic avatar rendered here */}
          <div className="w-[70%] h-[70%] flex items-center justify-center p-2 relative z-10 translate-y-[12%]">
            <AvatarMannequin state={currentState} useImageCharacter={true} />
          </div>
        </div>
      </div>

      {/* 4. RIGHT SIDE: VERTICAL CARD BG SWATCHES LIST (Matches the 2 vertical side cards of Image 5) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col space-y-4 z-15" id="bg-swatches-column text-right">
        {BG_OPTIONS.map((bg) => {
          const isSelected = selectedBg.id === bg.id;
          return (
            <motion.button
              key={bg.id}
              onClick={() => setSelectedBg(bg)}
              className={`w-[68px] h-[68px] cursor-pointer flex flex-col items-center justify-center transition-all bg-transparent relative border-0 outline-none focus:outline-none ${
                isSelected ? 'scale-110 drop-shadow-lg filter brightness-105' : 'opacity-85 hover:opacity-100'
              }`}
              style={{
                backgroundImage: `url(${bg.buttonPath})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title={bg.name}
            >
              {/* Optional tiny indicator ring to make selection fully distinct */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-[#ea923b] rounded-2xl pointer-events-none animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 5. BOTTOM-RIGHT: DOWNLOAD BANNER GOLD BUTTON WITH CANVAS INTEGRATION (Exactly as Image 5) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
        <motion.button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className={`pointer-events-auto cursor-pointer w-12 h-12 flex items-center justify-center transition-all bg-transparent border-0 focus:outline-none ${
            isExporting ? 'opacity-80 cursor-wait' : ''
          }`}
          whileHover={isExporting ? {} : { scale: 1.1 }}
          whileTap={isExporting ? {} : { scale: 0.9 }}
          title="ダウンロード"
          id="btn-final-download"
        >
          {isExporting ? (
            <span className="text-[14px] font-bold font-serif leading-none animate-spin text-amber-800">⟳</span>
          ) : downBtnFailed ? (
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#fbe3b5] to-[#f4be6e] border border-[#d6a54f] flex items-center justify-center shadow-lg font-bold text-amber-900 font-serif text-xs">
              存
            </div>
          ) : (
            <img 
              src="/resources/down_button.png" 
              alt="下载" 
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setDownBtnFailed(true)}
              referrerPolicy="no-referrer"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
};
