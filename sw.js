// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = '63dc67f';
const FILES = ['./', 'style.css?v=63dc67f', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=63dc67f', 'src/config.js?v=63dc67f', 'src/data/backdrop.js?v=63dc67f', 'src/data/objects.js?v=63dc67f', 'src/data/sprites.js?v=63dc67f', 'src/data/stages.js?v=63dc67f', 'src/data/themes.js?v=63dc67f', 'src/flow.js?v=63dc67f', 'src/game/boss.js?v=63dc67f', 'src/game/camera.js?v=63dc67f', 'src/game/difficulty.js?v=63dc67f', 'src/game/enemies.js?v=63dc67f', 'src/game/game.js?v=63dc67f', 'src/game/items.js?v=63dc67f', 'src/game/level.js?v=63dc67f', 'src/game/physics.js?v=63dc67f', 'src/game/platforms.js?v=63dc67f', 'src/game/player.js?v=63dc67f', 'src/gfx.js?v=63dc67f', 'src/input.js?v=63dc67f', 'src/loop.js?v=63dc67f', 'src/main.js?v=63dc67f', 'src/music.js?v=63dc67f', 'src/musicstate.js?v=63dc67f', 'src/names.js?v=63dc67f', 'src/ranking.js?v=63dc67f', 'src/render.js?v=63dc67f', 'src/screen.js?v=63dc67f', 'src/screens.js?v=63dc67f', 'src/shared.js?v=63dc67f', 'src/ui.js?v=63dc67f'];
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
