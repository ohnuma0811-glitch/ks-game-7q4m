import { TILE } from './game/level.js?v=bb6eec5';
import { cameraY } from './game/camera.js?v=bb6eec5';
import { LAYERS, BACKDROP_SPRITES, layerPositions } from './data/backdrop.js?v=bb6eec5';

const TILE_KEYS = [null, 'G', 'B', 'Q', 'U'];
const SKY = '#5c94fc';

export function renderGame(ctx, game, gfx, viewW, viewH, tick, { hud = true, player: showPlayer = true } = {}) {
  const { level, camX, player } = game;
  const camY = cameraY(level.height * TILE, viewH);
  const sx = (x) => Math.round(x - camX);
  const sy = (y) => Math.round(y - camY);
  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, viewW, viewH);

  // 背景の雲と山（地面より遅く動く）
  for (const layer of LAYERS) {
    const img = gfx.backdrop[layer.sprite];
    const pal = BACKDROP_SPRITES[layer.sprite].palette;
    for (const p of layerPositions(layer, camX, viewW, img.width)) {
      const y = p.y - camY;
      ctx.drawImage(img, p.x, y);
      if (layer.fillBelow) {
        // 絵の下を、ふち（両端1ドット）と中の色で画面の下まで続ける
        const top = y + img.height;
        ctx.fillStyle = pal.o;
        ctx.fillRect(p.x, top, img.width, viewH - top);
        ctx.fillStyle = pal.f;
        ctx.fillRect(p.x + 1, top, img.width - 2, viewH - top);
      }
    }
  }

  // 画面に入っている列だけ描く
  const tx0 = Math.max(0, Math.floor(camX / TILE));
  const tx1 = Math.min(level.width - 1, Math.floor((camX + viewW - 1) / TILE));
  for (let ty = 0; ty < level.height; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const img = gfx.tiles[TILE_KEYS[level.tiles[ty * level.width + tx]]];
      if (img) ctx.drawImage(img, tx * TILE - camX, ty * TILE - camY);
    }
  }

  // ゴールとチェックポイント
  for (const e of level.entities) {
    if (e.ch === 'F' || e.ch === '|') {
      ctx.drawImage(gfx.sprites[e.ch === 'F' ? 'flag' : 'pole'], sx(e.tx * TILE), sy(e.ty * TILE));
    }
  }
  for (const cp of game.checkpoints) {
    if (cp.enabled) ctx.drawImage(gfx.sprites[cp.passed ? 'checkOn' : 'check'], sx(cp.tx * TILE), sy(cp.ty * TILE));
  }

  // アイテム
  for (const it of game.items) {
    const img = gfx.sprites[it.kind === 'popcoin' ? 'coin' : it.kind];
    ctx.drawImage(img, sx(it.x), sy(it.y));
  }

  // 敵（歩く敵は足踏み、ほかは向いている方を見る）
  for (const e of game.enemies) {
    if (e.removed || !e.active) continue;
    const flat = e.squash > 0 && e.kind !== 'spike';
    const f = gfx.enemies[flat ? `${e.kind}Flat` : e.kind];
    const img = e.kind === 'walker' ? (Math.floor(tick / 12) % 2 ? f.left : f.right) : (e.dir > 0 ? f.right : f.left);
    ctx.drawImage(img, sx(e.x - 1), sy(e.y - 1));
  }

  // プレイヤー（スター中と無敵中は点滅。スターの残り3秒は速く点滅）
  let blink = 0;
  if (player.star > 0) blink = player.star < 180 ? 2 : 4;
  else if (player.invuln > 0) blink = 3;
  if (showPlayer && !(blink && Math.floor(tick / blink) % 2)) {
    const frame = gfx.avatars[game.avatar][player.spriteName()];
    ctx.drawImage(player.facing < 0 ? frame.left : frame.right, sx(player.x - 2), sy(player.y - 2));
  }

  // 取った点数（白い小さな数字）
  ctx.font = '8px monospace';
  ctx.textBaseline = 'bottom';
  for (const pop of game.popups) text(ctx, pop.text, sx(pop.x), sy(pop.y), 'center');

  if (hud) {
    drawHud(ctx, game, viewW);
    if (game.state === 'clear') drawBanner(ctx, viewW, viewH, 'STAGE CLEAR!');
    if (game.state === 'gameover') drawBanner(ctx, viewW, viewH, 'GAME OVER');
  }
}

function text(ctx, s, x, y, align = 'left') {
  ctx.textAlign = align;
  ctx.fillStyle = '#000';
  ctx.fillText(s, x + 1, y + 1);
  ctx.fillStyle = '#fff';
  ctx.fillText(s, x, y);
}

function drawHud(ctx, game, viewW) {
  ctx.font = '8px monospace';
  ctx.textBaseline = 'top';
  const cols = [
    `${(game.name || game.avatar).toUpperCase()} x${game.lives}`,
    `COIN ${String(game.coins).padStart(2, '0')}`,
    String(game.score).padStart(6, '0'),
    `TIME ${String(game.time).padStart(3, '0')}`,
  ];
  const step = (viewW - 8) / cols.length;
  cols.forEach((s, i) => text(ctx, s, 4 + i * step, 3));
  text(ctx, game.diff.label, 4, 13);
}

function drawBanner(ctx, viewW, viewH, title) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, viewH / 2 - 22, viewW, 44);
  ctx.font = '16px monospace';
  ctx.textBaseline = 'middle';
  text(ctx, title, viewW / 2, viewH / 2, 'center');
}
