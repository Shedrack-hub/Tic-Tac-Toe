const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("modeSelect");
const turnIndicator = document.getElementById("turnIndicator");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let mode = modeSelect.value;

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  resetGame();
});

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if(gameState[index] !== "" || checkWinner()) return;

  makeMove(index, currentPlayer);

  if(checkWinner()) {
    highlightWinner();
    result.textContent = `Player ${currentPlayer} wins! 🎉`;
    turnIndicator.textContent = "";
    return;
  }

  if(gameState.every(cell => cell !== "")) {
    result.textContent = "It's a draw! 🤝";
    turnIndicator.textContent = "";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnIndicator.textContent = `Current Turn: ${currentPlayer}`;

  if(mode === "1p" && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player === "X" ? "text-red-500" : "text-green-500");
}

function aiMove() {
  // AI tries to win
  for (let combo of winningConditions) {
    const [a,b,c] = combo;
    const values = [gameState[a], gameState[b], gameState[c]];
    if(values.filter(v => v==="O").length===2 && values.includes("")) {
      const move = combo[values.indexOf("")];
      makeMove(move, "O");
      afterAIMove();
      return;
    }
  }

  // AI blocks player
  for (let combo of winningConditions) {
    const [a,b,c] = combo;
    const values = [gameState[a], gameState[b], gameState[c]];
    if(values.filter(v => v==="X").length===2 && values.includes("")) {
      const move = combo[values.indexOf("")];
      makeMove(move, "O");
      afterAIMove();
      return;
    }
  }

  // Random move
  let emptyIndices = gameState.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  const aiIndex = emptyIndices[Math.floor(Math.random()*emptyIndices.length)];
  makeMove(aiIndex, "O");
  afterAIMove();
}

function afterAIMove() {
  if(checkWinner()) {
    highlightWinner();
    result.textContent = "Player O (AI) wins! 🤖";
    turnIndicator.textContent = "";
    return;
  }
  if(gameState.every(cell => cell !== "")) {
    result.textContent = "It's a draw! 🤝";
    turnIndicator.textContent = "";
    return;
  }
  currentPlayer = "X";
  turnIndicator.textContent = `Current Turn: ${currentPlayer}`;
}

function checkWinner() {
  return winningConditions.some(c=>{
    const [a,b,c1]=c;
    return gameState[a] && gameState[a]===gameState[b] && gameState[a]===gameState[c1];
  });
}

function highlightWinner() {
  winningConditions.forEach(c=>{
    const [a,b,c1]=c;
    if(gameState[a] && gameState[a]===gameState[b] && gameState[a]===gameState[c1]){
      [a,b,c1].forEach(i=>cells[i].classList.add("bg-yellow-300","pulse"));
    }
  });
}

function resetGame() {
  gameState=["","","","","","","","",""];
  currentPlayer="X";
  result.textContent="";
  turnIndicator.textContent="Current Turn: X";
  cells.forEach(cell=>{
    cell.textContent="";
    cell.classList.remove("bg-yellow-300","text-red-500","text-green-500","pulse");
  });
}

cells.forEach(cell=>cell.addEventListener("click",handleCellClick));
resetBtn.addEventListener("click",resetGame);
