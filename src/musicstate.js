// 今の状態に合う BGM を決める（Web Audio に依存しない）
// 戻り値: 曲の名前 / null（止める） / undefined（今の音のまま）
const JINGLES = ['clear', 'gameover'];

export function musicFor({ screen, gameState, star, stageIndex, stageMusic, current, boss = false }) {
  // エンディングの曲は、クリアのジングルが鳴り終わってから
  if (screen === 'ending') return current === 'clear' ? undefined : 'ending';
  if (screen === 'play' && gameState === 'playing') {
    if (star > 0) return 'star';
    // ボスが出てから倒すまではボスの曲
    if (boss) return 'boss';
    return stageMusic[stageIndex] || 'grass';
  }
  // ミス・クリアの演出中は、鳴っているジングルやミスの音のまま
  if (screen === 'play') return undefined;
  // クリア・ゲームオーバーのジングルは、結果画面や次の「STAGE N」の間も最後まで鳴らす
  if ((screen === 'result' || screen === 'intro') && JINGLES.includes(current)) return undefined;
  return null;
}
