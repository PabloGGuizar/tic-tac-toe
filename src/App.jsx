import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// ─────────────────────────────────────────────
//  TRANSLATIONS
// ─────────────────────────────────────────────
const T = {
  es: {
    subtitle: 'Humano vs Inteligencia Artificial',
    diffEasy: 'Fácil', diffMedium: 'Medio', diffHard: 'Difícil',
    you: 'Tú (X)', draw: 'Empate', ai: 'IA (O)',
    winHuman: '🎉 ¡Ganaste!', winAI: '🤖 La IA ganó',
    drawMsg: '🤝 ¡Empate!',
    thinking: '🤔 La IA está pensando…',
    yourTurn: '👆 Tu turno (X)',
    restart: '🔄 Jugar de nuevo',
    viewReport: '📄 Ver resumen',
    // Report strings
    reportTitle: 'Resumen de Partida',
    reportSubtitle: 'Tic-Tac-Toe · Análisis post-partido',
    reportResult: 'Resultado',
    reportMoves: 'Secuencia de jugadas',
    reportMove: 'Jugada',
    reportPlayer: 'Jugador',
    reportCell: 'Celda',
    reportAiScore: 'Score IA',
    reportNarrative: 'Análisis de la partida',
    reportDifficulty: 'Dificultad',
    reportDate: 'Fecha',
    reportTotalMoves: 'Total de jugadas',
    reportGeneratedBy: 'Generado por Tic-Tac-Toe AI',
    reportResultHuman: '🎉 Ganó el Humano (X)',
    reportResultAI: '🤖 Ganó la IA (O)',
    reportResultDraw: '🤝 Empate',
    reportNarrativeFn: (moves, winner, difficulty) => {
      const aiMoves = moves.filter(m => m.player === 'O');
      const humanMoves = moves.filter(m => m.player === 'X');
      let text = `La partida duró ${moves.length} jugadas en total (${humanMoves.length} del humano, ${aiMoves.length} de la IA) en modo ${difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}.\n\n`;
      if (winner === 'X') text += '🎉 El humano logró superar al algoritmo — una hazaña notable, especialmente en modo Difícil.';
      else if (winner === 'O') text += '🤖 La IA ejecutó la partida perfecta. En modo Difícil, Minimax es matemáticamente invencible.';
      else text += '🤝 La partida terminó en empate. Ambos jugadores tomaron decisiones óptimas en los momentos clave.';
      return text;
    },
    // Tree panel
    treeTitle: 'Árbol de decisiones',
    treeWaiting: 'Esperando el turno de la IA…',
    treeEasy: 'La IA en modo Fácil elige al azar — no hay árbol Minimax.',
    treeCell: 'Celda',
    treeScore: 'Score',
    treeChosen: '✓ Elegido',
    treeDepth: 'Profundidad',
    treeToggle: 'Árbol de decisiones',
    // Info modal
    infoTitle: 'Cómo funciona el motor',
    infoClose: 'Cerrar',
    sections: [
      {
        icon: '🧠',
        heading: '¿Qué es Minimax?',
        body: 'Minimax es un algoritmo de lógica pura, no un modelo de lenguaje (como ChatGPT) ni una red neuronal. No fue entrenado con datos ni aprende de experiencias previas.\n\nFunciona de forma completamente determinista: dado un tablero, siempre calcula la misma respuesta óptima siguiendo reglas matemáticas. Es más parecido a las tablas de multiplicar que a la inteligencia artificial generativa.',
      },
      {
        icon: '📐',
        heading: 'Base matemática',
        body: 'Cada nodo del árbol de juego tiene un valor numérico:\n• IA gana → +10 − profundidad\n• Humano gana → profundidad − 10\n• Empate → 0\n\nRestar la profundidad prioriza victorias rápidas sobre lentas.',
      },
      {
        icon: '♟️',
        heading: 'Maximizador vs Minimizador',
        body: 'La IA (O) es el maximizador: siempre elige el movimiento con el valor más alto.\nEl humano (X) es el minimizador: el algoritmo asume que elegirás el movimiento que le resulte más dañino a la IA.\n\nEsto garantiza que la IA nunca pierda en modo Difícil.',
      },
      {
        icon: '🌲',
        heading: 'Árbol de juego',
        body: 'Con 9 celdas, el árbol puede tener hasta 9! = 362,880 hojas. La IA evalúa cada rama antes de decidir. En Difícil, evalúa el 100%. En Medio, sólo el 50% de las veces usa Minimax; el otro 50% elige aleatoriamente.',
      },
      {
        icon: '🎲',
        heading: 'Niveles de dificultad',
        body: '• Fácil: movimiento completamente aleatorio entre celdas libres.\n• Medio: 50% aleatorio / 50% Minimax óptimo. Comete errores deliberadamente.\n• Difícil: Minimax puro. Juega la partida perfecta — nunca pierde.',
      },
      {
        icon: '⚡',
        heading: '¿Qué tan rápido es?',
        body: 'Antes de hacer su jugada, la IA puede analizar hasta 362,880 tableros posibles — todos los futuros que podrían ocurrir desde ese momento.\n\nEn la práctica es mucho más rápido: si encuentra una victoria segura, deja de buscar. Por eso la respuesta es instantánea aunque el análisis sea exhaustivo.\n\nEste mismo principio se usa en ajedrez, aunque allí el número de posibles tableros es tan enorme que la IA necesita trucos adicionales para no tardar horas.',
      },
    ],
  },
  en: {
    subtitle: 'Human vs Artificial Intelligence',
    diffEasy: 'Easy', diffMedium: 'Medium', diffHard: 'Hard',
    you: 'You (X)', draw: 'Draw', ai: 'AI (O)',
    winHuman: '🎉 You won!', winAI: '🤖 AI wins',
    drawMsg: "🤝 It's a Draw!",
    thinking: '🤔 AI is thinking…',
    yourTurn: '👆 Your turn (X)',
    restart: '🔄 Play again',
    viewReport: '📄 View summary',
    // Report strings
    reportTitle: 'Game Summary',
    reportSubtitle: 'Tic-Tac-Toe · Post-game Analysis',
    reportResult: 'Result',
    reportMoves: 'Move sequence',
    reportMove: 'Move',
    reportPlayer: 'Player',
    reportCell: 'Cell',
    reportAiScore: 'AI Score',
    reportNarrative: 'Game analysis',
    reportDifficulty: 'Difficulty',
    reportDate: 'Date',
    reportTotalMoves: 'Total moves',
    reportGeneratedBy: 'Generated by Tic-Tac-Toe AI',
    reportResultHuman: '🎉 Human Won (X)',
    reportResultAI: '🤖 AI Won (O)',
    reportResultDraw: '🤝 Draw',
    reportNarrativeFn: (moves, winner, difficulty) => {
      const aiMoves = moves.filter(m => m.player === 'O');
      const humanMoves = moves.filter(m => m.player === 'X');
      let text = `The game lasted ${moves.length} total moves (${humanMoves.length} human, ${aiMoves.length} AI) on ${difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'} difficulty.\n\n`;
      if (winner === 'X') text += '🎉 The human managed to beat the algorithm — a remarkable feat, especially on Hard mode.';
      else if (winner === 'O') text += '🤖 The AI played a perfect game. On Hard mode, Minimax is mathematically unbeatable.';
      else text += '🤝 The game ended in a draw. Both players made optimal decisions at the key moments.';
      return text;
    },
    // Tree panel
    treeTitle: 'Decision Tree',
    treeWaiting: 'Waiting for AI turn…',
    treeEasy: 'AI in Easy mode picks randomly — no Minimax tree.',
    treeCell: 'Cell',
    treeScore: 'Score',
    treeChosen: '✓ Chosen',
    treeDepth: 'Depth',
    treeToggle: 'Decision tree',
    // Info modal
    infoTitle: 'How the engine works',
    infoClose: 'Close',
    sections: [
      {
        icon: '🧠',
        heading: 'What is Minimax?',
        body: 'Minimax is pure logic — not a language model (like ChatGPT) and not a neural network. It was never trained on data and it does not learn from experience.\n\nIt works in a completely deterministic way: given the same board, it always computes the same optimal answer using mathematical rules. Think of it as closer to a multiplication table than to generative AI.',
      },
      {
        icon: '📐',
        heading: 'Mathematical basis',
        body: 'Each node in the game tree holds a numeric value:\n• AI wins → +10 − depth\n• Human wins → depth − 10\n• Draw → 0\n\nSubtracting depth prioritizes faster wins over slower ones.',
      },
      {
        icon: '♟️',
        heading: 'Maximizer vs Minimizer',
        body: 'The AI (O) is the maximizer: it always picks the move with the highest score.\nThe human (X) is the minimizer: the algorithm assumes you will always play the move most harmful to the AI.\n\nThis guarantees the AI never loses on Hard mode.',
      },
      {
        icon: '🌲',
        heading: 'Game tree',
        body: 'With 9 cells the tree can have up to 9! = 362,880 leaves. The AI evaluates every branch before deciding. On Hard it evaluates 100%. On Medium it uses Minimax only 50% of the time; the other 50% it picks at random.',
      },
      {
        icon: '🎲',
        heading: 'Difficulty levels',
        body: '• Easy: completely random move among free cells.\n• Medium: 50% random / 50% optimal Minimax. Makes deliberate mistakes.\n• Hard: pure Minimax. Plays the perfect game — never loses.',
      },
      {
        icon: '⚡',
        heading: 'How fast is it?',
        body: 'Before making a move, the AI can analyze up to 362,880 possible boards — every future that could unfold from that moment.\n\nIn practice it is much faster: if it finds a guaranteed win it stops searching early. That is why the response feels instant even though the analysis is exhaustive.\n\nThis same principle powers chess engines, though there the number of possible positions is so enormous that the AI needs extra tricks to avoid taking hours to respond.',
      },
    ],
  },
};

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const CELL_NAMES = ['↖', '↑', '↗', '←', '·', '→', '↙', '↓', '↘'];

