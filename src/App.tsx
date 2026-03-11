import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LearnMode } from './components/LearnMode';
import { SettingsPanel } from './components/SettingsPanel';
import { WorksheetPreview } from './components/WorksheetPreview';
import { extractChineseChars } from './utils/pinyin';
import { exportToPdf } from './utils/pdf';

function App() {
  const [text, setText] = useState('黄河之水天上来');
  const [traceCells, setTraceCells] = useState(3);
  const [blankCells, setBlankCells] = useState(5);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showStrokeOrder, setShowStrokeOrder] = useState(true);
  const [maxStrokeFrames, setMaxStrokeFrames] = useState(11);
  const [cellSize, setCellSize] = useState(72);
  const [gridType, setGridType] = useState<'mizige' | 'tianzige'>('mizige');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [isExporting, setIsExporting] = useState(false);
  const [mode, setMode] = useState<'worksheet' | 'learn'>('worksheet');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [mobileShowSettings, setMobileShowSettings] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const charCount = useMemo(() => extractChineseChars(text).length, [text]);

  useEffect(() => { setCurrentCharIndex(0); }, [text]);

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await exportToPdf(previewRef.current, paperSize);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [paperSize]);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Mobile header */}
      <div
        className="lg:hidden flex items-center justify-between p-3"
        style={{ background: 'var(--ink-surface)', borderBottom: '1px solid var(--ink-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-sm"
            style={{
              background: 'linear-gradient(135deg, var(--vermillion), var(--gold-accent))',
              fontFamily: "'LXGW WenKai', serif",
              fontWeight: 900,
              color: 'white',
            }}
          >
            米
          </div>
          <span className="font-semibold text-sm" style={{ fontFamily: "'LXGW WenKai', serif" }}>
            米字格
          </span>
        </div>
        <button
          onClick={() => setMobileShowSettings(!mobileShowSettings)}
          className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer"
          style={{
            background: 'var(--ink-border)',
            color: 'var(--text-primary)',
            border: 'none',
          }}
        >
          {mobileShowSettings ? (mode === 'learn' ? 'Learn' : 'Preview') : 'Settings'}
        </button>
      </div>

      {/* Settings sidebar */}
      <div
        className={`
          ${mobileShowSettings ? 'block' : 'hidden'} lg:block
          w-full lg:w-80 xl:w-88 flex-shrink-0
          lg:border-r
          overflow-y-auto
        `}
        style={{ borderColor: 'var(--ink-border)' }}
      >
        <SettingsPanel
          mode={mode}
          onModeChange={setMode}
          text={text}
          onTextChange={setText}
          traceCells={traceCells}
          onTraceCellsChange={setTraceCells}
          blankCells={blankCells}
          onBlankCellsChange={setBlankCells}
          showPinyin={showPinyin}
          onShowPinyinChange={setShowPinyin}
          showStrokeOrder={showStrokeOrder}
          onShowStrokeOrderChange={setShowStrokeOrder}
          maxStrokeFrames={maxStrokeFrames}
          onMaxStrokeFramesChange={setMaxStrokeFrames}
          cellSize={cellSize}
          onCellSizeChange={setCellSize}
          gridType={gridType}
          onGridTypeChange={setGridType}
          paperSize={paperSize}
          onPaperSizeChange={setPaperSize}
          onExport={handleExport}
          isExporting={isExporting}
          charCount={charCount}
        />
      </div>

      {/* Preview area */}
      <main
        className={`
          ${mobileShowSettings ? 'hidden' : 'flex'} lg:flex
          flex-1 overflow-auto items-start justify-center p-6 lg:p-10
        `}
        style={{
          background: 'var(--ink-dark)',
          backgroundImage: `
            radial-gradient(ellipse at 30% 20%, rgba(201, 168, 76, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(232, 75, 58, 0.02) 0%, transparent 50%)
          `,
        }}
      >
        {mode === 'learn' ? (
          <LearnMode
            text={text}
            currentCharIndex={currentCharIndex}
            onCharIndexChange={setCurrentCharIndex}
            showPinyin={showPinyin}
            gridType={gridType}
          />
        ) : (
          <WorksheetPreview
            ref={previewRef}
            text={text}
            traceCells={traceCells}
            blankCells={blankCells}
            cellSize={cellSize}
            showPinyin={showPinyin}
            showStrokeOrder={showStrokeOrder}
            maxStrokeFrames={maxStrokeFrames}
            gridType={gridType}
          />
        )}
      </main>
    </div>
  );
}

export default App;
