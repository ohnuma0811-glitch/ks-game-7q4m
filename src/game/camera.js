// プレイヤーが画面の左から40%の位置に来るように横スクロールする
export function cameraX(targetX, viewW, levelW) {
  const max = Math.max(0, levelW - viewW);
  // キャラの位置を先に丸め、ずらす量も整数にする。カメラとキャラの丸め方がそろうので、
  // 走っている間にキャラが画面上で1ドットずつ前後にぶれない
  const left = Math.round(targetX) - Math.round(viewW * 0.4);
  return Math.min(max, Math.max(0, left));
}

// 縦はスクロールせず、ステージの一番下に合わせる
export function cameraY(levelH, viewH) {
  return Math.max(0, levelH - viewH);
}
