// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'c90d32a';
const FILES = ['./', 'style.css?v=c90d32a', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=c90d32a', 'src/data/backdrop.js?v=c90d32a', 'src/data/objects.js?v=c90d32a', 'src/data/sprites.js?v=c90d32a', 'src/data/stages.js?v=c90d32a', 'src/data/themes.js?v=c90d32a', 'src/flow.js?v=c90d32a', 'src/game/boss.js?v=c90d32a', 'src/game/camera.js?v=c90d32a', 'src/game/difficulty.js?v=c90d32a', 'src/game/enemies.js?v=c90d32a', 'src/game/game.js?v=c90d32a', 'src/game/items.js?v=c90d32a', 'src/game/level.js?v=c90d32a', 'src/game/physics.js?v=c90d32a', 'src/game/platforms.js?v=c90d32a', 'src/game/player.js?v=c90d32a', 'src/gfx.js?v=c90d32a', 'src/input.js?v=c90d32a', 'src/loop.js?v=c90d32a', 'src/main.js?v=c90d32a', 'src/music.js?v=c90d32a', 'src/musicstate.js?v=c90d32a', 'src/names.js?v=c90d32a', 'src/ranking.js?v=c90d32a', 'src/render.js?v=c90d32a', 'src/screen.js?v=c90d32a', 'src/screens.js?v=c90d32a', 'src/ui.js?v=c90d32a'];
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
