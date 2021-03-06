import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

// COMPONENTS

function Square({ isWinning, onClick, value }) {
  return (
    <button
      className={"square " + (isWinning ? "square--winning" : null)}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function SquaresList({ count, squares, winningSquares, onClick }) {
  let squareCount = [];
  for (let i = count; i < count + 3; i++) {
    squareCount.push(i);
  }

  return (
    <div className="board-row"> 
      {
        squareCount.map((i) => {
          return (
            <Square
              isWinning={winningSquares.includes(i)}
              key={"square " + i}
              value={squares[i]}
              onClick={() => onClick(i)}
            />
          )
        })
      }
    </div>
  )
}

function Moves({move, steps, desc, jumpTo}) {
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>
        {move === steps.stepNumber ? <b>{desc}</b> : desc}
      </button>
    </li>
  );
}

function Board(props) {
  return (
    <div>
      <SquaresList count={0} {...props} />
      <SquaresList count={3} {...props} />
      <SquaresList count={6} {...props} />
    </div>
  );
}

// HOOKS

function useHistory() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  return { history, setHistory };
}

function useSteps() {
  const [steps, setSteps] = useState({
    stepNumber:0,
    xIsNext:true,
    isWinning:false
  });
  return { steps, setSteps };
}

function useOrder() {
  const [order, setOrder] = useState(true)
  return { order, setOrder }
}


// EVENT HANDLERS

function handleSquareClick({ i, history, steps, setHistory, setSteps }) {
  const historyOfStep = history.slice(0, steps.stepNumber + 1);
  const current = historyOfStep[historyOfStep.length - 1];
  const squares = current.squares.slice();
  const locations = [
    "[0,0]",
    "[0,1]",
    "[0,2]",
    "[1,0]",
    "[1,1]",
    "[1,2]",
    "[2,0]",
    "[2,1]",
    "[2,2]",
  ];
  
  if (calculateWinner(squares) || squares[i]) {
    return null;
  }
  
  squares[i] = steps.xIsNext ? "X" : "O";
  
  setHistory([
    ...historyOfStep,
    {
      squares: squares,
      loc: locations[i],
    },
  ]);
  
  setSteps({
    ...steps,
    stepNumber: historyOfStep.length,
    xIsNext: !steps.xIsNext
  });
}

// ROOT COMPONENT

function Game() {
  const {history, setHistory} = useHistory();
  const {steps, setSteps} = useSteps();
  const {order, setOrder} = useOrder();
  const current = history[steps.stepNumber];
  const winner = calculateWinner(current.squares);

  function jumpTo(step) {
    setSteps({
      ...steps,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  const moves = history.map((step, move) => {
    const desc = move
      ? "Go to move #" + move + " at " + history[move].loc
      : "Go to game start";

    return (
      <Moves move={move} steps={steps} desc={desc} jumpTo={jumpTo}/>
    );
  });

  let status;
  if (winner) {
      status = "Winner: " + winner.player;
  } else if (!current.squares.includes(null)) {
      status = "Cat's Game!";
  } else {
      status = "Next player: " + (steps.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleSquareClick({ i, steps, history, setSteps, setHistory })}
          winningSquares={winner ? winner.line : []}
        />
      </div>
      
      <div className="game-info">
          <div>{status}</div>
          <ol>{order.isDescending ? moves : moves.reverse()}</ol>
      </div>
      
      <div>
        <button onClick={() => setOrder({ isDescending: !order.isDescending })}>
          Sort by: {order.isDescending ? "Descending" : "Ascending"}
        </button>
      </div>
    </div>
  );
}


// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
