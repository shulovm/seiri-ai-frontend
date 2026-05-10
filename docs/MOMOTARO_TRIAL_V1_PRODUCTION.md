# 桃太郎 試作 v1｜制作パッケージ（軽量憲法 v1 準拠）

**基準**: `docs/JAPANESE_FOLKTALE_CONSTITUTION_V1_LIGHT.md` / `docs/MOMOTARO_PRODUCTION_PRINCIPLES.md`  
**体制**: AI制作班単独試作 → 創業者（さく）へ **完成物＋違和感候補＋自己監査** のみ提出。

---

## 制作ログ（憲法解釈・自己修正・違和感候補）

| 種別 | 内容 |
|------|------|
| **憲法解釈で迷った点** | 「芝刈り」を現代の庭芝と誤解されやすいため、**里山の草・柴刈り**の語をプロンプトに併記して統一。 |
| **AI自己修正箇所** | 鬼対峙は憲法・原則に従い **制圧・降伏・共同体回復** に固定。動画指示に `no gore` を明記。 |
| **違和感候補** | 本文末「創業者提出用・違和感候補」を参照。 |

---

## 1. 原典分析（試作 v1）

- **型**: 出生（桃）→ 育成 → 共同体の危機（鬼）→ 決意と旅立ち → きびだんごと順番の仲間 → 渡海 → 対峙 → 降伏 → 宝の還元・分配。
- **文化骨格**: 山の労働／川の洗濯、囲炉裏の家、茅葺き、里山と田、わらじ、きびだんごによる順番の盟約、鬼との再秩序化。
- **教育核**: 労働と生活、家族、約束、勇気、協力、感謝、分配、他者理解（鬼の反省まで含めてよい）。
- **演出**: 静かな情緒、誇張しない表情、**絵本調・日本昔ばなし風アニメ**（映画級ライティング・海外アニメ的デフォルメは避ける）。

---

## 2. 正典イベント（省略禁止・順序固定）

| # | イベント | シーン |
|---|----------|--------|
| E1 | おじいさんが山へ芝刈りに行く | S01 |
| E2 | おばあさんが川へ洗濯に行く | S02 |
| E3 | 川上から大きな桃が流れてくる | S03 |
| E4 | 桃を家へ持ち帰る | S04 |
| E5 | 桃を割ると男の子がいる | S05 |
| E6 | 桃太郎と名付けて育てる | S06 |
| E7 | 鬼が村に害を与える | S07 |
| E8 | 鬼ヶ島へ行く決意 | S08 |
| E9 | きびだんごを持つ | S09 |
| E10 | 犬・猿・雉が順番に仲間になる | S10〜S12 |
| E11 | 鬼ヶ島へ渡る | S13 |
| E12 | 鬼と対峙する | S14 |
| E13 | 鬼を降伏させる | S15 |
| E14 | 宝を持ち帰る | S16 |
| E15 | 村・祖父母・仲間へ還元する | S17 |

---

## 3. シーン分割

正典を落とさないため **全17シーン**。短尺派生は別編集（骨格削除禁止）。

---

## 4. キャラ固定・MJ共通設定

**キャラ**: 桃太郎10〜12歳・藍小袖・右前正しい・わらじ・素朴な顔。祖父母は高齢・手ぬぐい・木綿。鬼は子どもが見られる威厳、降伏で下げる。犬猿雉は順番登場、擬人化しすぎない。

**参考画像**: 先にキャラシート1枚生成 → 各MJ先頭に `[CREF_URL]`、`--cref` 可なら `--cw 70`、または同一 `--seed`。**推奨** `--niji 6`。

### MJ共通末尾（全シーンのプロンプト直後にそのまま結合）

```text
 --ar 16:9 --niji 6 --s 200 --no text, watermark, logo, extra fingers, wrong kimono overlap, left-overlap kimono, modern clothing, sneakers, jeans, european castle, chinese palace architecture, cyberpunk, neon, horror grin, splatter blood, gore, giant Hollywood muscles, low-angle heroic blockbuster lighting, dutch angle excess, pixar 3d render, disney princess face, tiktok face, random young girl, orange fruit instead of peach, apple, fantasy armor, game UI, smartphone, plastic wrap, backpack, magic circle, pirate flag, galleon, circus costume, phoenix, giant mythical bird, pirate treasure chest, disco, confetti, close-up horror demon face, western demon, blood splatter, dismemberment, lens flare
```

### 動画共通（Runway / Kling）

- 5〜8秒目安、**カメラシェイクなし**、レンズフレアなし、誇張アクションなし。  
- スタイル: `watercolor storybook, quiet Japanese folktale, slow movement`

以下、各シーンの **MJ本文** は `[CREF_URL]` のあとに続け、**上記「MJ共通末尾」を必ず結合**する。

---

