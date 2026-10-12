import { TILE } from './game/level.js?v=abf9352';
import { cameraY } from './game/camera.js?v=abf9352';
import { BACKDROPS, BACKDROP_SPRITES, layerPositions } from './data/backdrop.js?v=abf9352';
import { getTheme } from './data/themes.js?v=abf9352';
import { BOSS_HP } from './game/boss.js?v=abf9352';

const TILE_KEYS = [null, 'G', 'B', 'Q', 'U', 'C', 'L', 'X'];

export function renderGame(ctx, game, gfx, viewW, viewH, tick, { hud = true, player: showPlayer = true } = {}) {
  const { level, camX, player } = game;
  const camY = cameraY(level.height * TILE, viewH);
  const sx = (x) => Math.round(x - camX);
  const sy = (y) => Math.round(y - camY);
  const theme = getTheme(game.theme);
  const tiles = gfx.tiles[game.theme] || gfx.tiles.grass;
  ctx.fillStyle = theme.sky;
  ctx.fillRect(0, 0, viewW, viewH);

  // 背景の雲と山（地面より遅く動く）
  for (const layer of BACKDROPS[game.theme] || []) {
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
      const img = tiles[TILE_KEYS[level.tiles[ty * level.width + tx]]];
      if (img) ctx.drawImage(img, tx * TILE - camX, ty * TILE - camY);
    }
  }

  // ゴールとチェックポイント
  for (const e of level.entities) {
    if (e.ch === 'F' || e.ch === '|') {
      ctx.drawImage(gfx.sprites[e.ch === 'F' ? 'flag' : 'pole'], sx(e.tx * TILE), sy(e.ty * TILE));
      // 旗の布（ゴールすると下へ降りる）
      if (e.ch === 'F') ctx.drawImage(gfx.sprites.cloth, sx(e.tx * TILE), sy(e.ty * TILE + (game.flagDrop || 0)));
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

  // ボス（ひるんでいる間は点滅）
  const b = game.boss;
  if (b && !b.removed && !(b.state === 'hurt' && Math.floor(tick / 3) % 2)) {
    const key = b.state === 'shell' ? 'shell' : Math.floor(tick / 10) % 2 ? 'walkB' : 'walkA';
    const f = gfx.boss[key];
    // 甲羅に入る前はぶるぶるふるえる。甲羅の間は当たり判定が低いので、絵を上へずらす
    const shake = b.warning && Math.floor(tick / 2) % 2 ? 1 : 0;
    const oy = b.state === 'shell' ? 13 : 2;
    ctx.drawImage(b.dir < 0 ? f.right : f.left, sx(b.x - 2 + shake), sy(b.y - oy));
  }

  // プレイヤー（スター中は点滅。スターの残り3秒は速く点滅）
  // （ボスを踏んだあとの無敵は点滅させない）
  let blink = 0;
  if (player.star > 0) blink = player.star < 180 ? 2 : 4;
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
  // ボスの体力（ボスが出てから倒すまで）
  const b = game.boss;
  if (b && b.active && !b.defeated) {
    const x0 = Math.round(viewW / 2) - 34;
    text(ctx, 'BOSS', x0, 13);
    for (let i = 0; i < BOSS_HP; i++) {
      ctx.fillStyle = '#000';
      ctx.fillRect(x0 + 26 + i * 9, 14, 8, 6);
      ctx.fillStyle = i < b.hp ? '#e02020' : '#555555';
      ctx.fillRect(x0 + 27 + i * 9, 15, 6, 4);
    }
  }
}

function drawBanner(ctx, viewW, viewH, title) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, viewH / 2 - 22, viewW, 44);
  ctx.font = '16px monospace';
  ctx.textBaseline = 'middle';
  text(ctx, title, viewW / 2, viewH / 2, 'center');
}
