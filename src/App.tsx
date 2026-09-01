import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { Dices, Undo2, History as HistoryIcon, Plus, X, Trash2, Settings2, Sparkles, Shuffle, Maximize, Minimize, Code2, Lock, Unlock, Copy, Check, LayoutGrid, Palette, Layers, Play, Pause, Wand2 , Cloud, MoveDiagonal, Sun, Columns, PauseCircle, Wind, Waves, Zap, Droplets, Eye, Github, Info } from 'lucide-react';

const PopoverColorPicker = ({ color, onChange, isLocked, onToggleLock, title, isLightBg, placement = 'top' }: { color: string, onChange: (c: string) => void, isLocked: boolean, onToggleLock: () => void, isLightBg: boolean, title?: string, placement?: 'top' | 'bottom', key?: React.Key }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => { setHexInput(color); }, [color]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0 flex items-center justify-center" ref={popoverRef}>
      <button
        type="button"
        title={title}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-8 h-8 rounded-full border-[3px] shadow-sm cursor-pointer transition-all duration-200 ease-out outline-none ${isOpen ? 'scale-110 border-white ring-2 ring-white/50 ring-offset-1 ring-offset-transparent z-10' : 'border-white/60 hover:scale-110 hover:border-white hover:shadow-md z-0'}`}
        style={{ backgroundColor: color }}
      >
        {isLocked && <div className="absolute inset-0 flex items-center justify-center"><Lock className="w-4 h-4 text-white drop-shadow-md mix-blend-difference" /></div>}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 10 : -10 }}
            className={`absolute z-50 ${placement === 'top' ? 'bottom-full mb-4' : 'top-full mt-4'} left-1/2 -translate-x-1/2`}
          >
            <div className="p-3 backdrop-blur-2xl rounded-2xl shadow-2xl border flex flex-col gap-3 dyn-panel">
                <HexColorPicker color={color} onChange={onChange} />
                <div className="flex items-center gap-2">
                  <input 
                    value={hexInput} 
                    onChange={(e) => { 
                      setHexInput(e.target.value); 
                      if(/^#[0-9A-F]{6}$/i.test(e.target.value)) onChange(e.target.value); 
                    }} 
                    className="w-full rounded-lg px-2 py-1.5 text-xs outline-none font-mono text-center border dyn-border dyn-divider dyn-text" 
                  />
                  <button 
                    onClick={onToggleLock} 
                    className={`p-1.5 rounded-lg transition-colors dyn-panel-hover ${isLocked ? 'bg-indigo-500/20 text-indigo-500' : 'dyn-divider dyn-text-muted'}`}
                    title={isLocked ? "Unlock color" : "Lock color"}
                  >
                    {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getLuminance = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16); let g = parseInt(hex.slice(3, 5), 16); let b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100; const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
};

const PRESETS = [
  { id: 'aurora', name: 'Aurora Borealis', config: { baseBg: '#020617', blobColors: ['#0d9488', '#8b5cf6'], motionStyle: 'flow', composition: 'diagonal' } },
  { id: 'ethereal', name: 'Ethereal Pearl', config: { baseBg: '#fdfcfb', blobColors: ['#fbcfe8', '#bfdbfe'], motionStyle: 'calm', composition: 'soft-cloud' } },
  { id: 'midnight', name: 'Midnight Velvet', config: { baseBg: '#1e1b4b', blobColors: ['#831843', '#4c1d95'], motionStyle: 'flow', composition: 'spotlight' } },
  { id: 'ocean', name: 'Ocean Whisper', config: { baseBg: '#f0f9ff', blobColors: ['#bae6fd', '#93c5fd', '#86efac'], motionStyle: 'flow', composition: 'split' } },
  { id: 'obsidian', name: 'Obsidian Glass', config: { baseBg: '#0a0a0a', blobColors: ['#1e293b', '#334155'], motionStyle: 'still', composition: 'diagonal' } },
  { id: 'matcha', name: 'Zen Matcha', config: { baseBg: '#f4f5f0', blobColors: ['#d3e4cd', '#c5d8a4'], motionStyle: 'calm', composition: 'soft-cloud' } },
  { id: 'sunset', name: 'Sunset Glow', config: { baseBg: '#2e1065', blobColors: ['#f59e0b', '#ec4899', '#ef4444'], motionStyle: 'chaotic', composition: 'spotlight' } },
  { id: 'lavender', name: 'Lavender Mist', config: { baseBg: '#faf5ff', blobColors: ['#e9d5ff', '#c084fc', '#f472b6'], motionStyle: 'flow', composition: 'split' } },
];

export default function App() {
  const [config, setConfig] = useState({
    baseBg: PRESETS[3].config.baseBg,
    blobColors: PRESETS[3].config.blobColors,
    lockedColors: [false, false, false, false, false, false, false], // 0 is bg, 1-6 are blobs
    blendMode: 'normal',
    opacity: 0.75,
    blur: 120,
    bloom: 1.0,
    motionStyle: PRESETS[3].config.motionStyle as 'still' | 'calm' | 'flow' | 'chaotic',
    composition: PRESETS[3].config.composition as 'soft-cloud' | 'diagonal' | 'spotlight' | 'split',
  });
  
  const [activeTab, setActiveTab] = useState<'none'|'explore'|'customise'|'export'|'history'>('none');
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<typeof config[]>([]);

  const [isCopiedCss, setIsCopiedCss] = useState(false);
  const [isCopiedReact, setIsCopiedReact] = useState(false);
  const [paletteHovered, setPaletteHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize from URL Hash
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#c=')) {
      try {
        const decoded = JSON.parse(atob(window.location.hash.slice(3)));
        if (decoded && decoded.blobColors) {
          setConfig(prev => ({ ...prev, ...decoded }));
        }
      } catch(e) { console.error("Invalid URL config"); }
    }
  }, []);

  // Sync to URL Hash
  useEffect(() => {
    const timer = setTimeout(() => {
      const str = btoa(JSON.stringify(config));
      window.history.replaceState(null, '', `#c=${str}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [config]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  
  const pushHistory = (newConfig) => {
    setHistory(prev => [config, ...prev].slice(0, 20));
    setConfig(newConfig);
  };

    const randomizeAll = () => {
    toast('Colors Randomized');
    const colorSchemes = ['analogous', 'complementary', 'triadic', 'split'];
    const isDark = Math.random() > 0.5;
    const baseHue = Math.floor(Math.random() * 360);
    const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    // Saturation and Lightness ranges for vibrant blobs
    const s = 70 + Math.random() * 30; // 70-100
    const blobL = 50 + Math.random() * 20; // 50-70
    
    // Base bg must be very clean: either very dark or very light, with almost no saturation
    const bgL = isDark ? (2 + Math.random() * 8) : (95 + Math.random() * 4);
    const bgS = 5 + Math.random() * 10;
    
    const newBaseBg = hslToHex(baseHue, bgS, bgL); // clean, high-contrast background
    
    let newBlobColors = [];
    if (scheme === 'analogous') {
      const spread = 30 + Math.random() * 30;
      newBlobColors = config.blobColors.map((_, i) => 
        hslToHex((baseHue + (i * (spread / config.blobColors.length)) + 360) % 360, s, blobL)
      );
    } else if (scheme === 'complementary') {
      newBlobColors = config.blobColors.map((_, i) => 
        hslToHex((baseHue + (i % 2 === 0 ? 0 : 180) + (Math.random()*10 - 5) + 360) % 360, s, blobL)
      );
    } else if (scheme === 'triadic') {
      const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
      newBlobColors = config.blobColors.map((_, i) => 
        hslToHex((hues[i % 3] + (Math.random()*10 - 5) + 360) % 360, s, blobL)
      );
    } else { // split complementary
      const hues = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
      newBlobColors = config.blobColors.map((_, i) => 
        hslToHex((hues[i % 3] + (Math.random()*10 - 5) + 360) % 360, s, blobL)
      );
    }

    pushHistory({
      ...config,
      baseBg: config.lockedColors[0] ? config.baseBg : newBaseBg,
      blobColors: config.blobColors.map((c, i) => config.lockedColors[i+1] ? c : newBlobColors[i])
    });
  };

  const undo = () => {
    toast('Restored previous state');
    if (history.length > 0) {
      const [last, ...rest] = history;
      setConfig(last);
      setHistory(rest);
    }
  };

  
  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(p => {
          const newPaused = !p;
          if (newPaused) toast('Animation Paused');
          else toast('Animation Playing');
          return newPaused;
        });
      } else if (e.code === 'KeyR' || e.key === 'r') {
        e.preventDefault();
        randomizeAll();
      } else if (e.code === 'Escape') {
        setActiveTab('none');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, config]);

  const addColor = () => {
    if (config.blobColors.length >= 6) return;
    pushHistory({
      ...config,
      blobColors: [...config.blobColors, config.blobColors[config.blobColors.length - 1]]
    });
  };

  const removeColor = (idx) => {
    if (config.blobColors.length <= 2) return;
    pushHistory({
      ...config,
      blobColors: config.blobColors.filter((_, i) => i !== idx)
    });
  };

  const clearHistory = () => setHistory([]);


  const updateConfig = (key: string, value: any) => {
    setConfig(p => ({ ...p, [key]: value }));
    if (key === 'baseBg' || key === 'blobColors') setHasInteracted(true);
  };
  const updateColor = (index: number, value: string) => {
    const newColors = [...config.blobColors];
    newColors[index] = value;
    updateConfig('blobColors', newColors);
  };
  const toggleLock = (index: number) => { // 0 for baseBg, 1-6 for blobColors
    const newLocks = [...config.lockedColors];
    newLocks[index] = !newLocks[index];
    updateConfig('lockedColors', newLocks);
  };

  const applyPreset = (presetConfig: any) => {
    toast('Preset applied');
    setConfig((p) => ({
      ...p,
      baseBg: presetConfig.baseBg,
      blobColors: [...presetConfig.blobColors],
      motionStyle: presetConfig.motionStyle || p.motionStyle,
      composition: presetConfig.composition || p.composition,
      lockedColors: [false, false, false, false, false, false, false],
      bloom: 1.0,
      blendMode: 'normal',
      opacity: 0.85,
      blur: 120
    }));
  };

  const randomizeConfig = () => {
    const colorSchemes = ['analogous', 'monochromatic', 'split'];
    const isDark = Math.random() > 0.8;
    const baseHue = Math.floor(Math.random() * 360);
    let newBlobColors = [];
    const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    const s = isDark ? (40 + Math.random() * 40) : (50 + Math.random() * 40);
    const bgL = isDark ? (5 + Math.random() * 8) : (92 + Math.random() * 6);
    const blobL = isDark ? (25 + Math.random() * 25) : (75 + Math.random() * 15);

    if (scheme === 'analogous') {
      const hueSpread = 40 + Math.random() * 20;
      newBlobColors = Array.from({length: 6}).map(() => hslToHex((baseHue + (Math.random() * hueSpread - hueSpread/2) + 360) % 360, s, blobL));
    } else if (scheme === 'monochromatic') {
      newBlobColors = Array.from({length: 6}).map(() => hslToHex(baseHue, Math.max(0, Math.min(100, s + (Math.random() * 30 - 15))), Math.max(0, Math.min(100, blobL + (Math.random() * 20 - 10)))));
    } else {
      const hues = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
      newBlobColors = Array.from({length: 6}).map((_, i) => hslToHex((hues[i % 3] + (Math.random() * 20 - 10) + 360) % 360, s, blobL));
    }

    const newBaseBg = hslToHex(baseHue, s * 0.3, bgL);
    const motionStyles = ['still', 'calm', 'flow', 'chaotic'];
    const compositions = ['soft-cloud', 'diagonal', 'spotlight', 'split'];

    setConfig(prev => {
      const locked = prev.lockedColors;
      return {
        ...prev,
        baseBg: locked[0] ? prev.baseBg : newBaseBg,
        blobColors: prev.blobColors.map((c, i) => locked[i+1] ? c : newBlobColors[i]),
        motionStyle: motionStyles[Math.floor(Math.random() * motionStyles.length)] as any,
        composition: compositions[Math.floor(Math.random() * compositions.length)] as any,
        bloom: isDark ? 1.0 + Math.random() * 0.3 : 1.0,
        blendMode: isDark ? 'screen' : 'normal',
        opacity: isDark ? 0.6 + Math.random() * 0.3 : 0.8 + Math.random() * 0.2,
      }
    });
  };


  const refineConfig = () => {
    setConfig(prev => {
      const tweakColor = (hex: string) => {
        let [h, s, l] = hexToHsl(hex);
        h = (h + (Math.random() * 10 - 5) + 360) % 360;
        s = Math.max(0, Math.min(100, s + (Math.random() * 10 - 5)));
        l = Math.max(0, Math.min(100, l + (Math.random() * 10 - 5)));
        return hslToHex(h, s, l);
      };
      const locked = prev.lockedColors;
      return {
        ...prev,
        baseBg: locked[0] ? prev.baseBg : tweakColor(prev.baseBg),
        blobColors: prev.blobColors.map((c, i) => locked[i+1] ? c : tweakColor(c)),
        blur: Math.max(30, Math.min(150, prev.blur + (Math.random() * 20 - 10))),
      }
    });
  };

  const isLightBg = getLuminance(config.baseBg) > 0.6;
  
      const uiThemeVars = React.useMemo(() => {
    let [bgH, bgS, bgL] = hexToHsl(config.baseBg);
    const isLight = bgL > 60;
    
    // Base the UI tint heavily on the first blob color to create a vibrant, matching frosted glass
    let [blobH, blobS, blobL] = hexToHsl(config.blobColors[0] || config.baseBg);
    
    const themeH = blobH;
    const themeS = Math.max(blobS, 60); // Ensure the tint is colorful
    
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    };

    // For light backgrounds, use a tinted pastel glass (L=90)
    // For dark backgrounds, use a tinted dark glass (L=25)
    // For pure premium glassmorphism, use white/black with opacity rather than heavy tints
    const panelBg = isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
    const panelHover = isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)';
    const panelBorder = isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.12)';
    const dividerBg = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
    
    const textColor = isLight ? '#0f172a' : '#ffffff';
    const textMuted = isLight ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)';
    
    // Accent can still borrow the hue for active states
    const accentColor = hslToHex(blobH, 80, isLight ? 45 : 70);

    return {
      '--ui-panel-bg': panelBg,
      '--ui-panel-hover': panelHover,
      '--ui-border': panelBorder,
      '--ui-divider': dividerBg,
      '--ui-text': textColor,
      '--ui-text-muted': textMuted,
      '--ui-accent': accentColor,
    };
  }, [config.baseBg, config.blobColors]);

  const liveCssSnippet = React.useMemo(() => {
    const getCompositionStyles = () => {
      switch(config.composition) {
        case 'diagonal':
          return `
.mesh-blob-1 { top: 0%; left: 0%; width: 50vw; height: 50vw; }
.mesh-blob-2 { top: 20%; left: 20%; width: 55vw; height: 55vw; }
.mesh-blob-3 { top: 40%; left: 40%; width: 60vw; height: 60vw; }
.mesh-blob-4 { top: 60%; left: 60%; width: 65vw; height: 65vw; }
.mesh-blob-5 { top: 80%; left: 80%; width: 70vw; height: 70vw; }
.mesh-blob-6 { top: 100%; left: 100%; width: 50vw; height: 50vw; }
          `;
        case 'spotlight':
          return `
.mesh-blob-1 { top: 50%; left: 50%; width: 100vw; height: 100vw; margin-top: -50vw; margin-left: -50vw; }
.mesh-blob-2 { top: 20%; left: 20%; width: 30vw; height: 30vw; margin-top: -15vw; margin-left: -15vw; }
.mesh-blob-3 { top: 80%; left: 80%; width: 35vw; height: 35vw; margin-top: -17.5vw; margin-left: -17.5vw; }
.mesh-blob-4 { top: 20%; left: 80%; width: 25vw; height: 25vw; margin-top: -12.5vw; margin-left: -12.5vw; }
.mesh-blob-5 { top: 80%; left: 20%; width: 40vw; height: 40vw; margin-top: -20vw; margin-left: -20vw; }
.mesh-blob-6 { top: 50%; left: 50%; width: 50vw; height: 50vw; margin-top: -25vw; margin-left: -25vw; }
          `;
        case 'split':
          return `
.mesh-blob-1 { top: 0%; left: 25%; width: 60vw; height: 60vw; margin-top: -30vw; margin-left: -30vw; }
.mesh-blob-2 { top: 0%; left: 75%; width: 60vw; height: 60vw; margin-top: -30vw; margin-left: -30vw; }
.mesh-blob-3 { top: 0%; left: 50%; width: 80vw; height: 80vw; margin-top: -40vw; margin-left: -40vw; }
.mesh-blob-4 { top: 100%; left: 25%; width: 60vw; height: 60vw; margin-top: -30vw; margin-left: -30vw; }
.mesh-blob-5 { top: 100%; left: 75%; width: 60vw; height: 60vw; margin-top: -30vw; margin-left: -30vw; }
.mesh-blob-6 { top: 100%; left: 50%; width: 80vw; height: 80vw; margin-top: -40vw; margin-left: -40vw; }
          `;
        case 'soft-cloud':
        default:
          return `
.mesh-blob-1 { top: 50%; left: 50%; width: 50vw; height: 50vw; margin-top: -25vw; margin-left: -25vw; }
.mesh-blob-2 { top: 50%; left: 50%; width: 45vw; height: 45vw; margin-top: -22.5vw; margin-left: -22.5vw; }
.mesh-blob-3 { top: 50%; left: 50%; width: 60vw; height: 60vw; margin-top: -30vw; margin-left: -30vw; }
.mesh-blob-4 { top: 50%; left: 50%; width: 55vw; height: 55vw; margin-top: -27.5vw; margin-left: -27.5vw; }
.mesh-blob-5 { top: 50%; left: 50%; width: 65vw; height: 65vw; margin-top: -32.5vw; margin-left: -32.5vw; }
.mesh-blob-6 { top: 50%; left: 50%; width: 50vw; height: 50vw; margin-top: -25vw; margin-left: -25vw; }
          `;
      }
    };

    const getMotionKeyframes = () => {
      let mult = 1, s = 1;
      if (config.motionStyle === 'still') return '';
      else if (config.motionStyle === 'calm') { mult = 0.8; s = 0.8; }
      else if (config.motionStyle === 'flow') { mult = 1.8; s = 1.2; }
      else if (config.motionStyle === 'chaotic') { mult = 4.0; s = 2.0; }
      
      return `
@keyframes blob-anim-1 { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(${30 * s}vw, ${-30 * s}vh) scale(1.4); } 66% { transform: translate(${-20 * s}vw, ${20 * s}vh) scale(0.6); } 100% { transform: translate(0px, 0px) scale(1); } }
@keyframes blob-anim-2 { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(${-30 * s}vw, ${-25 * s}vh) scale(0.7); } 66% { transform: translate(${25 * s}vw, ${30 * s}vh) scale(1.3); } 100% { transform: translate(0px, 0px) scale(1); } }
@keyframes blob-anim-3 { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(${40 * s}vw, ${30 * s}vh) scale(1.3); } 66% { transform: translate(${-25 * s}vw, ${-35 * s}vh) scale(0.7); } 100% { transform: translate(0px, 0px) scale(1); } }
@keyframes blob-anim-4 { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(${-25 * s}vw, ${40 * s}vh) scale(0.6); } 66% { transform: translate(${35 * s}vw, ${-25 * s}vh) scale(1.4); } 100% { transform: translate(0px, 0px) scale(1); } }
@keyframes blob-anim-5 { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(${20 * s}vw, ${-35 * s}vh) scale(1.5); } 66% { transform: translate(${-40 * s}vw, ${30 * s}vh) scale(0.6); } 100% { transform: translate(0px, 0px) scale(1); } }
@keyframes blob-anim-6 { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(${-40 * s}vw, ${-30 * s}vh) scale(0.6); } 66% { transform: translate(${30 * s}vw, ${40 * s}vh) scale(1.4); } 100% { transform: translate(0px, 0px) scale(1); } }

.mesh-blob-1 { animation: blob-anim-1 ${16 / mult}s infinite ease-in-out; }
.mesh-blob-2 { animation: blob-anim-2 ${18 / mult}s infinite ease-in-out; }
.mesh-blob-3 { animation: blob-anim-3 ${20 / mult}s infinite ease-in-out; }
.mesh-blob-4 { animation: blob-anim-4 ${22 / mult}s infinite ease-in-out; }
.mesh-blob-5 { animation: blob-anim-5 ${24 / mult}s infinite ease-in-out; }
.mesh-blob-6 { animation: blob-anim-6 ${26 / mult}s infinite ease-in-out; }
      `;
    };

    return `
.mesh-container { position: absolute; inset: 0; width: 100%; height: 100%; background-color: var(--bg); overflow: hidden; transition: background-color 1s ease; isolation: isolate; }
.mesh-blob { position: absolute; border-radius: 50%; filter: blur(var(--blur)) brightness(var(--bloom)) saturate(var(--sat)); opacity: var(--op); mix-blend-mode: var(--blend); transition: background-color 1.5s ease, filter 1.5s ease, opacity 1.5s ease; will-change: transform; transform: translate(0px, 0px); backface-visibility: hidden; }
.mesh-paused .mesh-blob { animation-play-state: paused !important; }
.mesh-blob-1 { background-color: var(--c1); }
.mesh-blob-2 { background-color: var(--c2); }
.mesh-blob-3 { background-color: var(--c3); }
.mesh-blob-4 { background-color: var(--c4); }
.mesh-blob-5 { background-color: var(--c5); }
.mesh-blob-6 { background-color: var(--c6); }
${getCompositionStyles()}
${getMotionKeyframes()}


`.trim();
  }, [config.composition, config.motionStyle]);

  const handleCopyCss = () => {
    toast.success('CSS Copied to clipboard');
    navigator.clipboard.writeText(liveCssSnippet);
    setIsCopiedCss(true);
    setTimeout(() => setIsCopiedCss(false), 2000);
  };

  const handleCopyReact = () => {
    toast.success('React Code Copied to clipboard');
    const reactCode = `export default function Background() {
  return (
    <div className="mesh-container" style={{
      '--bg': '${config.baseBg}',
      '--blur': '${config.blur}px',
      '--bloom': ${config.bloom},
      '--sat': ${config.bloom && config.bloom > 1 ? 1 + (config.bloom - 1) * 0.5 : 1},
      '--op': ${config.opacity},
      '--blend': '${config.blendMode}',
      '--c1': '${config.blobColors[0]}', '--c2': '${config.blobColors[1]}', '--c3': '${config.blobColors[2]}',
      '--c4': '${config.blobColors[3]}', '--c5': '${config.blobColors[4]}', '--c6': '${config.blobColors[5]}',
    } as React.CSSProperties}>
      <div className="mesh-blob mesh-blob-1"></div>
      <div className="mesh-blob mesh-blob-2"></div>
      <div className="mesh-blob mesh-blob-3"></div>
      <div className="mesh-blob mesh-blob-4"></div>
      <div className="mesh-blob mesh-blob-5"></div>
      <div className="mesh-blob mesh-blob-6"></div>
    </div>
  );
}`;
    navigator.clipboard.writeText(reactCode + "\n\n/* CSS */\n" + liveCssSnippet);
    setIsCopiedReact(true);
    setTimeout(() => setIsCopiedReact(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans selection:bg-white/20" style={{ backgroundColor: config.baseBg, ...uiThemeVars }}>
      <style>{liveCssSnippet}</style>
      <div 
        className={`absolute inset-0 z-0 mesh-container ${isPaused ? "mesh-paused" : ""}`}
        style={React.useMemo(() => ({

          '--bg': config.baseBg,
          '--blur': `${config.blur}px`,
          '--bloom': config.bloom || 1.0,
          '--sat': config.bloom && config.bloom > 1 ? 1 + (config.bloom - 1) * 0.5 : 1,
          '--op': config.opacity,
          '--blend': config.blendMode,
          '--c1': config.blobColors[0 % config.blobColors.length],
          '--c2': config.blobColors[1 % config.blobColors.length],
          '--c3': config.blobColors[2 % config.blobColors.length],
          '--c4': config.blobColors[3 % config.blobColors.length],
          '--c5': config.blobColors[4 % config.blobColors.length],
          '--c6': config.blobColors[5 % config.blobColors.length],
        
        } as React.CSSProperties), [config])}
      >
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="mesh-blob mesh-blob-4" />
        <div className="mesh-blob mesh-blob-5" />
        <div className="mesh-blob mesh-blob-6" />
      </div>

      <div className="relative z-20 pointer-events-none w-full h-screen flex flex-col">
        
        {/* Top Header Area */}
        <div className="absolute top-6 left-6 pointer-events-auto">
          <button onClick={() => setActiveTab('explore')} className="px-5 py-2.5 backdrop-blur-md rounded-full font-semibold text-base tracking-wide select-none flex items-center gap-2 transition-all cursor-pointer shadow-lg dyn-panel dyn-panel-hover border dyn-border">
            <Sparkles className="w-5 h-5 opacity-80" />
            Backie
          </button>
        </div>

        {/* Right Side Action Menu */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 pointer-events-auto z-30">
          <AnimatePresence>
            {activeTab === 'none' && (
              <>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.05 }} onClick={() => setActiveTab('explore')} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  <LayoutGrid className="w-5 h-5" />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">Explore Presets</span>
                </motion.button>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.1 }} onClick={toggleFullscreen} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">Fullscreen</span>
                </motion.button>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.15 }} onClick={() => setActiveTab('customise')} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  <Settings2 className="w-5 h-5" />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">Customise</span>
                </motion.button> 
 <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.17 }} onClick={() => setActiveTab('history')} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  <HistoryIcon className="w-5 h-5" />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">History</span>
                </motion.button>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.2 }} onClick={() => setActiveTab('export')} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  <Code2 className="w-5 h-5" />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">Export / Copy CSS</span>
                </motion.button>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.25 }} onClick={() => setIsPaused(!isPaused)} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">{isPaused ? 'Play (Space)' : 'Pause (Space)'}</span>
                </motion.button>
              <motion.a href="https://github.com/Cocean001/Backie" target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.3 }} className="p-3 backdrop-blur-xl rounded-full transition-all cursor-pointer group relative hover:scale-105 active:scale-95 dyn-panel dyn-panel-hover border dyn-border shadow-md">
                  <Github className="w-5 h-5" />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none dyn-panel shadow-lg border dyn-border font-medium">GitHub Repository</span>
                </motion.a>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Center Bar */}
        <AnimatePresence>
          {activeTab === 'none' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-30"
            >
              
              <div className="flex items-center">
                {/* Color Pickers Pill */}
                <div 
                  className="relative flex items-center gap-2.5 px-4 py-3 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/40"
                  onMouseEnter={() => setPaletteHovered(true)}
                  onMouseLeave={() => setPaletteHovered(false)}
                >
                  <PopoverColorPicker isLightBg={isLightBg}
                    color={config.baseBg} 
                    onChange={(val) => updateConfig('baseBg', val)} 
                    isLocked={config.lockedColors[0]}
                    onToggleLock={() => toggleLock(0)}
                    title="Base Canvas" 
                    placement="top" 
                  />
                  <div className="w-[1.5px] h-7 shrink-0 mx-1.5 bg-black/15 dark:bg-white/20 rounded-full" />
                  
                  <div className="flex items-center gap-2">
                    {config.blobColors.map((c, idx) => (
                      <div key={idx} className="relative group/picker">
                        <PopoverColorPicker isLightBg={isLightBg}
                          color={c} 
                          onChange={(val) => updateColor(idx, val)} 
                          isLocked={config.lockedColors[idx+1]}
                          onToggleLock={() => toggleLock(idx+1)}
                          title={`Aura Light ${idx + 1}`} 
                          placement="top" 
                        />
                        {config.blobColors.length > 2 && (
                          <button onClick={() => removeColor(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/picker:opacity-100 transition-opacity z-10 hover:scale-110">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {config.blobColors.length < 6 && (
                      <button onClick={addColor} title="Add Color" className="w-9 h-9 rounded-full border-[1.5px] border-white/80 dark:border-white/40 bg-white/40 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/30 backdrop-blur-xl shadow-md flex items-center justify-center transition-all shrink-0 cursor-pointer hover:scale-110 hover:shadow-lg text-black dark:text-white">
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="w-[1.5px] h-7 shrink-0 mx-1.5 bg-black/15 dark:bg-white/20 rounded-full" />
                  
                  <div className="flex items-center gap-2">
                    <button onClick={randomizeAll} title="Randomize Colors (R)" className="w-9 h-9 rounded-full border-[1.5px] border-white/80 dark:border-white/40 bg-white/40 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/30 backdrop-blur-xl shadow-md flex items-center justify-center transition-all shrink-0 cursor-pointer hover:scale-110 hover:shadow-lg text-black dark:text-white">
                      <Shuffle className="w-4 h-4" />
                    </button>
                    
                    <button onClick={undo} title="Undo" disabled={history.length === 0} className="w-9 h-9 rounded-full border-[1.5px] border-white/80 dark:border-white/40 bg-white/40 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/30 backdrop-blur-xl shadow-md flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:opacity-30 disabled:hover:bg-white/40 disabled:hover:scale-100 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg text-black dark:text-white">
                      <Undo2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Drawer Wrapper */}
        <AnimatePresence>
          {activeTab !== 'none' && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveTab('none')}
                className="absolute inset-0 z-40 bg-black/5 backdrop-blur-[2px] pointer-events-auto cursor-pointer"
              />
              <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-4 right-4 bottom-4 w-[calc(100%-2rem)] md:w-[480px] rounded-[2rem] backdrop-blur-3xl shadow-2xl border flex flex-col pointer-events-auto z-50 transition-colors dyn-panel dyn-border overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b shrink-0 dyn-border">
                <h2 className="text-base font-semibold flex items-center gap-2.5 dyn-text">
                  {activeTab === 'explore' && <><LayoutGrid className="w-5 h-5 text-indigo-500" /> Explore Presets</>}
                  {activeTab === 'customise' && <><Settings2 className="w-5 h-5 text-teal-500" /> Customise</>}
                  {activeTab === 'export' && <><Code2 className="w-5 h-5 text-blue-500" /> Export</>}
                </h2>
                <button onClick={() => setActiveTab('none')} title="Close (Esc)" className="p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer dyn-panel-hover dyn-text-muted hover:dyn-text" >
                  <X className="w-5 h-5 opacity-70" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-none space-y-8">
                {activeTab === 'explore' && (
                  <div className="space-y-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium dyn-text">Start with a direction</p>
                        <p className="mt-1 text-xs leading-relaxed dyn-text-muted">Pick a base, then fine-tune the movement and colour below.</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium tabular-nums dyn-text-muted">{PRESETS.length} options</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                    {PRESETS.map((preset) => (
                      (() => {
                        const isActive = config.baseBg === preset.config.baseBg && config.motionStyle === preset.config.motionStyle && config.composition === preset.config.composition;
                        return (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.config)}
                        aria-pressed={isActive}
                        className={`group relative flex flex-col w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 cursor-pointer ${isActive ? 'border-indigo-500/70 ring-2 ring-indigo-500/20' : 'border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25'} bg-white/10 dark:bg-black/15 shadow-sm hover:-translate-y-0.5 hover:shadow-lg`}
                      >
                        <div className="relative aspect-[1.35] w-full overflow-hidden" style={{ backgroundColor: preset.config.baseBg }}>
                          <div className="absolute -inset-8 opacity-90 mix-blend-screen transition-transform duration-700 group-hover:scale-110" style={{
                            filter: 'blur(24px) saturate(1.1)',
                            background: `
                              radial-gradient(circle at 18% 32%, ${preset.config.blobColors[0] || 'transparent'} 0%, transparent 58%),
                              radial-gradient(circle at 82% 68%, ${preset.config.blobColors[1] || 'transparent'} 0%, transparent 58%),
                              radial-gradient(circle at 52% 52%, ${preset.config.blobColors[2] || 'transparent'} 0%, transparent 56%)
                            `
                          }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
                          {isActive && <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-900 shadow-sm">Current</span>}
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-3">
                          <span className="min-w-0 truncate text-xs font-semibold dyn-text">{preset.name}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {preset.config.blobColors.slice(0, 3).map((color) => <span key={color} className="h-2.5 w-2.5 rounded-full border border-white/50" style={{ backgroundColor: color }} />)}
                          </span>
                        </div>
                      </button>
                        );
                      })()
                    ))}
                    </div>
                  </div>
                )}

                {activeTab === 'customise' && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-medium uppercase tracking-wider opacity-60 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" /> Composition
                        </h3>
                        <div className="relative group/info">
                          <Info className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity cursor-help" />
                          <div className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl text-xs font-medium opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none dyn-panel shadow-xl border dyn-border z-50">
                            <div className="space-y-2">
                              <p><span className="opacity-60">Soft Cloud:</span> Gentle, overlapping center</p>
                              <p><span className="opacity-60">Diagonal:</span> Stretching across corners</p>
                              <p><span className="opacity-60">Spotlight:</span> Focused beams of light</p>
                              <p><span className="opacity-60">Split:</span> Left/Right distinct areas</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 relative">
                        {[
                          { id: 'soft-cloud', label: 'Soft Cloud', icon: Cloud },
                          { id: 'diagonal', label: 'Diagonal', icon: MoveDiagonal },
                          { id: 'spotlight', label: 'Spotlight', icon: Sun },
                          { id: 'split', label: 'Split', icon: Columns }
                        ].map((comp) => (
                          <button key={comp.id} onClick={() => updateConfig('composition', comp.id)} className={`relative py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2.5 z-10 ${config.composition === comp.id ? 'font-medium dyn-text' : 'dyn-text-muted hover:dyn-text'}`}>
                            {config.composition === comp.id && (
                              <motion.div
                                layoutId="composition-active"
                                className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-black/5 dark:border-white/10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <comp.icon className="w-4 h-4 opacity-70 relative z-10" />
                            <span className="relative z-10">{comp.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-medium uppercase tracking-wider opacity-60 flex items-center gap-2">
                          <Play className="w-3.5 h-3.5" /> Motion
                        </h3>
                        <div className="relative group/info">
                          <Info className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity cursor-help" />
                          <div className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl text-xs font-medium opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none dyn-panel shadow-xl border dyn-border z-50">
                            <div className="space-y-2">
                              <p><span className="opacity-60">Still:</span> Static rendering</p>
                              <p><span className="opacity-60">Calm:</span> Very slow drifting</p>
                              <p><span className="opacity-60">Flow:</span> Smooth, breathing motion</p>
                              <p><span className="opacity-60">Chaotic:</span> Fast, erratic movement</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 relative">
                        {[
                          { id: 'still', label: 'Still', icon: PauseCircle },
                          { id: 'calm', label: 'Calm', icon: Wind },
                          { id: 'flow', label: 'Flow', icon: Waves },
                          { id: 'chaotic', label: 'Chaotic', icon: Zap }
                        ].map((mot) => (
                          <button key={mot.id} onClick={() => updateConfig('motionStyle', mot.id)} className={`relative py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2.5 z-10 ${config.motionStyle === mot.id ? 'font-medium dyn-text' : 'dyn-text-muted hover:dyn-text'}`}>
                            {config.motionStyle === mot.id && (
                              <motion.div
                                layoutId="motion-active"
                                className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-black/5 dark:border-white/10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <mot.icon className="w-4 h-4 opacity-70 relative z-10" />
                            <span className="relative z-10">{mot.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <h3 className="text-[11px] font-medium uppercase tracking-wider opacity-60 flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Optics</h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs opacity-80">
                            <label className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 opacity-70" /> Blur & Diffusion</label>
                            <span className="font-mono px-1.5 py-0.5 rounded dyn-divider opacity-70" >{config.blur}px</span>
                          </div>
                          <input type="range" min="0" max="200" step="5" value={config.blur} onChange={(e) => updateConfig('blur', parseInt(e.target.value))} className="w-full h-1.5 bg-black/10 dark:bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/10 [&::-webkit-slider-thumb]:active:scale-95 [&::-webkit-slider-thumb]:transition-transform" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs opacity-80">
                            <label className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 opacity-70" /> Opacity</label>
                            <span className="font-mono px-1.5 py-0.5 rounded dyn-divider opacity-70" >{(config.opacity * 100).toFixed(0)}%</span>
                          </div>
                          <input type="range" min="0.1" max="1.0" step="0.05" value={config.opacity} onChange={(e) => updateConfig('opacity', parseFloat(e.target.value))} className="w-full h-1.5 bg-black/10 dark:bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/10 [&::-webkit-slider-thumb]:active:scale-95 [&::-webkit-slider-thumb]:transition-transform" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-normal opacity-80">Generation History</h3>
                      {history.length > 0 && (
                        <button onClick={clearHistory} className="text-xs text-red-500 px-2 py-1 rounded transition-colors flex items-center gap-1 hover:bg-red-500/10" >
                          <Trash2 className="w-3.5 h-3.5" /> Clear All
                        </button>
                      )}
                    </div>
                    {history.length === 0 ? (
                      <div className="p-8 text-center text-sm border border-dashed rounded-2xl dyn-text-muted dyn-border" >
                        No history yet. Try randomizing colors!
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[60vh] pr-1 scrollbar-none">
                        {history.map((hState, i) => (
                          <button key={i} onClick={() => { setConfig(hState); toast('Restored from history'); }} className="p-3 rounded-2xl border flex flex-col gap-2 transition-all hover:scale-105 active:scale-95 text-left dyn-panel-hover dyn-border dyn-divider group">
                            <div className="flex gap-1.5 items-center flex-wrap">
                              <div className="w-5 h-5 rounded-full border shadow-sm border-white/20 shrink-0" style={{ backgroundColor: hState.baseBg }} title="Background" />
                              <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 shrink-0" />
                              {hState.blobColors.map((bc, bi) => (
                                <div key={bi} className="w-5 h-5 rounded-full border shadow-sm border-white/20 shrink-0 -ml-2 group-hover:ml-0 transition-all duration-300" style={{ backgroundColor: bc }} />
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className="space-y-8">
                    <div className="p-5 rounded-2xl border dyn-divider dyn-border">
                      <h3 className="text-sm font-medium mb-3">Performance Specs</h3>
                      <ul className="text-xs font-medium opacity-70 space-y-2 list-none p-0 m-0">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500" /> Pure CSS implementation</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500" /> 0 dependencies required</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500" /> GPU hardware accelerated (<code className="px-1 rounded font-mono dyn-divider dyn-text" >will-change: transform</code>)</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500" /> prefers-reduced-motion compatible</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">CSS + HTML</h3>
                        <button onClick={handleCopyCss} className="text-xs font-bold px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-1.5">
                          {isCopiedCss ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopiedCss ? 'Copied' : 'Copy CSS'}
                        </button>
                      </div>
                      <div className="relative group overflow-hidden rounded-2xl bg-[#0f172a] border border-[#1e293b]">
                        <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                          {liveCssSnippet.slice(0, 300)}...
                        </pre>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none flex items-end justify-center pb-4">
                          <span className="text-xs font-semibold text-indigo-300 bg-[#0f172a]/90 px-3 py-1.5 rounded-full border border-indigo-500/20 shadow-lg backdrop-blur-sm">Click Copy to get full code</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">React Component (Tailwind)</h3>
                        <button onClick={handleCopyReact} className="text-xs font-bold px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-1.5">
                          {isCopiedReact ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopiedReact ? 'Copied' : 'Copy React'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-inherit/10">
                       <h3 className="text-sm font-medium opacity-90">Share via URL</h3>
                       <div className="flex gap-2">
                          <input readOnly value={window.location.href} className="flex-1 rounded-xl px-3 py-2 text-xs outline-none font-mono opacity-70 border dyn-divider dyn-border dyn-text" />
                          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Share Link Copied'); }} className="px-4 py-2 rounded-xl transition-colors dyn-divider dyn-panel-hover dyn-text">
                            <Copy className="w-4 h-4" />
                          </button>
                       </div>
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