## 5. 各シーン定義 ＋ MJ本文 ＋ 動画

### S01 山へ芝刈り・おじいさん
| 主題 | おじいさんが里山へ柴・草を刈りに行く労働の始まり |
| 原典 | E1 |
| 人物 | おじいさんのみ |
| 文化 | 山道、背負い籠、鎌、里山、朝靄、茅葺き遠景 |
| 小道具 | 籠、鎌、手ぬぐい |
| 教育 | 労働と生活 |
| 違和感 | 登山レジャー、洋風山小屋、現代服 |

**MJ本文**  
`[CREF_URL] elderly Japanese farmer climbing a narrow mountain path at dawn, carrying a woven back basket and sickle for cutting grass and firewood, satoyama cedar and cypress, rice terraces below, thatched village roofs in mist, quiet folktale picture-book watercolor, soft lines, gentle expression, working hands, correct simple cotton work clothes, straw sandals`

**動画**  
`elderly man walks slowly up forest path at dawn, subtle mist drift, carrying basket and sickle, peaceful Japanese mountain village below, watercolor storybook style, no camera shake, no lens flare`

---

### S02 川へ洗濯・おばあさん
| 主題 | 川辺で洗濯を始める日常 |
| 原典 | E2 |
| 人物 | おばあさん |
| 文化 | 川岸の石、木桶またはたらい、手ぬぐい、流水 |
| 小道具 | 洗濯棒、木盆、手ぬぐい |
| 教育 | 労働と生活、家族 |
| 違和感 | 現代洗剤缶、洋ドレス |

**MJ本文**  
`[CREF_URL] elderly Japanese woman kneeling at a clear stream washing cloth in a wooden tub, washing paddle, white tenugui on head, simple cotton kimono sleeves tied back, river stones, satoyama background, soft morning light through mist, quiet folktale picture-book watercolor`

**動画**  
`woman washes cloth in stream, gentle water ripple, minimal head movement, peaceful, storybook watercolor look, no shake`

---

### S03 川上から桃
| 主題 | 川上から大きな桃が流れ、おばあさんが気づく |
| 原典 | E3 |
| 人物 | おばあさん、桃（視線は桃の接近） |
| 文化 | 流れ、山峡、朝霧 |
| 小道具 | 桃（桃色・桃形明示）、洗濯道具 |
| 教育 | 驚きと自然のめぐり |
| 違和感 | オレンジ・リンゴ化、巨大バトル化 |

**MJ本文**  
`[CREF_URL] same elderly woman at riverside laundry pauses, upstream a very large authentic Japanese peach floating down the stream toward her, clear water, morning mist, satoyama river, her gentle surprised posture, quiet folktale picture-book watercolor, peach is clearly peach not orange`

**動画**  
`large peach drifts slowly downstream in mist, woman still by riverbank notices, very slow drift, no explosion, no magical sparkle overload`

---

### S04 桃を家へ
| 主題 | 二人で桃を茅葺きの家へ運ぶ |
| 原典 | E4 |
| 人物 | おじいさん、おばあさん |
| 文化 | 土間入口、縁側、茅葺き |
| 小道具 | 大きな桃、風呂敷 |
| 教育 | 協力、感謝 |
| 違和感 | コンクリ住宅、現代製手押し車 |

**MJ本文**  
`[CREF_URL] elderly Japanese couple carrying a large peach wrapped in furoshiki along a dirt path toward a thatched-roof farmhouse, engawa and wooden gate, late afternoon soft light, quiet folktale picture-book watercolor, cooperative pose, correct kimono`

**動画**  
`two elders walk slowly carrying big peach toward farmhouse, peaceful path, subtle cloth sway, no run`

---

### S05 囲炉裏で桃を割る
| 主題 | 土間・囲炉裏で桃を割り赤子が現れる |
| 原典 | E5 |
| 人物 | 祖父母、赤子 |
| 文化 | 囲炉裏、吊り鍋、障子、土間と畳 |
| 小道具 | 割れた桃、過剰魔法光禁止 |
| 教育 | 家族、生命のめぐり |
| 違和感 | 西洋風ベビー、魔法陣 |

**MJ本文**  
`[CREF_URL] interior traditional Japanese farmhouse doma earthen floor beside irori hearth, elderly couple opening a large split peach, healthy baby boy inside warm soft glow not neon, wooden beams, shoji, quiet folktale picture-book watercolor, gentle wonder, no gore`

**動画**  
`interior irori room, hands open peach halves slowly, soft warm light inside peach, baby visible, camera almost static, no flash`

---

### S06 名付けと育つ
| 主題 | 桃太郎と名づけ、里で健やかに育つ |
| 原典 | E6 |
| 人物 | 桃太郎、祖父母 |
| 文化 | 縁側、田んぼ、手伝いの所作 |
| 小道具 | 箒、小さな木刀程度（殺傷表現なし） |
| 教育 | 家族、労働 |
| 違和感 | アイドル顔、スマホ |

