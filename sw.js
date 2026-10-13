// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'ee2aba8';
const FILES = ['./', 'style.css?v=ee2aba8', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=ee2aba8', 'src/config.js?v=ee2aba8', 'src/data/backdrop.js?v=ee2aba8', 'src/data/objects.js?v=ee2aba8', 'src/data/sprites.js?v=ee2aba8', 'src/data/stages.js?v=ee2aba8', 'src/data/themes.js?v=ee2aba8', 'src/flow.js?v=ee2aba8', 'src/game/boss.js?v=ee2aba8', 'src/game/camera.js?v=ee2aba8', 'src/game/difficulty.js?v=ee2aba8', 'src/game/enemies.js?v=ee2aba8', 'src/game/game.js?v=ee2aba8', 'src/game/items.js?v=ee2aba8', 'src/game/level.js?v=ee2aba8', 'src/game/physics.js?v=ee2aba8', 'src/game/platforms.js?v=ee2aba8', 'src/game/player.js?v=ee2aba8', 'src/gfx.js?v=ee2aba8', 'src/input.js?v=ee2aba8', 'src/loop.js?v=ee2aba8', 'src/main.js?v=ee2aba8', 'src/music.js?v=ee2aba8', 'src/musicstate.js?v=ee2aba8', 'src/names.js?v=ee2aba8', 'src/ranking.js?v=ee2aba8', 'src/render.js?v=ee2aba8', 'src/screen.js?v=ee2aba8', 'src/screens.js?v=ee2aba8', 'src/shared.js?v=ee2aba8', 'src/ui.js?v=ee2aba8'];
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
