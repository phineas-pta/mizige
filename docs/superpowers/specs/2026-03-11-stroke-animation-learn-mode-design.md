# Stroke Animation Learn Mode — Design Spec

**Date:** 2026-03-11
**Status:** Approved

## Overview

A dedicated "Learn" mode in the 米字格 app that provides interactive stroke animation and quiz functionality. Students step through characters in a flashcard flow: watch an animated stroke demonstration, then attempt to write the character from memory.

**Rendering architecture note:** The existing Worksheet mode renders characters using raw SVG path data from `hanzi-writer-data` (via `loadStrokeData()` in `strokes.ts`). Learn mode introduces `hanzi-writer`'s runtime library (already installed but previously unused) for its animation and quiz APIs. Both use the same underlying stroke data — the visual output is consistent.

## Navigation

- A **Worksheet | Learn** toggle added to the top of the settings panel, below the logo area
- Both modes share the same text input — the characters entered are what the student practices
- Switching modes preserves all state (text, settings)
- In Learn mode, worksheet-only settings are hidden: trace cells, blank cells, cell size, max stroke frames, paper size, and Export PDF button

## Learn Mode UI

### Main Area (replaces worksheet preview)

- **Progress bar** at top: shows current character position (e.g., "3 / 7 characters")
- **Flashcard card** centered in the main area with rice paper background (`#f5e6c8`):
  - Pinyin displayed above the canvas (when Show Pinyin is enabled)
  - Large `hanzi-writer` canvas (~250–300px on desktop, responsive)
  - Mizige or tianzige grid lines rendered as a sibling SVG behind the hanzi-writer SVG via absolute positioning/z-index
  - Stroke count displayed below (e.g., "11 strokes")
- **Navigation controls** below the card:
  - **Prev / Next** buttons to move between characters
  - Prev disabled on first character, Next disabled on last character

### Two Phases Per Character

1. **Watch phase**
   - Animation auto-plays when entering a character card
   - Strokes draw one by one (fixed speed: `strokeAnimationSpeed: 1`, `delayBetweenStrokes: 800ms`)
   - "Replay" button available after animation completes
   - Transitions to Quiz phase after animation finishes

2. **Quiz phase**
   - Canvas clears showing only faint outline
   - Student draws strokes with mouse/finger
   - `hanzi-writer` provides real-time feedback:
     - Correct stroke: drawn in ink color
     - Wrong stroke: hint shown after a brief pause
   - On completion (all strokes drawn correctly), auto-advances to next character after ~1s delay
   - If on the last character, shows a simple "Complete!" state with a "Start Over" button

### Edge Cases

- **Empty text input:** Show a placeholder message centered in the main area (similar to Worksheet mode's empty state): "Enter Chinese characters to start learning"
- **Character not in hanzi-writer-data:** Skip the character silently — exclude it from the Learn mode character list. The progress bar reflects only available characters.
- **Single character:** Prev/Next both disabled. On quiz completion, show the completion state directly.

### Responsive Behavior

- On mobile, the card and canvas scale down appropriately
- Mobile header shows "Settings" / "Learn" toggle (replacing the existing "Settings" / "Preview" text when in Learn mode)

## Settings Panel Changes

### Always visible (both modes)
- Logo area
- **Mode toggle: Worksheet | Learn** (new)
- Text input
- Display section: Show Pinyin toggle
- Grid Type selector

### Worksheet mode only (hidden in Learn mode)
- Stroke Order toggle (controls static stroke frames on worksheet — not relevant to Learn mode's built-in animation)
- Layout section: Trace cells, Blank cells, Cell size, Max stroke frames
- Paper Size selector
- Export PDF button

## Technical Implementation

### hanzi-writer Integration

```typescript
import HanziWriter from 'hanzi-writer';

const writer = HanziWriter.create(element, character, {
  width: 300,
  height: 300,
  padding: 20,
  strokeColor: '#2c2018',
  highlightColor: '#e84b3a',
  radicalColor: '#2c2018',
  strokeAnimationSpeed: 1,
  delayBetweenStrokes: 800,
  renderer: 'svg',
});

// Watch phase
writer.animateCharacter({
  onComplete: () => { /* transition to quiz */ }
});

// Quiz phase
writer.quiz({
  onComplete: () => { /* auto-advance to next character */ }
});
```

### Cleanup on Character Change

When `currentCharIndex` changes, the previous `HanziWriter` instance must be destroyed to prevent memory leaks. Call `writer.cancelQuiz()` and remove the writer's DOM elements before creating a new instance. Use a React `useEffect` cleanup function:

```typescript
useEffect(() => {
  const writer = HanziWriter.create(containerRef.current, char, options);
  // ... setup animation/quiz
  return () => {
    writer.cancelQuiz();
    writer.target().node.remove(); // clean up SVG
  };
}, [char]);
```

### New Components

- **`LearnMode.tsx`** — Main Learn mode view, manages character navigation and internal phase state (`watch` | `quiz`)
- **`CharacterCard.tsx`** — Individual character card with hanzi-writer canvas, grid overlay, pinyin, and stroke count
- **`LearnControls.tsx`** — Prev/Next navigation and progress bar

### State in App.tsx

- New state: `mode: 'worksheet' | 'learn'`
- New state: `currentCharIndex: number` (for Learn mode navigation)

Phase state (`watch` | `quiz`) is internal to `LearnMode.tsx` — not lifted to App.

### Grid Overlay

The mizige/tianzige grid lines are rendered as an absolutely positioned SVG element behind the hanzi-writer canvas within a `position: relative` container. Uses the same line styles as the worksheet cells (dashed cross lines, optional diagonal lines for mizige). The viewBox matches hanzi-writer's coordinate system.

### Data Flow

1. User enters text in sidebar → `extractChineseChars()` produces character list
2. Filter out characters not available in hanzi-writer-data (using existing `loadStrokeData()` cache)
3. In Learn mode, `currentCharIndex` determines which character is active
4. `HanziWriter.create()` is called with the active character
5. Watch phase auto-plays → Quiz phase → auto-advance increments index
6. Grid type setting flows to the grid overlay component

## Colors & Styling

| Element | Color |
|---------|-------|
| Stroke ink | `#2c2018` |
| Highlight / current stroke | `#e84b3a` |
| Card background | `#f5e6c8` (rice paper) |
| Grid guide lines | `#dbc8a8` |
| Grid border | `#c4a882` |
| Progress bar fill | `linear-gradient(90deg, #e84b3a, #c9a84c)` |
| Progress bar track | `var(--ink-border)` |

## Out of Scope

- Saving progress / scores across sessions
- Difficulty levels or adaptive learning
- Sound effects
- Multi-user / accounts
- Stroke accuracy scoring display
- Animation speed configurability (fixed at sensible defaults)