// ─────────────────────────────────────────────
//  GAME LOGIC HELPERS
// ─────────────────────────────────────────────
function calculateWinner(squares) {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

function getRandomMove(squares) {
  const available = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

// ─────────────────────────────────────────────
//  MINIMAX (original — fast, no tree capture)
// ─────────────────────────────────────────────
function minimax(squares, depth, isMaximizing) {
  const result = calculateWinner(squares);
  if (result) return result.winner === 'O' ? 10 - depth : depth - 10;
  if (isBoardFull(squares)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const next = [...squares];
        next[i] = 'O';
        best = Math.max(best, minimax(next, depth + 1, false));
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const next = [...squares];
        next[i] = 'X';
        best = Math.min(best, minimax(next, depth + 1, true));
      }
    }
    return best;
  }
}

// ─────────────────────────────────────────────
//  MINIMAX WITH TREE CAPTURE (for visualization)
//  Only called when the tree panel is visible.
//  maxVisDepth controls how deep we capture children.
// ─────────────────────────────────────────────
function minimaxWithTree(squares, depth, isMaximizing, maxVisDepth = 3) {
  const result = calculateWinner(squares);
  if (result) {
    const score = result.winner === 'O' ? 10 - depth : depth - 10;
    return { score, terminal: true, winner: result.winner, children: [] };
  }
  if (isBoardFull(squares)) {
    return { score: 0, terminal: true, winner: null, children: [] };
  }

  const children = [];
  let best = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const next = [...squares];
      next[i] = isMaximizing ? 'O' : 'X';

      let childScore;
      let childNode;

      if (depth < maxVisDepth - 1) {
        // Recurse with tree capture
        childNode = minimaxWithTree(next, depth + 1, !isMaximizing, maxVisDepth);
        childScore = childNode.score;
      } else {
        // Beyond vis depth: just compute score, no children
        childScore = minimax(next, depth + 1, !isMaximizing);
        childNode = { score: childScore, terminal: false, children: [], cellIndex: i, board: next };
      }

      childNode.cellIndex = i;
      childNode.board = next;
      childNode.player = isMaximizing ? 'O' : 'X';

      children.push(childNode);

      if (isMaximizing) best = Math.max(best, childScore);
      else best = Math.min(best, childScore);
    }
  }

  return { score: best, terminal: false, children, isMaximizing };
}

