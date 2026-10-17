import { TILE, isSolid } from './level.js?v=d8ce42e';

// 端のぴったり上は隣のタイルに入らないよう、少しだけ内側で判定する
const EPS = 0.001;

export function moveAndCollide(body, level) {
  const r = { onGround: false, hitCeiling: false, hitWall: false, ceil: null, platform: null };

  // 横に動かして押し戻す
  body.x += body.vx;
  if (body.vx !== 0) {
    const top = Math.floor(body.y / TILE);
    const bottom = Math.floor((body.y + body.h - EPS) / TILE);
    const tx = body.vx > 0
      ? Math.floor((body.x + body.w - EPS) / TILE)
      : Math.floor(body.x / TILE);
    for (let ty = top; ty <= bottom; ty++) {
      if (isSolid(level, tx, ty)) {
        body.x = body.vx > 0 ? tx * TILE - body.w : (tx + 1) * TILE;
        body.vx = 0;
        r.hitWall = true;
        break;
      }
    }
  }

  // 縦に動かして押し戻す
  const vy = body.vy;
  const prevBottom = body.y + body.h;
  body.y += body.vy;
  if (body.vy !== 0) {
    const left = Math.floor(body.x / TILE);
    const right = Math.floor((body.x + body.w - EPS) / TILE);
    const ty = body.vy > 0
      ? Math.floor((body.y + body.h - EPS) / TILE)
      : Math.floor(body.y / TILE);
    let hitTx = -1;
    for (let tx = left; tx <= right; tx++) {
      if (isSolid(level, tx, ty)) {
        hitTx = tx;
        break;
      }
    }
    if (hitTx >= 0) {
      if (body.vy > 0) {
        body.y = ty * TILE - body.h;
        r.onGround = true;
      } else {
        // 2つにまたがるときは体の中心の上のブロックを叩く
        const cx = Math.floor((body.x + body.w / 2) / TILE);
        if (isSolid(level, cx, ty)) hitTx = cx;
        body.y = (ty + 1) * TILE;
        r.hitCeiling = true;
        r.ceil = { tx: hitTx, ty };
      }
      body.vy = 0;
    }
  }
  // 動く足場: 落ちてきて上面をまたいだら乗る（下からはすり抜ける）
  if (vy > 0 && !r.onGround && level.platforms) {
    for (const p of level.platforms) {
      const top = p.y;
      const prevTop = p.prevY ?? p.y;
      if (body.x + body.w <= p.x || body.x >= p.x + p.w) continue;
      if (prevBottom <= Math.max(prevTop, top) + 0.5 && body.y + body.h >= top) {
        body.y = top - body.h;
        body.vy = 0;
        r.onGround = true;
        r.platform = p;
        break;
      }
    }
  }
  return r;
}
