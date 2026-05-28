const size = 4; // 4x4のマス目
const tileSize = 80; // 1マスのサイズ(px)
const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');

let tiles = []; // 画面上のブロック(DOM)を保存する配列
let state = []; // 内部的な盤面の状態 [y][x] (0は空きマス)
let isPlaying = true;

// -------------------------------
// 初期化
// -------------------------------
function init() {
  let count = 1;
  // 1. 完成した状態の2次元配列を作る
  for (let y = 0; y < size; y++) {
    state[y] = [];
    for (let x = 0; x < size; x++) {
      // 最後のマス(右下)は 0 (空きマス) にする
      state[y][x] = count < 16 ? count : 0;
      count++;
    }
  }

  // 2. ブロック(DOM要素)を生成する
  createTiles();

  // 3. 盤面をシャッフルする
  shuffle();

  // 4. 画面に配置を反映する
  render();
}

// -------------------------------
// ブロック要素の生成
// -------------------------------
function createTiles() {
  for (let i = 1; i <= 15; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = i;
    
    // タップ（クリック）された時の処理
    tile.addEventListener('click', () => {
      if (!isPlaying) return;
      moveTile(i);
    });

    boardEl.appendChild(tile);
    tiles[i] = tile; // 数字をキーにして要素を保存
  }
}

// -------------------------------
// 特定の数字の座標(x, y)を探す
// -------------------------------
function findPos(num) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (state[y][x] === num) return { x, y };
    }
  }
}

// -------------------------------
// ブロックを動かす
// -------------------------------
function moveTile(num) {
  const pos = findPos(num);    // タップされた数字の位置
  const empty = findPos(0);    // 空きマス(0)の位置

  // タップしたマスと空きマスが隣り合っているか判定
  // xの差とyの差の合計が1なら隣り合っている（斜めは2になる）
  const isAdjacent = Math.abs(pos.x - empty.x) + Math.abs(pos.y - empty.y) === 1;

  if (isAdjacent) {
    // 内部配列の数字を入れ替える
    state[empty.y][empty.x] = num;
    state[pos.y][pos.x] = 0;
    
    // 画面の見た目を更新
    render();
    
    // クリアしたかチェック
    checkWin();
  }
}

// -------------------------------
// 画面に状態を描画（CSSのtransformで移動させる）
// -------------------------------
function render() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const num = state[y][x];
      if (num !== 0) {
        const tile = tiles[num];
        // CSSのtranslateを使って、(x * 80px, y * 80px) の位置へ移動
        tile.style.transform = `translate(${x * tileSize}px, ${y * tileSize}px)`;
      }
    }
  }
}

// -------------------------------
// シャッフル機能（ランダムに動かすシミュレーション）
// -------------------------------
function shuffle() {
  // 300回ランダムにスライドさせてシャッフルする
  for (let i = 0; i < 300; i++) {
    const empty = findPos(0);
    const neighbors = [];
    
    // 空きマスの上下左右にある数字をリストアップ
    if (empty.x > 0) neighbors.push(state[empty.y][empty.x - 1]); // 左
    if (empty.x < size - 1) neighbors.push(state[empty.y][empty.x + 1]); // 右
    if (empty.y > 0) neighbors.push(state[empty.y - 1][empty.x]); // 上
    if (empty.y < size - 1) neighbors.push(state[empty.y + 1][empty.x]); // 下

    // ランダムに選んで入れ替える
    const randomNum = neighbors[Math.floor(Math.random() * neighbors.length)];
    const numPos = findPos(randomNum);
    
    state[empty.y][empty.x] = randomNum;
    state[numPos.y][numPos.x] = 0;
  }
}

// -------------------------------
// クリア判定
// -------------------------------
function checkWin() {
  let count = 1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 最後の右下マスに来たらループを抜ける
      if (y === size - 1 && x === size - 1) break;
      // 1つでも順番が違ったらまだクリアではない
      if (state[y][x] !== count) return;
      count++;
    }
  }
  
  // 全て合っていたらクリア処理
  isPlaying = false;
  messageEl.textContent = "クリア!";
}

// ゲームスタート
init();