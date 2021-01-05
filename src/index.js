import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function SquaresList({count, squares, winningSquares, onClick}) {

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
                )})
            }
        
        </div>
    )
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

function useHistory() {
    const [history, setHistory] = useState([
        {
          squares: Array(9).fill(null),
        },
      ])
      return {history, setHistory}
}

function useSteps() {
    const [steps, setSteps] = useState({stepNumber:0, xIsNext:true, isWinning:false})
    return {steps, setSteps}
}

function useOrder() {
    const [order, setOrder] = useState(true)
    return {order, setOrder}
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

function Game() {
    const {history, setHistory} = useHistory()
    const {steps, setSteps} = useSteps()
    const {order, setOrder} = useOrder()

function handleClick(i) {
    const current = history[history.length - 1];
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
      return;
    }
    squares[i] = steps.xIsNext ? "X" : "O";
    setHistory(
      [...history,
        {
          squares: squares,
          loc: locations[i],
        },
      ]);
      setSteps(
      {
        ...steps,
        stepNumber: history.length,
        xIsNext: !steps.xIsNext
      },
    );
  }

  function jumpTo(step) {
    setSteps({
      ...steps,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  function sortHistory() {
    setOrder({
      isDescending: !order.isDescending,
    });
  }

  const current = history[steps.stepNumber];
  const winner = calculateWinner(current.squares);

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
            onClick={(i) => handleClick(i)}
            winningSquares={winner ? winner.line : []}
            />
        </div>
        <div className="game-info">
            <div>{status}</div>
            <ol>{order.isDescending ? moves : moves.reverse()}</ol>
        </div>
        <div>
            <button onClick={() => sortHistory()}>
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
