interface SettingsPanelProps {
  mode: 'worksheet' | 'learn';
  onModeChange: (mode: 'worksheet' | 'learn') => void;
  text: string;
  onTextChange: (text: string) => void;
  traceCells: number;
  onTraceCellsChange: (n: number) => void;
  blankCells: number;
  onBlankCellsChange: (n: number) => void;
  showPinyin: boolean;
  onShowPinyinChange: (v: boolean) => void;
  showStrokeOrder: boolean;
  onShowStrokeOrderChange: (v: boolean) => void;
  maxStrokeFrames: number;
  onMaxStrokeFramesChange: (n: number) => void;
  cellSize: number;
  onCellSizeChange: (n: number) => void;
  gridType: 'mizige' | 'tianzige';
  onGridTypeChange: (v: 'mizige' | 'tianzige') => void;
  paperSize: 'a4' | 'letter';
  onPaperSizeChange: (v: 'a4' | 'letter') => void;
  onExport: () => void;
  isExporting: boolean;
  charCount: number;
  onClose?: () => void;
}

function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-7 h-7 rounded flex items-center justify-center text-sm transition-colors cursor-pointer"
          style={{
            background: 'var(--ink-border)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-border-light)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink-border)')}
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-medium tabular-nums">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-7 h-7 rounded flex items-center justify-center text-sm transition-colors cursor-pointer"
          style={{
            background: 'var(--ink-border)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-border-light)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--ink-border)')}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
        style={{
          background: value ? 'var(--vermillion)' : 'var(--ink-border)',
        }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: value ? 22 : 2 }}
        />
      </button>
    </div>
  );
}

export function SettingsPanel({
  mode,
  onModeChange,
  text,
  onTextChange,
  traceCells,
  onTraceCellsChange,
  blankCells,
  onBlankCellsChange,
  showPinyin,
  onShowPinyinChange,
  showStrokeOrder,
  onShowStrokeOrderChange,
  maxStrokeFrames,
  onMaxStrokeFramesChange,
  cellSize,
  onCellSizeChange,
  gridType,
  onGridTypeChange,
  paperSize,
  onPaperSizeChange,
  onExport,
  isExporting,
  charCount,
  onClose,
}: SettingsPanelProps) {
  return (
    <aside
      className="flex flex-col gap-5 p-5 h-full overflow-y-auto"
      style={{ background: 'var(--ink-surface)' }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid var(--ink-border)' }}>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{
            background: 'linear-gradient(135deg, var(--vermillion), var(--gold-accent))',
            fontFamily: "'LXGW WenKai', serif",
            fontWeight: 900,
            color: 'white',
          }}
        >
          米
        </div>
        <div className="flex-1">
          <h1
            className="text-base font-bold leading-tight"
            style={{ fontFamily: "'LXGW WenKai', serif", color: 'var(--text-primary)' }}
          >
            米字格
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Practice Sheet Generator
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center cursor-pointer"
            style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none' }}
            title="Close settings"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['worksheet', 'learn'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="flex-1 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
            style={{
              background: mode === m ? 'var(--ink-border-light)' : 'transparent',
              border: `1px solid ${mode === m ? 'var(--vermillion)' : 'var(--ink-border)'}`,
              color: mode === m ? 'var(--vermillion)' : 'var(--text-muted)',
            }}
          >
            {m === 'worksheet' ? 'Worksheet' : 'Learn'}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Chinese Text
          </label>
          {charCount > 0 && (
            <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {charCount} chars
            </span>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="输入中文字符..."
          rows={4}
          className="w-full rounded-lg p-3 text-sm resize-none outline-none transition-all"
          style={{
            background: 'var(--ink-surface-2)',
            border: '1px solid var(--ink-border)',
            color: 'var(--text-primary)',
            fontFamily: "'LXGW WenKai', serif",
            fontSize: 16,
            lineHeight: 1.8,
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold-accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--ink-border)')}
        />
      </div>

      {/* Layout settings (worksheet only) */}
      {mode === 'worksheet' && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Layout
          </label>
          <NumberStepper label="Trace cells" value={traceCells} onChange={onTraceCellsChange} min={0} max={10} />
          <NumberStepper label="Blank cells" value={blankCells} onChange={onBlankCellsChange} min={0} max={10} />
          <NumberStepper label="Cell size" value={cellSize} onChange={onCellSizeChange} min={40} max={120} step={4} />
          {showStrokeOrder && (
            <NumberStepper label="Max stroke frames" value={maxStrokeFrames} onChange={onMaxStrokeFramesChange} min={4} max={12} />
          )}
        </div>
      )}

      {/* Display settings */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Display
        </label>
        <Toggle label="Show Pinyin" value={showPinyin} onChange={onShowPinyinChange} />
      </div>

      {/* Stroke Order (worksheet only) */}
      {mode === 'worksheet' && (
        <div className="flex flex-col gap-3">
          <Toggle label="Stroke Order" value={showStrokeOrder} onChange={onShowStrokeOrderChange} />
        </div>
      )}

      {/* Grid type */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Grid Type
        </label>
        <div className="flex gap-2">
          {(['mizige', 'tianzige'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onGridTypeChange(type)}
              className="flex-1 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
              style={{
                background: gridType === type ? 'var(--ink-border-light)' : 'transparent',
                border: `1px solid ${gridType === type ? 'var(--gold-accent)' : 'var(--ink-border)'}`,
                color: gridType === type ? 'var(--gold-accent)' : 'var(--text-muted)',
              }}
            >
              {type === 'mizige' ? '米字格' : '田字格'}
            </button>
          ))}
        </div>
      </div>

      {/* Paper size (worksheet only) */}
      {mode === 'worksheet' && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Paper Size
          </label>
          <div className="flex gap-2">
            {(['a4', 'letter'] as const).map((size) => (
              <button
                key={size}
                onClick={() => onPaperSizeChange(size)}
                className="flex-1 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
                style={{
                  background: paperSize === size ? 'var(--ink-border-light)' : 'transparent',
                  border: `1px solid ${paperSize === size ? 'var(--gold-accent)' : 'var(--ink-border)'}`,
                  color: paperSize === size ? 'var(--gold-accent)' : 'var(--text-muted)',
                }}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer + Export button (worksheet only) */}
      {mode === 'worksheet' && (
        <>
          <div className="flex-1" />

          <button
            onClick={onExport}
            disabled={isExporting || charCount === 0}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, var(--vermillion), #c03a2a)',
              color: 'white',
              border: 'none',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </button>
        </>
      )}
    </aside>
  );
}
