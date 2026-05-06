// ---- State ----
let peer = null;
let conn = null;
let mySymbol = null;
let board = Array(9).fill(null);
let currentTurn = 'X';
let gameOver = false;
let scores = { X: 0, O: 0 };
let rematchVotes = 0;
let iAskedRematch = false;

const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

// ---- Utilities ----
function genCode() {
  // Excluded: 0, O, o, I, i, L, l (and 1 for clarity)
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  
  // Trigger specific logic per screen
  if (id === 'screen-host') initHost();
  if (id === 'screen-menu') resetPeer();
}

function resetPeer() {
  if (conn) {
    conn.close();
    conn = null;
  }
  if (peer) {
    peer.destroy();
    peer = null;
  }
}

// ---- HOST ----
function initHost() {
  resetPeer();
  const code = genCode();
  const statusEl = document.getElementById('host-status');
  const codeEl = document.getElementById('host-code');
  
  codeEl.textContent = code;
  statusEl.textContent = 'Connecting to signaling server...';

  peer = new Peer(code, { debug: 1 });

  peer.on('open', (id) => {
    statusEl.textContent = 'Room Ready. Waiting for opponent...';
    console.log('Peer ID:', id);
  });

  peer.on('connection', (incomingConn) => {
    if (conn) conn.close();
    conn = incomingConn;
    mySymbol = 'X';
    setupConnection();
  });

  peer.on('error', (err) => {
    if (err.type === 'unavailable-id') {
      statusEl.textContent = 'ID Taken. Retrying...';
      setTimeout(initHost, 1000);
    } else {
      statusEl.textContent = 'Error: ' + err.type;
      console.error('Peer error:', err);
    }
  });
}

function copyCode() {
  const code = document.getElementById('host-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-btn');
    const oldText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = oldText, 1500);
  });
}

// ---- JOIN ----
function joinRoom() {
  const input = document.getElementById('join-input');
  const code = input.value.trim().toUpperCase();
  if (code.length < 4) return;

  const statusEl = document.getElementById('join-status');
  statusEl.style.display = 'block';
  statusEl.textContent = 'Connecting...';

  resetPeer();
  peer = new Peer({ debug: 1 });

  peer.on('open', () => {
    conn = peer.connect(code, { reliable: true });
    mySymbol = 'O';
    setupConnection();
  });

  peer.on('error', (err) => {
    statusEl.textContent = 'Error: ' + err.type;
    console.error('Join error:', err);
  });
}

// ---- CONNECTION HANDLING ----
function setupConnection() {
  if (!conn) return;

  conn.on('open', () => {
    console.log('Data channel open');
    startGame();
  });

  conn.on('data', (data) => {
    console.log('Received:', data);
    if (data.type === 'move') {
      applyMove(data.index, data.symbol);
    } else if (data.type === 'rematch') {
      rematchVotes++;
      checkRematch();
    } else if (data.type === 'chat') {
      // Future feature
    }
  });

  conn.on('close', () => {
    const gs = document.getElementById('game-status');
    if (gs) gs.textContent = 'Opponent disconnected.';
    gameOver = true;
  });
  
  conn.on('error', (err) => {
    console.error('Connection error:', err);
  });
}

// ---- GAME LOGIC ----
function startGame() {
  board = Array(9).fill(null);
  currentTurn = 'X';
  gameOver = false;
  rematchVotes = 0;
  iAskedRematch = false;

  // Labels
  document.getElementById('x-label').textContent = mySymbol === 'X' ? 'X (You)' : 'X (Opponent)';
  document.getElementById('o-label').textContent = mySymbol === 'O' ? 'O (You)' : 'O (Opponent)';
  
  // UI Reset
  document.getElementById('score-x').textContent = scores.X;
  document.getElementById('score-o').textContent = scores.O;
  document.getElementById('game-status').textContent = '';
  
  const rematchBtn = document.getElementById('rematch-btn');
  if (rematchBtn) {
    rematchBtn.style.display = 'none';
    rematchBtn.textContent = 'Rematch';
    rematchBtn.disabled = false;
  }

  renderBoard();
  showScreen('screen-game');
  updateTurnUI();
}

function cellClick(i) {
  if (gameOver || board[i] || currentTurn !== mySymbol) return;
  
  applyMove(i, mySymbol);
  
  if (conn && conn.open) {
    conn.send({ type: 'move', index: i, symbol: mySymbol });
  }
}

function applyMove(i, symbol) {
  if (board[i]) return;
  board[i] = symbol;
  currentTurn = (symbol === 'X') ? 'O' : 'X';
  renderBoard();
  checkWin();
  if (!gameOver) updateTurnUI();
}

function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((c, i) => {
    c.textContent = board[i] || '';
    // Use clear class naming
    c.className = 'cell';
    if (board[i]) {
      c.classList.add('taken', board[i].toLowerCase());
    }
  });
}

function checkWin() {
  let winner = null;
  for (const [a,b,c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      [a,b,c].forEach(idx => document.querySelectorAll('.cell')[idx].classList.add('winner'));
      break;
    }
  }

  if (winner) {
    scores[winner]++;
    gameOver = true;
    const youWon = (winner === mySymbol);
    document.getElementById('turn-indicator').textContent = youWon ? 'Victory!' : 'Defeat.';
    document.getElementById('game-status').textContent = youWon ? 'You won!' : 'Opponent won.';
    document.getElementById('rematch-btn').style.display = 'block';
  } else if (board.every(cell => cell !== null)) {
    gameOver = true;
    document.getElementById('turn-indicator').textContent = "Draw.";
    document.getElementById('game-status').textContent = "No one wins.";
    document.getElementById('rematch-btn').style.display = 'block';
  }
}

function updateTurnUI() {
  const el = document.getElementById('turn-indicator');
  if (currentTurn === mySymbol) {
    el.textContent = 'Your Turn';
    el.className = 'turn-indicator your-turn';
  } else {
    el.textContent = "Opponent's Turn";
    el.className = 'turn-indicator their-turn';
  }
}

function requestRematch() {
  if (iAskedRematch) return;
  iAskedRematch = true;
  rematchVotes++;
  
  if (conn && conn.open) {
    conn.send({ type: 'rematch' });
  }
  
  const btn = document.getElementById('rematch-btn');
  btn.textContent = 'Waiting for opponent...';
  btn.disabled = true;
  
  checkRematch();
}

function checkRematch() {
  if (rematchVotes >= 2) {
    startGame();
  }
}

function leaveGame() {
  resetPeer();
  showScreen('screen-menu');
}

// ---- START ----
// Ensure the UI starts at the menu
window.onload = () => {
  showScreen('screen-menu');
};
