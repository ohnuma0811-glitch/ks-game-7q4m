import { TILE } from './game/level.js';

const TILE_KEYS = [null, 'G', 'B'];
const SKY = '#5c94fc';

export function renderGame(ctx, game, gfx, viewW, viewH) {
  const { level, camX, player } = game;
  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, viewW, viewH);

  // 画面に入っている列だけ描く
  const tx0 = Math.max(0, Math.floor(camX / TILE));
  const tx1 = Math.min(level.width - 1, Math.floor((camX + viewW - 1) / TILE));
  for (let ty = 0; ty < level.height; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const code = level.tiles[ty * level.width + tx];
      if (code) ctx.drawImage(gfx.tiles[TILE_KEYS[code]], tx * TILE - camX, ty * TILE);
    }
  }

  const frame = gfx.avatars[game.avatar][player.spriteName()];
  const img = player.facing < 0 ? frame.left : frame.right;
  ctx.drawImage(img, Math.round(player.x - 2 - camX), Math.round(player.y - 2));
}
