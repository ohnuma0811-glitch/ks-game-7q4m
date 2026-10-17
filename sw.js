// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'd8ce42e';
const FILES = ['./', 'style.css?v=d8ce42e', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=d8ce42e', 'src/config.js?v=d8ce42e', 'src/data/backdrop.js?v=d8ce42e', 'src/data/objects.js?v=d8ce42e', 'src/data/sprites.js?v=d8ce42e', 'src/data/stages.js?v=d8ce42e', 'src/data/themes.js?v=d8ce42e', 'src/flow.js?v=d8ce42e', 'src/game/boss.js?v=d8ce42e', 'src/game/camera.js?v=d8ce42e', 'src/game/difficulty.js?v=d8ce42e', 'src/game/enemies.js?v=d8ce42e', 'src/game/game.js?v=d8ce42e', 'src/game/items.js?v=d8ce42e', 'src/game/level.js?v=d8ce42e', 'src/game/physics.js?v=d8ce42e', 'src/game/platforms.js?v=d8ce42e', 'src/game/player.js?v=d8ce42e', 'src/gfx.js?v=d8ce42e', 'src/input.js?v=d8ce42e', 'src/loop.js?v=d8ce42e', 'src/main.js?v=d8ce42e', 'src/music.js?v=d8ce42e', 'src/musicstate.js?v=d8ce42e', 'src/names.js?v=d8ce42e', 'src/playtime.js?v=d8ce42e', 'src/ranking.js?v=d8ce42e', 'src/render.js?v=d8ce42e', 'src/screen.js?v=d8ce42e', 'src/screens.js?v=d8ce42e', 'src/shared.js?v=d8ce42e', 'src/ui.js?v=d8ce42e'];
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
