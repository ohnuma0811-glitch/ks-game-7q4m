// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'f6806db';
const FILES = ['./', 'style.css?v=f6806db', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=f6806db', 'src/config.js?v=f6806db', 'src/data/backdrop.js?v=f6806db', 'src/data/objects.js?v=f6806db', 'src/data/sprites.js?v=f6806db', 'src/data/stages.js?v=f6806db', 'src/data/themes.js?v=f6806db', 'src/flow.js?v=f6806db', 'src/game/boss.js?v=f6806db', 'src/game/camera.js?v=f6806db', 'src/game/difficulty.js?v=f6806db', 'src/game/enemies.js?v=f6806db', 'src/game/game.js?v=f6806db', 'src/game/items.js?v=f6806db', 'src/game/level.js?v=f6806db', 'src/game/physics.js?v=f6806db', 'src/game/platforms.js?v=f6806db', 'src/game/player.js?v=f6806db', 'src/gfx.js?v=f6806db', 'src/input.js?v=f6806db', 'src/loop.js?v=f6806db', 'src/main.js?v=f6806db', 'src/music.js?v=f6806db', 'src/musicstate.js?v=f6806db', 'src/names.js?v=f6806db', 'src/ranking.js?v=f6806db', 'src/render.js?v=f6806db', 'src/screen.js?v=f6806db', 'src/screens.js?v=f6806db', 'src/shared.js?v=f6806db', 'src/ui.js?v=f6806db'];
const CACHE = `ks-${VERSION}`;

self.addEventListener('install', (e) => {
  // 古いファイルをつかまないよう、ブラウザの一時保存は使わずに取りに行く
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

// 前の版で保存したファイルは消す
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ks-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // ページは、つながれば新しい版（ゲームの更新が届くように）。つながらなければ保存した物
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./', copy));
          }
          return res;
        })
        .catch(() => caches.match('./', { ignoreSearch: true })),
    );
    return;
  }
  // ゲームのファイルは版番号付きなので、保存した物があればそれを使う
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
