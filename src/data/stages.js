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
  '                                                               c cc                                                                                                            w                |       ',
  '              ?   B?B?B                                       BBdBBB                                      BBsB                                          B?BB                   GGGGG  G         |       ',
  '                                                    GG                      cccc                                                      GG                                      GGGGGG  GG        |       ',
  '                                          GG        GG                                        GG                          GG          GG                                     GGGGGGG  GGG       |       ',
  '       P                 w    cccW        GG x w   zGG   W                       xRW j   Jjz  GG    H           xw        GG W  S     GG       cccjzW        x              GGGGGGGG  GGGG  Jr  |       ',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGG   GGGGGGGGGGGGGGGGGGGGG  GGGGGGGGG  GGGGGGG  GGGGG  GGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGG   GGGGGGGGGGGGGGGGGGGGG  GGGGGGGGG  GGGGGGG  GGGGG  GGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGG',
];

// ステージ2 地下: 天井があり、低い通路（天井の下にはジャンプする敵を置かない）
// ステージ3 空: C=雲の足場。足場から落ちるとミス
// ステージ4 お城: L=溶岩（触れるとミス）。最後に K=ボス、X=ボスの扉（ボスを倒すと開く）
export const STAGE_2 = [
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  '                                                                                                                                                                                                F       ',
  '                                                                                                                                                                                                |       ',
  '                                                                                                                                                                                                |       ',
  '                                                                                                                                                                                                |       ',
  '                          c  c  c  c  c               c c c                c c c c                            c  c  c  c  c  c                                                                  |       ',
  '            ?BdB?       BBBBBBBBBBBBBBBBB                           G     BBBBsBBBB                         BBBBBBBBBBBBBBBBBBB           ?B?B?                              GGGGG              |       ',
  '                                                            G       G                                                                               G                       GGGGGG              |       ',
  '                                                    G       G       G                                                                               G       G              GGGGGGG              |       ',
  '       P            w     x   w    W                Gz  j   G   W  zG   x                     w R   H           x  w    W        r               j  G W  J  G x wJ        GGGGGGGG        WzS   |       ',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGG',
];

export const STAGE_3 = [
  '                                                                                                                                                                                                                         ',
  '                                                                                                                                                                                                                 F       ',
  '                                                                                                                                                                                                                 |       ',
  '                                                                                                                                                                                                                 |       ',
  '                                                                                                            c    c    c                                                                                          |       ',
  '                                    c c c                                                                                          c c                                 c c                                       |       ',
  '                          ?d?                                   c c c c                                                                                     ?s?                                                  |       ',
  '                                         xw                                CCCCCC                          M    N    M                              CCCCC                                                        |       ',
  '                                   CCCCCCCC            CCCCCC                                                                     CCCCCC                              VVVVVV              VVVVV                  |       ',
  '       P      w W              j                   Rz                 Wwx                wJzW       H                                           wx               Jjr                WS x                      J  |  z    ',
  'CCCCCCCCCCCCCCCCCCCCC   CCCCCCCCC            CCCCCCCC          CCCCCCCCCC          CCCCCCCCCC  CCCCCCCCCC                 CCCCCC          CCCCCCCC         CCCCCCCCC          CCCCCCCCCC         CCCCCCCCCCCCCCCCCCCCCCCC',
  'CCCCCCCCCCCCCCCCCCCCC   CCCCCCCCC            CCCCCCCC          CCCCCCCCCC          CCCCCCCCCC  CCCCCCCCCC                 CCCCCC          CCCCCCCC         CCCCCCCCC          CCCCCCCCCC         CCCCCCCCCCCCCCCCCCCCCCCC',
];

export const STAGE_4 = [
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  '                                                                                                                                                                                                           X     F       ',
  '                                                                                                                                                                                                           X     |       ',
  '                                                                                                                                                                                                           X     |       ',
  '                                                                                           c    c    c                                                                                                     X     |       ',
  '                                    ?B?B?                                                                                                                                                                  X     |       ',
  '                                 BdB      c c c c                              BsB    c                  c c c                                                                                             X     |       ',
  '                                                                                          M    N    M                G                                                                                     X     |       ',
  '                                                                                  G                                  G                      G                                  G                           X     |       ',
  '       P              x   S            Ww    R              SWz   x   j           G  J                         wz    G   Wx      S  z       G   Jx jJ   W  rw          H       G                 K         X     |       ',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGG                 GGGGGGGG  GGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGLLLGGGGGGGGGGGGGGGGGGGLLGGGGGGGGGGGGGGGGGGGGGLLLGGGGGGGGGGLLLLLLLLLLLLLLLLLGGGGGGGGLLGGGGGGGGGGGGGGGGGGGGLLLGGGGGGGGGGGGGGGGGGGLLGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
];

// 遊ぶ順番。theme は見た目（src/data/themes.js）、music は BGM（src/music.js）、time は制限時間（秒）
export const STAGES = [
  { map: STAGE_1, theme: 'grass', music: 'grass', time: 200 },
  { map: STAGE_2, theme: 'underground', music: 'underground', time: 250 },
  { map: STAGE_3, theme: 'sky', music: 'sky', time: 250 },
  { map: STAGE_4, theme: 'castle', music: 'castle', time: 300 },
];