**MJ本文**  
`[CREF_URL] Japanese boy about eleven in simple indigo kosode helping grandparents on engawa, naming moment implied by gentle gesture from grandmother, thatched roof, rice fields, bamboo, quiet folktale picture-book watercolor, modest face not idolized`

**動画**  
`boy helps sweep engawa, grandparents nearby smile subtly, slow daily life rhythm`

---

### S07 鬼が村に害
| 主題 | 村の損害と不安（恐怖誇張なし） |
| 原典 | E7 |
| 人物 | 村人、鬼は遠景または影可 |
| 文化 | 土の広場、茅葺き、木柵 |
| 小道具 | 俵、散乱農具 |
| 教育 | 共同体 |
| 違和感 | 流血、ホラー顔アップ |

**MJ本文**  
`[CREF_URL] Japanese farming village square after raid, tilted rice bales and broken wooden cart, worried villagers in simple kimono, distant silhouette of oni leaving hills, daytime cloudy soft light, no blood, quiet folktale picture-book watercolor, child-safe`

**動画**  
`villagers stand quietly among scattered bales, slow pan, ominous but not scary, no jump scare`

---

### S08 鬼ヶ島への決意
| 主題 | 旅立ちを口にする静かな決意 |
| 原典 | E8 |
| 人物 | 桃太郎、祖父母 |
| 文化 | 囲炉裏端の会話、間 |
| 小道具 | （きびだんごは次） |
| 教育 | 勇気、約束 |
| 違和感 | 叫び、英雄ポーズ過剰 |

**MJ本文**  
`[CREF_URL] young Momotaro in indigo kosode kneeling opposite grandparents by irori, serious but calm resolve, grandparents listening with gentle concern, interior farmhouse shoji light, quiet folktale picture-book watercolor, no shouting pose`

**動画**  
`subtle dialogue moment, slight nod, almost static camera, emotional restraint`

---

### S09 きびだんご
| 主題 | 風呂敷包みのきびだんごを手渡す |
| 原典 | E9 |
| 人物 | 桃太郎、祖父母 |
| 文化 | 風呂敷、土間、旅支度 |
| 小道具 | きびだんご、わらじ、旅帯 |
| 教育 | 感謝、約束 |
| 違和感 | コンビニ包装、リュック |

**MJ本文**  
`[CREF_URL] grandparents hand Momotaro a small bundle of kibidango wrapped in patterned furoshiki at doma entrance, straw sandals and travel sash ready, warm muted colors, quiet folktale picture-book watercolor`

**動画**  
`close hands exchange furoshiki bundle, slow respectful bow depth, no flashy transition`

---

### S10 犬
| 主題 | 犬にきびだんごを分け与え仲間に |
| 原典 | E10a |
| 人物 | 桃太郎、犬 |
| 文化 | 林道、里山 |
| 小道具 | きびだんご |
| 教育 | 約束、協力 |
| 違和感 | 犬の過剰ギャグ化 |

**MJ本文**  
`[CREF_URL] Momotaro on forest path offers a piece of kibidango from furoshiki to a shiba-like loyal Japanese dog sitting politely, eye contact trust, cedar trees, soft noon light, quiet folktale picture-book watercolor`

**動画**  
`boy extends food, dog tilts head gently, single slow beat`

---

### S11 猿
| 主題 | 猿へ分け与え、犬が見守る |
| 原典 | E10b |
| 人物 | 桃太郎、犬、猿 |
| 文化 | 雑木林、岩 |
| 小道具 | きびだんご |
| 教育 | 協力 |
| 違和感 | サーカス風 |

**MJ本文**  
`[CREF_URL] Momotaro shares kibidango with a clever Japanese macaque on a rocky forest path, loyal dog standing nearby, balanced composition, quiet folktale picture-book watercolor, natural fur tones`

**動画**  
`monkey reaches carefully for food, dog sits calm, slow`

---

### S12 雉
| 主題 | 雉が加わり一行が揃う |
| 原典 | E10c |
| 人物 | 桃太郎、犬、猿、雉 |
| 文化 | 尾根道、空 |
| 小道具 | きびだんご（残り少なめ可） |
| 教育 | 協力、調和 |
| 違和感 | 鳳凰化 |

**MJ本文**  
`[CREF_URL] Momotaro with dog and monkey on a hill ridge offers kibidango to a green pheasant joining the group, wide sky over satoyama valley, quiet folktale picture-book watercolor, pheasant natural size`

**動画**  
`line of four figures on ridge, slight wind on clothes, pheasant lands softly`

---

