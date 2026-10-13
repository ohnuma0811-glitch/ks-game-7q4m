// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'e150c2c';
const FILES = ['./', 'style.css?v=e150c2c', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=e150c2c', 'src/config.js?v=e150c2c', 'src/data/backdrop.js?v=e150c2c', 'src/data/objects.js?v=e150c2c', 'src/data/sprites.js?v=e150c2c', 'src/data/stages.js?v=e150c2c', 'src/data/themes.js?v=e150c2c', 'src/flow.js?v=e150c2c', 'src/game/boss.js?v=e150c2c', 'src/game/camera.js?v=e150c2c', 'src/game/difficulty.js?v=e150c2c', 'src/game/enemies.js?v=e150c2c', 'src/game/game.js?v=e150c2c', 'src/game/items.js?v=e150c2c', 'src/game/level.js?v=e150c2c', 'src/game/physics.js?v=e150c2c', 'src/game/platforms.js?v=e150c2c', 'src/game/player.js?v=e150c2c', 'src/gfx.js?v=e150c2c', 'src/input.js?v=e150c2c', 'src/loop.js?v=e150c2c', 'src/main.js?v=e150c2c', 'src/music.js?v=e150c2c', 'src/musicstate.js?v=e150c2c', 'src/names.js?v=e150c2c', 'src/ranking.js?v=e150c2c', 'src/render.js?v=e150c2c', 'src/screen.js?v=e150c2c', 'src/screens.js?v=e150c2c', 'src/shared.js?v=e150c2c', 'src/ui.js?v=e150c2c'];
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
