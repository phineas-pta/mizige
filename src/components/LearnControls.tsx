import { memo } from 'react';

interface LearnControlsProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function LearnControlsBase({ current, total, onPrev, onNext }: LearnControlsProps) {
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Progress bar */}
      <div className="w-full">
        <div
          className="w-full h-1.5 rounded-full"
          style={{ background: 'var(--ink-border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--vermillion), var(--gold-accent))',
            }}
          />
        </div>
        <div
          className="text-xs text-center mt-1.5 tabular-nums"
          style={{ color: 'var(--text-muted)' }}
        >
          {current + 1} / {total} characters
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'var(--ink-border)',
            color: 'var(--text-primary)',
            border: 'none',
          }}
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className="px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'var(--ink-border)',
            color: 'var(--text-primary)',
            border: 'none',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export const LearnControls = memo(LearnControlsBase);
