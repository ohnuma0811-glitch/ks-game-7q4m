// プレイヤーが画面の左から40%の位置に来るように横スクロールする
export function cameraX(targetX, viewW, levelW) {
  const max = Math.max(0, levelW - viewW);
  return Math.round(Math.min(max, Math.max(0, targetX - viewW * 0.4)));
}
