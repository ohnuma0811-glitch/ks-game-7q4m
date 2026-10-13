// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'e8546c2';
const FILES = ['./', 'style.css?v=e8546c2', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=e8546c2', 'src/config.js?v=e8546c2', 'src/data/backdrop.js?v=e8546c2', 'src/data/objects.js?v=e8546c2', 'src/data/sprites.js?v=e8546c2', 'src/data/stages.js?v=e8546c2', 'src/data/themes.js?v=e8546c2', 'src/flow.js?v=e8546c2', 'src/game/boss.js?v=e8546c2', 'src/game/camera.js?v=e8546c2', 'src/game/difficulty.js?v=e8546c2', 'src/game/enemies.js?v=e8546c2', 'src/game/game.js?v=e8546c2', 'src/game/items.js?v=e8546c2', 'src/game/level.js?v=e8546c2', 'src/game/physics.js?v=e8546c2', 'src/game/platforms.js?v=e8546c2', 'src/game/player.js?v=e8546c2', 'src/gfx.js?v=e8546c2', 'src/input.js?v=e8546c2', 'src/loop.js?v=e8546c2', 'src/main.js?v=e8546c2', 'src/music.js?v=e8546c2', 'src/musicstate.js?v=e8546c2', 'src/names.js?v=e8546c2', 'src/ranking.js?v=e8546c2', 'src/render.js?v=e8546c2', 'src/screen.js?v=e8546c2', 'src/screens.js?v=e8546c2', 'src/shared.js?v=e8546c2', 'src/ui.js?v=e8546c2'];
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
