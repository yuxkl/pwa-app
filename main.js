const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
 
canvas.width = 360;
canvas.height = 360;
 
const size = 3;
const cell = canvas.width / size;

// -------------------------------
// 魔法陣の初期化（ランダム生成）
// -------------------------------
// 3x3の魔法陣の正解パターン（全8通り）
const validMagicSquares = [
  [[8, 1, 6], [3, 5, 7], [4, 9, 2]],
  [[6, 1, 8], [7, 5, 3], [2, 9, 4]],
  [[8, 3, 4], [1, 5, 9], [6, 7, 2]],
  [[4, 3, 8], [9, 5, 1], [2, 7, 6]],
  [[6, 7, 2], [1, 5, 9], [8, 3, 4]],
  [[2, 7, 6], [9, 5, 1], [4, 3, 8]],
  [[4, 9, 2], [3, 5, 7], [8, 1, 6]],
  [[2, 9, 4], [7, 5, 3], [6, 1, 8]]
];

// 1. ランダムに正解のパターンを1つ選ぶ
const solution = validMagicSquares[Math.floor(Math.random() * validMagicSquares.length)];

// 2. ヒントとして最初から表示するマスの数（今回は4〜5個のランダム）
const hintCount = Math.floor(Math.random() * 2) + 4; 

// 3. 0〜8の座標インデックスをシャッフルして、ヒントを出す場所を決める
const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).slice(0, hintCount);

// 4. 空のグリッドを用意し、選ばれた場所に正解の数字をセットする
let grid = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

positions.forEach(pos => {
  const y = Math.floor(pos / 3);
  const x = pos % 3;
  grid[y][x] = solution[y][x];
});
 
let isComplete = false;
let glow = 0;
 
// -------------------------------
// 描画
// -------------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 3;
 
  for (let i = 1; i < size; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, canvas.height);
    ctx.stroke();
 
    ctx.beginPath();
    ctx.moveTo(0, i * cell);
    ctx.lineTo(canvas.width, i * cell);
    ctx.stroke();
  }
 
  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
 
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = grid[y][x];
      if (val !== null) {
        ctx.fillStyle = "#fff";
        ctx.fillText(val, x * cell + cell / 2, y * cell + cell / 2);
      }
    }
  }
 
  if (isComplete) {
    glow += 0.3;
    const alpha = Math.sin(glow) * 0.5 + 0.5;
 
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,0,${alpha})`;
    ctx.shadowColor = "#ff0";
    ctx.shadowBlur = 25;
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
 
    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = `rgba(255,255,0,${alpha})`;
    ctx.fillText("🎉 おめでとう！ 🎉", canvas.width / 2, canvas.height / 2);
  }
}
 
// -------------------------------
// 魔法陣チェック
// -------------------------------
function isMagicSquare() {
  const target = 15;
 
  if (!grid.flat().every(n => n !== null)) return false;
 
  const sums = [];
 
  for (let y = 0; y < size; y++) {
    sums.push(grid[y][0] + grid[y][1] + grid[y][2]);
  }
 
  for (let x = 0; x < size; x++) {
    sums.push(grid[0][x] + grid[1][x] + grid[2][x]);
  }
 
  sums.push(grid[0][0] + grid[1][1] + grid[2][2]);
  sums.push(grid[0][2] + grid[1][1] + grid[2][0]);
 
  return sums.every(s => s === target);
}
 
// -------------------------------
// クリック入力
// -------------------------------
canvas.addEventListener("click", (e) => {
  if (isComplete) return;
 
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cell);
  const y = Math.floor((e.clientY - rect.top) / cell);
 
  const num = prompt("数字を入力 (1〜9)");
  
  // キャンセルされた場合や空文字の処理
  if (num === null || num.trim() === "") return;
  
  const n = Number(num);
 
  if (n >= 1 && n <= 9) {
    grid[y][x] = n;
 
    if (isMagicSquare()) {
      isComplete = true;
      animate();
    }
 
    draw();
  }
});
 
// -------------------------------
// アニメーションループ
// -------------------------------
function animate() {
  function loop() {
    if (!isComplete) return;
    draw();
    requestAnimationFrame(loop);
  }
  loop();
}
 
draw();