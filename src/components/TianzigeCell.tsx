import { memo, useEffect, useState } from 'react';
import { loadStrokeData, type CharacterStrokeData } from '../utils/strokes';

interface TianzigeCellProps {
  size: number;
  char?: string;
  mode: 'reference' | 'trace' | 'blank';
  showPinyin?: boolean;
  pinyin?: string;
  gridType?: 'mizige' | 'tianzige';
}

function TianzigeCellBase({ size, char, mode, showPinyin, pinyin, gridType = 'mizige' }: TianzigeCellProps) {
  const borderColor = '#c4a882';
  const guideColor = '#dbc8a8';
  const [strokeData, setStrokeData] = useState<CharacterStrokeData | null>(null);

  useEffect(() => {
    if (!char || mode === 'blank') return;
    let cancelled = false;
    loadStrokeData(char).then((data) => {
      if (!cancelled) setStrokeData(data);
    });
    return () => { cancelled = true; };
  }, [char, mode]);

  return (
    <div className="relative flex flex-col items-center">
      {showPinyin && mode === 'reference' && pinyin && (
        <div
          className="text-center leading-none mb-0.5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: Math.max(10, size * 0.16),
            color: '#c0572b',
            letterSpacing: '0.5px',
          }}
        >
          {pinyin}
        </div>
      )}
      {showPinyin && mode !== 'reference' && (
        <div style={{ height: Math.max(10, size * 0.16) + 2 }} />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer border */}
        <rect
          x={4}
          y={4}
          width={1016}
          height={1016}
          fill="none"
          stroke={borderColor}
          strokeWidth={16}
        />

        {/* Horizontal center line (dashed) */}
        <line
          x1={1}
          y1={512}
          x2={1023}
          y2={512}
          stroke={guideColor}
          strokeWidth={10}
          strokeDasharray="30 20"
        />

        {/* Vertical center line (dashed) */}
        <line
          x1={512}
          y1={1}
          x2={512}
          y2={1023}
          stroke={guideColor}
          strokeWidth={10}
          strokeDasharray="30 20"
        />

        {/* Diagonal lines (only for mizige) */}
        {gridType !== 'tianzige' && (
          <>
            <line
              x1={1}
              y1={1}
              x2={1023}
              y2={1023}
              stroke={guideColor}
              strokeWidth={8}
              strokeDasharray="30 20"
            />
            <line
              x1={1023}
              y1={1}
              x2={1}
              y2={1023}
              stroke={guideColor}
              strokeWidth={8}
              strokeDasharray="30 20"
            />
          </>
        )}

        {/* Character using stroke paths (same as StrokeOrderGuide) */}
        {char && mode !== 'blank' && strokeData && (
          <g transform="scale(1, -1) translate(0, -900)" opacity={mode === 'reference' ? 1 : 0.15}>
            {strokeData.strokes.map((path, i) => (
              <path key={i} d={path} fill="#2c2018" stroke="none" />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export const TianzigeCell = memo(TianzigeCellBase);
