// ステージの地図（12行、1文字＝16ドット四方）
// G=地面 B=レンガ ?=？ブロック(コイン) d=？ブロック(ドリンク) s=？ブロック(スター) c=コイン P=スタート
// w=歩く敵 j=ジャンプする敵 S=トゲ（全難易度） W J=ふつう以上 x y=むずかしいだけ
// H=チェックポイント(かんたん・ふつう) F=ゴールの旗 |=旗竿
// 穴の幅は最大3ブロック、スタートは tx=7 以降
export const STAGE_1 = [
  '                                                                                                                                                                                                        ',
  '                                                                                                                                                                                                F       ',
  '                    ?                                                                                                                                                                           |       ',
  '                                                                                                                                                                                                |       ',
  '                                                                                                                                                                                                |       ',
  '                                                               c cc                                                                                                                             |       ',
  '              ?   B?B?B                                       BBdBBB                                      BBsB                                          B?BB                   GGGGG  G         |       ',
  '                                                    GG                      cccc                                                      GG                                      GGGGGG  GG        |       ',
  '                                          GG        GG                                        GG                          GG          GG                                     GGGGGGG  GGG       |       ',
  '       P                 w    cccW      x GG   w    GG   W  y                x  W J  j    j   GG y  H      J  w x       W GG    S     GG     j ccc y    W  x       w    y J GGGGGGGG  GGGG      |       ',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGG   GGGGGGGGGGGGGGGGGGGGG  GGGGGGGGG  GGGGGGG  GGGGG  GGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGG   GGGGGGGGGGGGGGGGGGGGG  GGGGGGGGG  GGGGGGG  GGGGG  GGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGG',
];

// 遊ぶ順番（M7 でステージ2〜4を足す）
export const STAGES = [STAGE_1];
