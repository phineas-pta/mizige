import { useCallback, useEffect, useMemo, useState } from 'react';
import { CharacterCard } from './CharacterCard';
import { LearnControls } from './LearnControls';
import { extractChineseChars, getPinyin } from '../utils/pinyin';
import { filterAvailableChars, loadStrokeData } from '../utils/strokes';

interface LearnModeProps {
  text: string;
  currentCharIndex: number;
  onCharIndexChange: (i: number) => void;
  showPinyin: boolean;
  gridType: 'mizige' | 'tianzige';
  sidebarOpen: boolean;
}

function computeCanvasSize(sidebarOpen: boolean): number {
  const sidebarWidth = sidebarOpen ? 320 : 0;
  const padding = 80; // p-6/p-10 on main + px-6 on container
  const overhead = 220; // pinyin + stroke info + replay + controls + gaps
  const availW = window.innerWidth - sidebarWidth - padding;
  const availH = window.innerHeight - overhead;
  return Math.max(200, Math.min(560, Math.floor(Math.min(availW, availH))));
}

export function LearnMode({
  text,
  currentCharIndex,
  onCharIndexChange,
  showPinyin,
  gridType,
  sidebarOpen,
}: LearnModeProps) {
  const [availableChars, setAvailableChars] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [strokeCounts, setStrokeCounts] = useState<Record<string, number>>({});
  const [canvasSize, setCanvasSize] = useState(() => computeCanvasSize(sidebarOpen));

  // Recompute on window resize
  useEffect(() => {
    const onResize = () => setCanvasSize(computeCanvasSize(sidebarOpen));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  // Recompute when sidebar toggles
  useEffect(() => {
    // Small delay to let the sidebar transition finish (300ms)
    const timer = setTimeout(() => {
      setCanvasSize(computeCanvasSize(sidebarOpen));
    }, 320);
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  const allChars = useMemo(() => extractChineseChars(text), [text]);

  useEffect(() => {
    filterAvailableChars(allChars).then(setAvailableChars);
  }, [allChars]);

  useEffect(() => {
    setIsComplete(false);
  }, [availableChars]);

  useEffect(() => {
    if (availableChars.length === 0) return;

    const loadCounts = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        availableChars.map(async (char) => {
          const data = await loadStrokeData(char);
          if (data) {
            counts[char] = data.strokes.length;
          }
        }),
      );
      setStrokeCounts(counts);
    };

    loadCounts();
  }, [availableChars]);

  const currentChar = availableChars[currentCharIndex] || '';
  const currentPinyin = currentChar ? getPinyin(currentChar) : '';
  const currentStrokeCount = currentChar ? (strokeCounts[currentChar] ?? 0) : 0;

  const handleQuizComplete = useCallback(() => {
    if (currentCharIndex < availableChars.length - 1) {
      onCharIndexChange(currentCharIndex + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentCharIndex, availableChars.length, onCharIndexChange]);

  const handleStartOver = useCallback(() => {
    onCharIndexChange(0);
    setIsComplete(false);
  }, [onCharIndexChange]);

  // Empty state
  if (availableChars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div
          style={{
            fontFamily: "'LXGW WenKai', serif",
            fontSize: 64,
            color: '#a09080',
          }}
        >
          学
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Enter Chinese characters to start learning
        </p>
      </div>
    );
  }

  // Complete state
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div
          style={{
            fontSize: 64,
            color: 'var(--jade-accent)',
          }}
        >
          ✓
        </div>
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Complete!
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {availableChars.length} character{availableChars.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={handleStartOver}
          className="px-6 py-2 rounded-lg text-white font-medium cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--vermillion), var(--gold-accent))',
            border: 'none',
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  // Normal state
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-6">
      <CharacterCard
        key={currentChar}
        char={currentChar}
        pinyin={currentPinyin}
        showPinyin={showPinyin}
        gridType={gridType}
        strokeCount={currentStrokeCount}
        size={canvasSize}
        onQuizComplete={handleQuizComplete}
      />
      <LearnControls
        current={currentCharIndex}
        total={availableChars.length}
        onPrev={() => onCharIndexChange(currentCharIndex - 1)}
        onNext={() => onCharIndexChange(currentCharIndex + 1)}
      />
    </div>
  );
}
