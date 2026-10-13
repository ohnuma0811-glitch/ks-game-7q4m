// ステージごとの見た目（空の色、地面とレンガの色）
export const THEMES = {
  grass: { sky: '#5c94fc', tiles: { o: '#fc9838', b: '#c84c0c', d: '#000000' } },
  // 地下: 濃いグレー（キャラの黒い髪と見分けがつくように）
  underground: { sky: '#4a4a4a', tiles: { o: '#9fd8ff', b: '#1f5fbf', d: '#000000' } },
  sky: { sky: '#9fdcff', tiles: { o: '#ffffff', b: '#7fb8e8', d: '#3a6ea5' } },
  // お城: 濃いグレー（キャラの黒い髪と見分けがつくように）
  castle: { sky: '#4a4a4a', tiles: { o: '#c8c8c8', b: '#707070', d: '#202020' } },
};

export function getTheme(name) {
  return THEMES[name] || THEMES.grass;
}
