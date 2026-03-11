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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Backdrop overlay when sidebar open on mobile */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 lg:hidden cursor-default"
          style={{ background: 'rgba(0,0,0,0.5)', border: 'none' }}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close settings"
        />
      )}

      {/* Slide-in sidebar */}
      <div
        className="fixed top-0 left-0 z-30 h-full w-80 shrink-0"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          borderRight: '1px solid var(--ink-border)',
        }}
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
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed z-40 flex items-center justify-center w-8 h-8 rounded-r-lg cursor-pointer"
        style={{
          top: 16,
          left: sidebarOpen ? 'calc(20rem - 1px)' : 0,
          transition: 'left 0.3s ease',
          background: 'var(--ink-surface)',
          border: '1px solid var(--ink-border)',
          borderLeft: sidebarOpen ? 'none' : '1px solid var(--ink-border)',
          color: 'var(--text-secondary)',
        }}
        title={sidebarOpen ? 'Close settings' : 'Open settings'}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Main content area */}
      <main
        className="h-full overflow-y-auto overflow-x-hidden flex flex-col"
        style={{
          marginLeft: sidebarOpen ? '20rem' : 0,
          transition: 'margin-left 0.3s ease',
          background: 'var(--ink-dark)',
          backgroundImage: `
            radial-gradient(ellipse at 30% 20%, rgba(201, 168, 76, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(232, 75, 58, 0.02) 0%, transparent 50%)
          `,
        }}
      >
        <div className="flex-1 flex items-start justify-center p-6 lg:p-10">
          {mode === 'learn' ? (
            <LearnMode
              text={text}
              currentCharIndex={currentCharIndex}
              onCharIndexChange={setCurrentCharIndex}
              showPinyin={showPinyin}
              gridType={gridType}
              sidebarOpen={sidebarOpen}
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
        </div>

        {/* Footer */}
        <footer
          className="shrink-0 text-center py-3 text-xs"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--ink-border)' }}
        >
          Stroke data powered by{' '}
          <a
            href="https://hanziwriter.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)' }}
          >
            Hanzi Writer
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
