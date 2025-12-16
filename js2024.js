const boxes = document.querySelectorAll(".box");
const resetButton = document.getElementById("reset-btn");
const modeMultiplayerBtn = document.getElementById("mode-multiplayer");
const modeComputerBtn = document.getElementById("mode-computer");

let currentPlayer = "X";
let gameBoard = Array(9).fill("");
let gameActive = true;
let gameMode = "multiplayer";

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      gameActive = false;
      boxes[a].classList.add("winner");
      boxes[b].classList.add("winner");
      boxes[c].classList.add("winner");
      setTimeout(() => {
        alert(`🎉 Player ${gameBoard[a]} Wins!`);
        resetGame();
      }, 500);
      return;
    }
  }
  if (!gameBoard.includes("")) {
    setTimeout(() => {
      alert("😐 It's a Draw!");
      resetGame();
    }, 500);
  }
}

function resetGame() {
  gameBoard.fill("");
  boxes.forEach((box) => {
    box.textContent = "";
    box.classList.remove("x-mark", "o-mark", "winner");
  });
  currentPlayer = "X";
  gameActive = true;
}

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (
      !gameBoard[index] &&
      gameActive &&
      (gameMode === "multiplayer" || currentPlayer === "X")
    ) {
      gameBoard[index] = currentPlayer;
      box.textContent = currentPlayer;
      box.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark");
      checkWinner();
      currentPlayer = currentPlayer === "X" ? "O" : "X";

      if (gameMode === "computer" && gameActive && currentPlayer === "O") {
        setTimeout(() => {
          computerMove();
        }, 250);
      }
    }
  });
});

resetButton.addEventListener("click", resetGame);

if (modeMultiplayerBtn && modeComputerBtn) {
  function setMode(mode) {
    gameMode = mode;
    if (mode === "computer") {
      modeComputerBtn.classList.add("active");
      modeMultiplayerBtn.classList.remove("active");
    } else {
      modeMultiplayerBtn.classList.add("active");
      modeComputerBtn.classList.remove("active");
    }
    resetGame();
  }

  modeMultiplayerBtn.addEventListener("click", () => setMode("multiplayer"));
  modeComputerBtn.addEventListener("click", () => setMode("computer"));
}

function getWinnerState(board) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let p of winPatterns) {
    const [a, b, c] = p;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  if (!board.includes("")) return "draw";
  return null;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  const winner = getWinnerState(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "draw") return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let evalScore = minimax(board, depth + 1, false, alpha, beta);
        board[i] = "";
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let evalScore = minimax(board, depth + 1, true, alpha, beta);
        board[i] = "";
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

function computerMove() {
  if (!gameActive) return;
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === "") {
      gameBoard[i] = "O";
      let score = minimax(gameBoard, 0, false, -Infinity, Infinity);
      gameBoard[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  if (bestMove >= 0) {
    gameBoard[bestMove] = "O";
    const box = boxes[bestMove];
    if (box) {
      box.textContent = "O";
      box.classList.add("o-mark");
    }
    checkWinner();
    currentPlayer = "X";
  }
}