### S13 鬼ヶ島へ渡る
| 主題 | 小舟で岩礁の島へ向かう静かな緊張 |
| 原典 | E11 |
| 人物 | 一行 |
| 文化 | 和船、櫂、海霧、木柵遠景 |
| 小道具 | 舟、櫂 |
| 教育 | 恐れを知って進む |
| 違和感 | 西洋帆船、海賊旗 |

**MJ本文**  
`[CREF_URL] small wooden Japanese rowboat crossing misty sea toward rocky onigashima island with wooden watchtower, Momotaro dog monkey pheasant aboard, pheasant above scouting, soft gray-blue palette, quiet folktale picture-book watercolor, no pirate ship`

**動画**  
`boat moves slowly through mist, gentle oar ripple, horizon steady, no storm exaggeration`

---

### S14 鬼と対峙
| 主題 | 連携で対峙、流血なし |
| 原典 | E12 |
| 人物 | 一行、鬼頭領＋従鬼可 |
| 文化 | 木柵内、土の広場、和材 |
| 小道具 | 木棒程度、刃の切断表現なし |
| 教育 | 正しさ、他者理解 |
| 違和感 | スプラッター、西洋悪魔 |

**MJ本文**  
`[CREF_URL] courtyard inside wooden palisade on rocky island, Momotaro team facing oni leader and retainers, tense but child-safe standoff, wooden clubs lowered not slashing, no blood, dusk soft light, quiet folktale picture-book watercolor, Japanese folklore oni design not western demon`

**動画**  
`wide shot standoff, slight movement, weapons lowered slowly, no fast combat cuts`

---

### S15 降伏
| 主題 | 降伏と誓い |
| 原典 | E13 |
| 人物 | 桃太郎、鬼頭領、仲間 |
| 文化 | 座・頭を下げる所作（誇張しない） |
| 教育 | 調和、反省、約束 |
| 違和感 | 嘲笑ユーモア |

**MJ本文**  
`[CREF_URL] oni leader kneeling in surrender before Momotaro, companions nearby calm, peaceful resolution gesture, no humiliation comedy, evening soft light, quiet folktale picture-book watercolor, child-safe faces`

**動画**  
`slow kneel motion, hold frame on respectful silence`

---

### S16 宝を持ち帰る
| 主題 | 俵・道具を舟に積み里へ |
| 原典 | E14 |
| 人物 | 一行 |
| 文化 | 舟、里へ向かう海路 |
| 小道具 | 俵、木箱 |
| 教育 | 分配の前段として還す |
| 違和感 | 西洋宝箱のみ |

**MJ本文**  
`[CREF_URL] small boat returning loaded with rice bales and simple wooden boxes, Momotaro team aboard calm sea at golden hour, distant thatched village coast, quiet folktale picture-book watercolor, Japanese props not european treasure chest`

**動画**  
`boat glides calm, cargo stable, warm horizon`

---

### S17 還元
| 主題 | 縁側で俵を分け、村人・祖父母・仲間が同じ空気 |
| 原典 | E15 |
| 人物 | 桃太郎、祖父母、仲間、村人 |
| 文化 | 縁側、茅葺き、夕暮れ里山 |
| 小道具 | 俵 |
| 教育 | 分配、感謝、共同体回復 |
| 違和感 | パーティー風派手演出 |

**MJ本文**  
`[CREF_URL] sunset at village engawa, Momotaro grandparents dog monkey pheasant with villagers sharing returned rice bales, quiet gratitude, soft orange sky over satoyama, quiet folktale picture-book watercolor, no confetti no neon`

**動画**  
`slow group tableau on engawa, subtle nods, long hold on peaceful ending`

---

## 6. 自己監査結果（AI制作班）

| 観点 | 判定 | メモ |
|------|------|------|
| 原典崩壊 | PASS | E1〜E15 を S01〜S17 に割当、順序維持 |
| 日本感崩壊 | PASS | 生活史語彙・共通negative |
| 教育安心感 | PASS | 鬼ホラー回避・降伏で締め |
| 感情誇張 | PASS | 動画は静か・固定寄り |
| 海外アニメ化 | PASS | Pixar/Disney/TikTok系を negative |
| 映画化過剰 | PASS | blockbuster / lens flare 系を negative |
| 流行迎合 | PASS | SNS専用フックは本パッケージ外 |

**総合**: 提出可（最終はさく判断）。

---

## 創業者提出用・違和感候補（最大3・根拠付き）

1. **着物の左右前** — MJ誤りやすい。納品時拡大確認推奨。  
2. **「芝刈り」の視覚誤解** — 庭芝・ゴルフ風に寄ったら差し戻し。S01は柴・里山語を入れ済み。  
3. **鬼の顔アップ** — S14〜15はワイド寄り推奨（ホラー回避）。

---

## 完成物の位置づけ

本ファイル＝試作 v1 の**完成パッケージ**（実画像・実動画は別ストレージに格納）。

---

*試作 v1・AI制作班記録終了*
