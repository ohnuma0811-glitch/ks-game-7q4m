import { parseLevel, TILE } from './level.js';
import { Player, spawnPoint } from './player.js';
import { cameraX } from './camera.js';

// ステージとプレイヤーをまとめる（M3 で敵・アイテム、M4 でライフを足す）
export class Game {
  constructor(levelLines, avatar = 'kyugo') {
    this.level = parseLevel(levelLines);
    this.avatar = avatar;
    this.camX = 0;
    this.respawn();
  }

  respawn() {
    const p = spawnPoint(this.level);
    this.player = new Player(p.x, p.y);
  }

  update(input, viewW) {
    this.player.update(input, this.level);
    if (this.player.fell) this.respawn();
    this.camX = cameraX(this.player.x + this.player.w / 2, viewW, this.level.width * TILE);
  }
}