function getBestMove(squares) {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const next = [...squares];
      next[i] = 'O';
      const moveVal = minimax(next, 0, false);
      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function getAIMove(squares, difficulty) {
  if (difficulty === 'easy') return getRandomMove(squares);
  if (difficulty === 'hard') return getBestMove(squares);
  return Math.random() < 0.5 ? getRandomMove(squares) : getBestMove(squares);
}

// ─────────────────────────────────────────────
//  SVG ICONS
// ─────────────────────────────────────────────
function XIcon() {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="draw-line" />
      <line x1="50" y1="10" x2="10" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="draw-line draw-line--delayed" />
    </svg>
  );
}

function OIcon() {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="draw-circle" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  MINI BOARD (for tree nodes)
// ─────────────────────────────────────────────
function MiniBoard({ board }) {
  return (
    <div className="mini-board">
      {board.map((cell, idx) => (
        <div
          key={idx}
          className={`mini-cell ${cell === 'X' ? 'mini-cell--x' : cell === 'O' ? 'mini-cell--o' : ''}`}
        >
          {cell || ''}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  TREE NODE COMPONENT (compact style)
// ─────────────────────────────────────────────
function TreeNode({ node, chosenCellIndex, depth, lang, maxDepth }) {
  const t = T[lang];
  const isChosen = depth === 1 && node.cellIndex === chosenCellIndex;
  const scoreColor =
    node.score > 0 ? 'positive' : node.score < 0 ? 'negative' : 'neutral';

  return (
    <div className={`tn-wrapper ${isChosen ? 'tn-wrapper--chosen' : ''}`}>
      {/* Node box */}
      <div className={`tn-box tn-box--${scoreColor} ${isChosen ? 'tn-box--chosen' : ''}`}>
        {/* Player badge */}
        <span className={`tn-player tn-player--${node.player?.toLowerCase()}`}>
          {node.player || '?'}
        </span>
        {/* Cell position */}
        <span className="tn-cell">
          {CELL_NAMES[node.cellIndex]}
          <span className="tn-cell-num">{node.cellIndex}</span>
        </span>
        {/* Score */}
        <span className={`tn-score tn-score--${scoreColor}`}>
          {node.score > 0 ? '+' : ''}{node.score}
        </span>
        {/* Chosen badge */}
        {isChosen && (
          <span className="tn-chosen-badge">{t.treeChosen}</span>
        )}
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && depth < maxDepth && (
        <div className="tn-children">
          <div className="tn-children-line" />
          <div className="tn-children-row">
            {node.children.map((child, i) => (
              <div key={i} className="tn-child-wrap">
                <div className="tn-connector-v" />
                <TreeNode
                  node={child}
                  chosenCellIndex={chosenCellIndex}
                  depth={depth + 1}
                  lang={lang}
                  maxDepth={maxDepth}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  DECISION TREE PANEL
// ─────────────────────────────────────────────
function DecisionTreePanel({ treeData, chosenCellIndex, isVisible, lang, difficulty, isAIThinking }) {
  const t = T[lang];
  const MAX_VIS_DEPTH = 2; // how many levels of children to show

  return (
    <div className={`tree-panel ${isVisible ? 'tree-panel--visible' : 'tree-panel--hidden'}`}>
      {/* Header */}
      <div className="tree-panel__header">
        <span className="tree-panel__icon">🌲</span>
        <h3 className="tree-panel__title">{t.treeTitle}</h3>
        {isAIThinking && <span className="tree-panel__thinking-dot" />}
      </div>

      {/* Content */}
      <div className="tree-panel__body">
        {difficulty === 'easy' ? (
          <div className="tree-panel__empty">
            <span className="tree-panel__empty-icon">🎲</span>
            <p>{t.treeEasy}</p>
          </div>
        ) : !treeData ? (
          <div className="tree-panel__empty">
            <span className="tree-panel__empty-icon">⏳</span>
            <p>{t.treeWaiting}</p>
          </div>
        ) : (
          <div className="tree-panel__tree">
            {/* Legend */}
            <div className="tree-legend">
              <span className="tree-legend-item tree-legend-item--x">X min</span>
              <span className="tree-legend-item tree-legend-item--o">O max</span>
              <span className="tree-legend-item tree-legend-item--pos">+score</span>
              <span className="tree-legend-item tree-legend-item--neg">−score</span>
            </div>

            {/* Root label */}
            <div className="tree-root-label">
              <div className="tree-root-box">
                <span>🤖 IA</span>
                <span className="tree-root-score">{treeData.score > 0 ? '+' : ''}{treeData.score}</span>
              </div>
              <div className="tree-root-connector" />
            </div>

            {/* First level nodes (direct moves the AI considers) */}
            <div className="tree-level-1">
              {treeData.children && treeData.children
                .slice()
                .sort((a, b) => b.score - a.score) // best first
                .map((child, i) => (
                  <div key={i} className="tree-level-1-item">
                    <TreeNode
                      node={child}
                      chosenCellIndex={chosenCellIndex}
                      depth={1}
                      lang={lang}
                      maxDepth={MAX_VIS_DEPTH}
                    />
                  </div>
                ))}
            </div>

            {/* Depth indicator */}
            <div className="tree-depth-info">
              <span>{t.treeDepth}: {MAX_VIS_DEPTH} {lang === 'es' ? 'niveles' : 'levels'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  INFO MODAL
// ─────────────────────────────────────────────
function InfoModal({ onClose, lang }) {
  const t = T[lang];
  const overlayRef = useRef(null);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={t.infoTitle}>
        {/* Header */}
        <div className="modal__header">
          <div className="modal__title-row">
            <span className="modal__icon-title">⚙️</span>
            <h2 className="modal__title">{t.infoTitle}</h2>
          </div>
          <button className="modal__close" onClick={onClose} aria-label={t.infoClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Game Tree Visual */}
        <div className="modal__tree">
          <div className="tree-root">
            <div className="tree-node tree-node--root">?</div>
            <div className="tree-branches">
              <div className="tree-branch">
                <div className="tree-node tree-node--x">X</div>
                <div className="tree-subbranches">
                  <div className="tree-node tree-node--o tree-node--sm">O</div>
                  <div className="tree-node tree-node--o tree-node--sm">O</div>
                </div>
              </div>
              <div className="tree-branch">
                <div className="tree-node tree-node--x">X</div>
                <div className="tree-subbranches">
                  <div className="tree-node tree-node--o tree-node--sm">O</div>
                  <div className="tree-node tree-node--score tree-node--sm">+10</div>
                </div>
              </div>
              <div className="tree-branch">
                <div className="tree-node tree-node--x">X</div>
                <div className="tree-subbranches">
                  <div className="tree-node tree-node--score tree-node--sm tree-node--neg">-10</div>
                  <div className="tree-node tree-node--score tree-node--sm">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="modal__body">
          {t.sections.map((s, i) => (
            <div className="modal__section" key={i}>
              <div className="modal__section-head">
                <span className="modal__section-icon">{s.icon}</span>
                <h3 className="modal__section-title">{s.heading}</h3>
              </div>
              <p className="modal__section-body">
                {s.body.split('\n').map((line, j) =>
                  line.startsWith('•') ? (
                    <span key={j} className="modal__bullet">
                      <span className="bullet-dot">▸</span>{line.slice(1)}
                    </span>
                  ) : (
                    <span key={j}>{line}<br /></span>
                  )
                )}
              </p>
            </div>
          ))}
        </div>

        <button className="modal__close-btn" onClick={onClose}>{t.infoClose}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SQUARE COMPONENT
// ─────────────────────────────────────────────
function Square({ value, onClick, isWinner, isDisabled }) {
  return (
    <button
      className={`square ${value ? `square--${value.toLowerCase()}` : ''} ${isWinner ? 'square--winner' : ''} ${isDisabled ? 'square--disabled' : ''}`}
      onClick={onClick}
      disabled={isDisabled || !!value}
      aria-label={value || 'empty'}
    >
      <span className="square__inner">
        {value === 'X' && <XIcon />}
        {value === 'O' && <OIcon />}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
//  BOARD COMPONENT
// ─────────────────────────────────────────────
function Board({ squares, winnerLine, onSquareClick, isDisabled }) {
  return (
    <div className="board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onSquareClick(idx)}
          isWinner={winnerLine?.includes(idx)}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  SCORE CARD
// ─────────────────────────────────────────────
function ScoreCard({ scores, lang }) {
  const t = T[lang];
  return (
    <div className="scoreboard">
      <div className="score-item score-item--player">
        <span className="score-label">{t.you}</span>
        <span className="score-value">{scores.human}</span>
      </div>
      <div className="score-item score-item--draw">
        <span className="score-label">{t.draw}</span>
        <span className="score-value">{scores.draws}</span>
      </div>
      <div className="score-item score-item--ai">
        <span className="score-label">{t.ai}</span>
        <span className="score-value">{scores.ai}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DIFFICULTY SELECTOR
// ─────────────────────────────────────────────
function DifficultySelector({ difficulty, onChange, disabled, lang }) {
  const t = T[lang];
  const labels = { easy: t.diffEasy, medium: t.diffMedium, hard: t.diffHard };
  return (
    <div className="difficulty-selector">
      {Object.entries(labels).map(([key, label]) => (
        <button
          key={key}
          className={`diff-btn diff-btn--${key} ${difficulty === key ? 'diff-btn--active' : ''}`}
          onClick={() => onChange(key)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  STATUS BANNER
// ─────────────────────────────────────────────
function StatusBanner({ winner, isDraw, isAIThinking, isHumanTurn, lang }) {
  const t = T[lang];
  let text = '', cls = 'status';

  if (winner) {
    text = winner === 'X' ? t.winHuman : t.winAI;
    cls += winner === 'X' ? ' status--win' : ' status--lose';
  } else if (isDraw) {
    text = t.drawMsg;
    cls += ' status--draw';
  } else if (isAIThinking) {
    text = t.thinking;
    cls += ' status--thinking';
  } else if (isHumanTurn) {
    text = t.yourTurn;
    cls += ' status--human';
  } else {
    text = '⏳';
  }

  return <div className={cls}>{text}</div>;
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  MINI BOARD COMPONENT (for Report)
// ─────────────────────────────────────────────
function ReportMiniBoard({ board, winnerLine }) {
  return (
    <div className="report-mini-board">
      {board.map((val, i) => {
        const isWin = winnerLine?.includes(i);
        return (
          <div key={i} className={`rm-cell ${isWin ? 'rm-cell--win' : ''} ${val ? `rm-cell--${val.toLowerCase()}` : ''}`}>
            {val === 'X' && <XIcon />}
            {val === 'O' && <OIcon />}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  REPORT MODAL
// ─────────────────────────────────────────────
function ReportModal({ gameHistory, winner, isDraw, difficulty, lang, onClose }) {
  const t = T[lang];
  const overlayRef = useRef(null);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const diffLabel = { easy: t.diffEasy, medium: t.diffMedium, hard: t.diffHard }[difficulty];
  const resultLabel = winner === 'X' ? t.reportResultHuman : winner === 'O' ? t.reportResultAI : t.reportResultDraw;
  const dateStr = new Date().toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'long', timeStyle: 'short' });
  const narrative = t.reportNarrativeFn(gameHistory, winner, difficulty);

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal report-modal" role="dialog" aria-modal="true" aria-label={t.reportTitle}>
        <div className="modal__header">
          <div className="modal__title-row">
            <span className="modal__icon-title">🎮</span>
            <div>
              <h2 className="modal__title" style={{ fontSize: '1.4rem' }}>
                <span className="x-color">X</span> · <span className="o-color">O</span> {t.reportTitle}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{t.reportSubtitle}</p>
            </div>
          </div>
          <button className="modal__close" onClick={onClose} aria-label={t.infoClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal__body" style={{ padding: '20px 24px' }}>
          <div className="report-meta">
            <div className="report-meta-item">
              <span className="report-meta-label">{t.reportResult}</span>
              <span className={`report-meta-value report-meta-value--${winner ? winner.toLowerCase() : 'draw'}`}>{resultLabel}</span>
            </div>
            <div className="report-meta-item">
              <span className="report-meta-label">{t.reportDifficulty}</span>
              <span className="report-meta-value">{diffLabel}</span>
            </div>
            <div className="report-meta-item">
              <span className="report-meta-label">{t.reportTotalMoves}</span>
              <span className="report-meta-value">{gameHistory.length}</span>
            </div>
            <div className="report-meta-item">
              <span className="report-meta-label">{t.reportDate}</span>
              <span className="report-meta-value" style={{ fontSize: '0.8rem' }}>{dateStr}</span>
            </div>
          </div>

          <div className="report-card">
            <h3 className="report-h3">📊 {t.reportNarrative}</h3>
            <p className="report-narrative">{narrative}</p>
          </div>

          <div className="report-card">
            <h3 className="report-h3">🔢 {t.reportMoves}</h3>
            <div className="report-moves">
              {gameHistory.map((move, i) => {
                const isAI = move.player === 'O';
                const winLine = i === gameHistory.length - 1 && winner ? move.winnerLine : null;
                const scoreColor = move.aiScore > 0 ? 'pos' : move.aiScore < 0 ? 'neg' : 'neu';

                return (
                  <div key={i} className={`report-move-row report-move-row--${isAI ? 'o' : 'x'}`}>
                    <div className="report-move-num">
                      <span>{t.reportMove}</span>
                      <strong>{i + 1}</strong>
                    </div>
                    <ReportMiniBoard board={move.boardAfter} winnerLine={winLine} />
                    <div className="report-move-details">
                      <div className="report-move-badge-row">
                        <span className={`report-player-badge report-player-badge--${isAI ? 'o' : 'x'}`}>{move.player}</span>
                        <span className="report-cell-pos">{`${CELL_NAMES[move.cell]} (${move.cell})`}</span>
                      </div>
                      <div className="report-score-row">
                        <span className="report-score-label">{t.reportAiScore}:</span>
                        {move.aiScore !== null ? (
                          <span className={`report-score-val report-score-val--${scoreColor}`}>
                            {move.aiScore > 0 ? '+' : ''}{move.aiScore}
                          </span>
                        ) : (
                          <span className="report-score-val-rand">{lang === 'es' ? 'Aleatorio' : 'Random'}</span>
                        )}
                      </div>
                      {i === gameHistory.length - 1 && (winner || isDraw) && (
                        <span className={`report-final-result report-final-result--${winner ? winner.toLowerCase() : 'draw'}`}>
                          {resultLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button className="modal__close-btn" onClick={onClose}>{t.infoClose}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [difficulty, setDifficulty] = useState('hard');
  const [scores, setScores] = useState({ human: 0, draws: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [resultKey, setResultKey] = useState(0);
  const [lang, setLang] = useState('es');
  const [showInfo, setShowInfo] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showTree, setShowTree] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [chosenCellIndex, setChosenCellIndex] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showReport, setShowReport] = useState(false);
  // Ref to capture pending AI score for the history entry
  const pendingAiScoreRef = useRef(null);

  const t = T[lang];
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winnerLine = winnerInfo?.line;
  const isDraw = !winner && isBoardFull(squares);

  // Detect end of game and update scores
  useEffect(() => {
    if ((winner || isDraw) && !gameOver) {
      setGameOver(true);
      setScores((prev) => ({
        human: winner === 'X' ? prev.human + 1 : prev.human,
        draws: isDraw ? prev.draws + 1 : prev.draws,
        ai: winner === 'O' ? prev.ai + 1 : prev.ai,
      }));
    }
  }, [winner, isDraw, gameOver]);

  // AI move effect
  useEffect(() => {
    if (!isHumanTurn && !gameOver) {
      setIsAIThinking(true);

      // Capture tree if panel is visible and difficulty uses Minimax
      let aiScore = null;
      if (difficulty !== 'easy') {
        // Always compute best move score for history, tree display is separate
        const bestMove = getBestMove(squares);
        if (bestMove !== -1) {
          const next = [...squares]; next[bestMove] = 'O';
          aiScore = minimax(next, 0, false);
        }
        if (showTree) {
          const tree = minimaxWithTree(squares, 0, true, 3);
          setTreeData(tree);
        }
      }
      pendingAiScoreRef.current = aiScore;

      const delay = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 500 : 600;
      const timer = setTimeout(() => {
        const move = getAIMove(squares, difficulty);
        if (move === -1) {
          setIsAIThinking(false);
          setIsHumanTurn(true);
          return;
        }
        
        const next = [...squares];
        next[move] = 'O';
        
        // Record AI move in history OUTSIDE of setSquares to avoid strict mode double invocation
        const winInfo = calculateWinner(next);
        setGameHistory(h => [...h, {
          player: 'O',
          cell: move,
          boardAfter: next,
          aiScore: pendingAiScoreRef.current,
          winnerLine: winInfo?.line ?? null,
        }]);

        setChosenCellIndex(move);
        setSquares(next);
        setIsAIThinking(false);
        setIsHumanTurn(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, gameOver, difficulty, showTree, squares]);

  const handleSquareClick = useCallback(
    (index) => {
      if (!isHumanTurn || gameOver || squares[index] || isAIThinking) return;
      const next = [...squares];
      next[index] = 'X';
      setSquares(next);
      setIsHumanTurn(false);
      // Clear tree when human moves
      setTreeData(null);
      setChosenCellIndex(null);
      // Record human move in history
      const winInfo = calculateWinner(next);
      setGameHistory(h => [...h, {
        player: 'X',
        cell: index,
        boardAfter: next,
        aiScore: null,
        winnerLine: winInfo?.line ?? null,
      }]);
    },
    [isHumanTurn, gameOver, squares, isAIThinking]
  );

  const handleViewReport = () => {
    setShowReport(true);
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setIsHumanTurn(true);
    setGameOver(false);
    setIsAIThinking(false);
    setResultKey((k) => k + 1);
    setTreeData(null);
    setChosenCellIndex(null);
    setGameHistory([]);
  };

  const handleDifficultyChange = (d) => {
    setDifficulty(d);
    handleRestart();
  };

  const toggleLang = () => setLang((l) => (l === 'es' ? 'en' : 'es'));
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const toggleTree = () => setShowTree((s) => !s);

  return (
    <div className={`app app--${theme}`}>
      {/* Ambient blobs */}
      <div className="blob blob--1" />
      <div className="blob blob--2" />
      <div className="blob blob--3" />

      {/* Top-right toolbar */}
      <div className="toolbar">
        <button
          className="tool-btn"
          onClick={() => setShowInfo(true)}
          aria-label="Información del motor"
          title={lang === 'es' ? 'Cómo funciona' : 'How it works'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2.5" />
            <line x1="12" y1="12" x2="12" y2="16" strokeWidth="2" />
          </svg>
        </button>

        {/* Tree toggle button */}
        <button
          className={`tool-btn tree-toggle-btn ${showTree ? 'tool-btn--active' : ''}`}
          onClick={toggleTree}
          aria-label={t.treeToggle}
          title={t.treeToggle}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <circle cx="4" cy="20" r="2" />
            <circle cx="20" cy="20" r="2" />
            <line x1="12" y1="6" x2="12" y2="12" />
            <line x1="12" y1="12" x2="4" y2="18" />
            <line x1="12" y1="12" x2="20" y2="18" />
          </svg>
        </button>

        <button
          className="tool-btn theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? (lang === 'es' ? 'Tema claro' : 'Light mode') : (lang === 'es' ? 'Tema oscuro' : 'Dark mode')}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button
          className="tool-btn lang-btn"
          onClick={toggleLang}
          aria-label="Change language"
          title="ES / EN"
        >
          <span className="lang-flag">{lang === 'es' ? '🇲🇽' : '🇺🇸'}</span>
          <span className="lang-code">{lang === 'es' ? 'ES' : 'EN'}</span>
        </button>
      </div>

      {/* Main layout: game + tree panel side by side */}
      <div className={`game-layout ${showTree ? 'game-layout--with-tree' : ''}`}>
        {/* Game column */}
        <div className="container">
          <header className="header">
            <h1 className="title">
              <span className="title__x">X</span>
              <span className="title__sep"> · </span>
              <span className="title__o">O</span>
              <span className="title__text"> Tic-Tac-Toe</span>
            </h1>
            <p className="subtitle">{t.subtitle}</p>
          </header>

          <DifficultySelector
            difficulty={difficulty}
            onChange={handleDifficultyChange}
            disabled={isAIThinking}
            lang={lang}
          />

          <ScoreCard scores={scores} lang={lang} />

          <StatusBanner
            winner={winner}
            isDraw={isDraw}
            isAIThinking={isAIThinking}
            isHumanTurn={isHumanTurn && !gameOver}
            lang={lang}
          />

          <div className={`board-wrapper ${gameOver ? 'board-wrapper--done' : ''}`} key={resultKey}>
            <Board
              squares={squares}
              winnerLine={winnerLine}
              onSquareClick={handleSquareClick}
              isDisabled={!isHumanTurn || gameOver || isAIThinking}
            />
          </div>

          {gameOver && (
            <div className="end-actions">
              <button className="btn-restart" onClick={handleRestart}>
                {t.restart}
              </button>
              <button className="btn-download" onClick={handleViewReport}>
                {t.viewReport}
              </button>
            </div>
          )}
        </div>

        {/* Decision Tree Panel */}
        <DecisionTreePanel
          treeData={treeData}
          chosenCellIndex={chosenCellIndex}
          isVisible={showTree}
          lang={lang}
          difficulty={difficulty}
          isAIThinking={isAIThinking}
        />
      </div>

      {showReport && (
        <ReportModal
          gameHistory={gameHistory}
          winner={winner}
          isDraw={isDraw}
          difficulty={difficulty}
          lang={lang}
          onClose={() => setShowReport(false)}
        />
      )}

      {showInfo && (
        <InfoModal
          onClose={() => setShowInfo(false)}
          lang={lang}
        />
      )}

      <footer className="app-footer">
        <p>
          © 2026 X · O: Tic-Tac-Toe — Desarrollado por{' '}
          <a href="https://www.linkedin.com/in/pablogguizar/" target="_blank" rel="noopener noreferrer">
            Pablo G. Guízar
          </a>
          . Código abierto bajo licencia MIT disponible en{' '}
          <a href="https://github.com/PabloGGuizar/tic-tac-toe" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
