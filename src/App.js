import React, { useState, useEffect } from "react";
import "./App.css";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [autoPlay, setAutoPlay] = useState(null); // null = not chosen, true = 1 player, false = 2 player
  const [showModePopup, setShowModePopup] = useState(true);

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winLine = winnerInfo ? winnerInfo.line : null;
  const isDraw = !winner && squares.every((sq) => sq !== null);
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  // Simple AI: pick first available square
  function autoMove() {
    if (!autoPlay || winner || isDraw || xIsNext) return;
    const empty = squares.map((sq, idx) => (sq === null ? idx : null)).filter(idx => idx !== null);
    if (empty.length === 0) return;
    const move = empty[Math.floor(Math.random() * empty.length)];
    setTimeout(() => {
      handleClick(move, true);
    }, 400);
  }

  useEffect(() => {
    if (autoPlay) autoMove();
    // eslint-disable-next-line
  }, [squares, autoPlay, xIsNext]);

  function handleClick(i, isAuto = false) {
    if (squares[i] || winner) return;
    // If autoPlay and it's O's turn, only allow auto to play O
    if (autoPlay && !xIsNext && !isAuto) return;
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setShowModePopup(true);
    setAutoPlay(null);
  }

  function getStrikeType() {
    if (!winLine) return null;
    if (winLine[0] === 0 && winLine[1] === 1 && winLine[2] === 2) return "row";
    if (winLine[0] === 3 && winLine[1] === 4 && winLine[2] === 5) return "row";
    if (winLine[0] === 6 && winLine[1] === 7 && winLine[2] === 8) return "row";
    if (winLine[0] === 0 && winLine[1] === 3 && winLine[2] === 6) return "col";
    if (winLine[0] === 1 && winLine[1] === 4 && winLine[2] === 7) return "col";
    if (winLine[0] === 2 && winLine[1] === 5 && winLine[2] === 8) return "col";
    if (winLine[0] === 0 && winLine[1] === 4 && winLine[2] === 8) return "diag1";
    if (winLine[0] === 2 && winLine[1] === 4 && winLine[2] === 6) return "diag2";
    return null;
  }

  function renderSquare(i) {
    const isStrike = winLine && winLine.includes(i);
    const strikeType = isStrike ? getStrikeType() : undefined;
    return (
      <button
        className={`square${isStrike ? " strike" : ""}`}
        onClick={() => handleClick(i)}
        {...(isStrike && strikeType ? { 'data-strike': strikeType } : {})}
      >
        {squares[i]}
      </button>
    );
  }

  function handleModeSelect(mode) {
    setAutoPlay(mode === 'auto');
    setShowModePopup(false);
  }

  function toggleMode() {
    setAutoPlay((prev) => !prev);
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      {showModePopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 260 }}>
            <h2>Choose Game Mode</h2>
            <button style={{margin: 8, padding: '10px 20px'}} onClick={() => handleModeSelect('manual')}>Manual (2 Players)</button>
            <button style={{margin: 8, padding: '10px 20px'}} onClick={() => handleModeSelect('auto')}>Auto (1 Player)</button>
          </div>
        </div>
      )}
      <div className="status">{status}</div>
      <div style={{marginBottom: 10}}>
        <button onClick={toggleMode} style={{marginBottom: 10, padding: '6px 16px'}}>
          Switch to {autoPlay ? 'Manual (2 Players)' : 'Auto (1 Player)'}
        </button>
      </div>
      <div className="board-row">
        {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
      </div>
      <button className="restart" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default function App() {
  return <Board />;
}
