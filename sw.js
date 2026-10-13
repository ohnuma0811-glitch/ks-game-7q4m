// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく。
// VERSION と FILES は、公開するときに scripts/deploy.sh が書き込む
const VERSION = 'f048943';
const FILES = ['./', 'style.css?v=f048943', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'src/audio.js?v=f048943', 'src/config.js?v=f048943', 'src/data/backdrop.js?v=f048943', 'src/data/objects.js?v=f048943', 'src/data/sprites.js?v=f048943', 'src/data/stages.js?v=f048943', 'src/data/themes.js?v=f048943', 'src/flow.js?v=f048943', 'src/game/boss.js?v=f048943', 'src/game/camera.js?v=f048943', 'src/game/difficulty.js?v=f048943', 'src/game/enemies.js?v=f048943', 'src/game/game.js?v=f048943', 'src/game/items.js?v=f048943', 'src/game/level.js?v=f048943', 'src/game/physics.js?v=f048943', 'src/game/platforms.js?v=f048943', 'src/game/player.js?v=f048943', 'src/gfx.js?v=f048943', 'src/input.js?v=f048943', 'src/loop.js?v=f048943', 'src/main.js?v=f048943', 'src/music.js?v=f048943', 'src/musicstate.js?v=f048943', 'src/names.js?v=f048943', 'src/ranking.js?v=f048943', 'src/render.js?v=f048943', 'src/screen.js?v=f048943', 'src/screens.js?v=f048943', 'src/shared.js?v=f048943', 'src/ui.js?v=f048943'];
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
