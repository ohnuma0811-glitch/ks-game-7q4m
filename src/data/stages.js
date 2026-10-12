// ステージの地図（12行、1文字＝16ドット四方）
// G=地面 B=レンガ ?=？ブロック(コイン) d=？ブロック(ドリンク) s=？ブロック(スター) c=コイン P=スタート
// w=歩く敵 j=ジャンプする敵 S=トゲ（全難易度） W J=ふつう以上 x y=むずかしいだけ
// h=チェックポイント(かんたん) H=チェックポイント(かんたん・ふつう) F=ゴールの旗 |=旗竿
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
  '       P                 w    ccc         GG   W    GG      x                        j    J   GG y  H         W           GG    S     GG    J  ccch   y            w    x   GGGGGGGG  GGGG      |       ',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGG',
];
