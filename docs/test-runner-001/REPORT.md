# TEST-RUNNER-001 完了報告

runner input contractのgate成立。Stage 3と同一sourceのclean replay／独立cloneで、新規62 ENOENTが0になった。
Semantic実装・元tests・fixture bytes・Historical harnessは変更していない。
実際のintegration branchへはmergeせず、GROUND-INTEGRATION-002R2は再開していない。

1. **Exact62 inventory**: `failure-inventory.json`に全test name、missing path、owner、repo path、分類、immutable要件、旧copy挙動を記録。
2. **Missing groups**: FRUS86 selected input欠落60件、legacy human-001 snapshot欠落2件。さらに後続依存のdefinitionsとselection-manifestを含め4つの必須入力を宣言。「62ファイル」ではなく62 tests。
3. **Classification**: A=tracked immutable入力、B=setup/test生成物、C=checkpoint Historical artifacts、D=live/runtime。供給対象はA。READMEに詳細。
4. **Source of truth**: execution HEADを一度exact commitへ解決し、Git tree/blobから取得。working fixture bytes、index-only/untracked、別worktree、tmp既存data、networkへのfallbackなし。
5. **Roots/manifest**: `scripts/repro/fixture-inputs.json`。core JSON fixtures、全schema versions、Claim定義root、legacy snapshot root、provenance内2 selected paths。role/required suite/copy mode/conditional-requiredを宣言。
6. **Tracked-only**: dirty checkoutよりGit blobを優先。同名untracked入力は欠落補完にならずfail-fast。untracked余分ファイルはコピーしない。
7. **Materialization**: original repo-relative layout、新規ファイルのみ。current code copyとimmutable input供給を分離。Semantic codeやtest pathの書換えなし。
8. **Integrity**: commit/blob OID/SHA/bytes/path set/contract hashをreceipt化。0444で配置しsetup後・test後に全inputを検証。追加/削除/変更/root symlink replacementはFAIL。
9. **Fail-fast**: required blob欠落で`RUNNER_REQUIRED_FIXTURE_MISSING`。setup/test実行前に検出。uncommitted新suiteによる無宣言供給も拒否。
10. **Untracked proof**: required tracked fixtureを除いたcommitに同名untracked fileを残してもFAIL。存在するtracked fixtureのdirty bytesと無関係untracked bytesも無視。
11. **Path/symlink**: traversal/absolute artifact path/repository alias/target overlapを拒否。active fixture root内のGit symlink/gitlinkは内外問わず拒否。no silent dereference。
12. **Semantic boundary**: 0.1.26 stateは従来のisolated test factoryが構成。test-only definitionsとfrozen selected inputを読み、legacy snapshotは0.1.25 bytesのまま。混合・置換・新たなcanonical data生成なし。
13. **Historical boundary**: 004のresolver/manifests/compiler harnessはbyte変更0。Historical package rootはgeneric fixture scopeにない。旧51 failures再発0。
14. **Provenance**: serving bundle全体をcopyしない。Semanticテストのconsumer用2入力だけを元Git bytesで供給。registry/receipts/bundle生成・変更なし。provenance testsは別candidate環境で検証。
15. **Schema boundary**: docs/schemasの全tracked versionsを維持。0.1.25を残し0.1.26追加があるcommitでは両方存在。latest-only選別なし。
16. **Outputs**: immutable rootsとは別。per-test outputはGit repository外の専用一時root。既存setup生成legacy Projectsはdisposable workspace内の従来storage境界を維持。ambient runtime/loader/Git環境変数は子testへ渡さない。
17. **Independence**: 単独testsで3 cwd/worktree/no-checkout cloneの同一commit receipt一致。full Stage 3 proofと別cwdで動かした独立cloneでも同fixture set／結果。最終cloneでも同結果を再確認。
18. **Clean clone**: `--no-local --no-checkout --single-branch`の独立object databaseからcheckout。別worktreeのfixture filesystem copyなし。npm依存だけ明示外部toolingとして共有。
19. **Before**: exact Stage 3 treeをclean replay、旧runnerで4,149 PASS /64 FAIL。新規62件すべてENOENTを再現。tree=`9d2e968edf19fc84695ea93260002baa0b986c92`は旧HOLD AUTO_MERGEと完全一致。
20. **After**: Stage 3 proof/cloneで4,221 PASS /既知2 FAIL /4,223 tests。元62名すべてPASS、ENOENT0。10件のrunner testsを追加した差を含む。
21. **Semantic focused**: 62 PASS。実装baseに未収録のため、同一sourceのequivalent Stage 3環境で実行。baseにSemanticを統合したとは扱わない。
22. **Historical**: 各full runでreview11/inspection13/batch13/expansion57、182 artifacts、dual identities PASS。子94 testsは親full countに含まない。
23. **Storage**: Stage 3 focused35 PASS（Semanticと合わせ97 PASS）。実装baseのStorage/Human grouped58 PASSも維持。
24. **Human/provenance**: base grouped58＋UI19 PASS。Stage 3 server64 PASS＋live対象2件はprovenance live suite17 PASSで補完。通常UI47 PASS＋live対象2件はlive UI suite9 PASS（重複7）で補完。suiteのskip条件・期待値変更なし。
25. **Full core**: 実装base4,150 PASS /2 FAIL /4,152 tests。Stage 3 final clone4,221 PASS /2 FAIL /4,223 tests。新規failure0。
26. **Failure set**: 既知2件のみ: `current candidate has exactly base plus approved core and enumerated contract implementation scope` / `unapproved current core bytes are rejected even when historical checkpoint integrity passes`。前者unapproved candidate path set、後者は期待するbytes拒否の前に同path-set guardで失敗。原因・guardは未変更。
27. **Typecheck**: implementation base /Stage3 current Core PASS、Stage3 Human/historical-tooling PASS。各Historical family compiler PASS。
28. **Build**: base/Stage3ともPASS。初回sandboxでは共有npmのVite cache書込みがEPERMだったため、その一時書込みを許可して再実行。source/期待値変更で回避していない。
29. **Volume**: base61 files /4,925,955 bytes。Stage3 70 /5,142,151。旧runnerに追加されるtop-level fixture分は7 files /73,113 bytes。schema/core JSONは従来copy分をGit authorityへ置換。source/runtime全部のcopyへ拡張していない。
30. **Live**: start/endとも`9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`。live rootへのwriteなし。liveをfixture供給源に使っていない。
31. **Branch/commit**: `ground/test-runner-001`、worktree `/private/tmp/ground-test-runner-001`。base74ccdfd。専用commit hashは完了応答に記載。
32. **Remote**: `https://github.com/shulovm/seiri-ai-frontend.git` の専用branchのみpush対象。exact hash照合結果は完了応答に記載。
33. **Limits**: runtime code全体のGit-export化はscope外。将来のsuite追加はmanifestレビューが必要。HOLD checkout本体は開始時点で消失していた。残存HEAD/index/MERGE_HEAD/AUTO_MERGE等は不変だが、logs/HEADのみhash変化を観測、原因未確定（明示reflog操作なし）。証跡に記録し、不変と偽っていない。
34. **Replay order**: TEST-RUNNER-001は004（および002）をancestorに包含。次のfresh convergenceはTEST-RUNNER-001 → LIVE-005B → SEMANTIC-007。004/002の重複投入不要。
35. **Return gate**: required inputs完全供給、62PASS、ENOENT0、新規failure0、Historical/Storage/Human維持、typecheck/build/live不変が成立。integration replayへ戻る準備はできたが、自動復帰していない。
36. **Blocker**: 本checkpoint固有のblockerなし。既知2 FAILは残る。master更新・live migration・production Claim/Assessment admissionは引き続き別承認の範囲。

試行中に一時outputをtest repository内へ置いた際はowner-storage契約に拒否された。最終runnerは外部の専用output rootへ分離し、同じ元テストでPASSした。Semantic修正やfixture再生成は行っていない。
