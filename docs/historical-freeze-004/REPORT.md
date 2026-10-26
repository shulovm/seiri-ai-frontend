# HISTORICAL-FREEZE-004 verification report

HISTORICAL-FREEZE-004の個別gateは成立。統合replayは実施していない。
全項目の機械可読証跡は `verification.json`、利用方法・制約は `README.md`。

1. **branch / worktree**: `ground/historical-freeze-004` / `/private/tmp/ground-historical-freeze-004`。新規clean worktreeから開始。
2. **base**: `64c545981f7cb2d8ece3e635ab0c4c796a910884`。002 resolverを含む正式checkpoint。HOLD状態なし。
3. **commit**: このreportを含む専用commit。commit自身のhashは自己参照を避け、完了応答とremote照合結果で報告する。
4. **changed files**: `ground-core/tsconfig.json`、`scripts/repro/test-ground.mjs`、`historical-replay.test.ts`。新規: `family.ts`、`family-pins.ts`、`current-boundary.ts`、`verify-families.ts`、`historical-family.test.ts`、4 family manifests、本README/report/verification。canonical実装・旧package・fixture変更なし。
5. **manifest contract**: format/family/checkpoint、entrypoints/source/type roots、inputs/artifacts/fingerprint、schema/compiler/test roots。manifest全bytesをSHA pin、各fileにcommit/path/blob/SHA/length。
6. **isolation identity**: family + exact checkpoint。003 reviewと003 inspectionは別環境。
7. **source closure**: 42/42/45/52 TS roots。local import/re-export/literal dynamic importを同checkpointで検査。serializer/ID/temporal/validation/substrateを含む。
8. **type closure**: 同checkpointのtypes/interfaces/import aliasesを含む。compilerの全resolved filesがmaterialized tree内であることを確認。current typesへの参照0。
9. **compiler boundary**: historical tsconfigをextends、explicit historical filesとrootDir/incrementalのみ上書き。unreviewed alias/extends/plugin等は拒否。
10. **TypeScript policy**: 全familyのlockとinstalledは5.9.3、Node types22.19.20で一致。compiler binaryの追加固定は不要。version不一致はFAIL。
11. **materialization**: 元layoutを一時treeへGit bytesから配置。102/105/115/141 files。schema assets・file-map検証用witnessを含み、最小runtime import数だけには限定しない。symlinkなし。
12. **module guard**: static/type/literal dynamic importsを検査。computed LIVE-005 operational importはtypecheck-onlyとして宣言し、execution closureに到達したらFAIL。NODE_PATH等を継承せず、cwdをauthorityにしない。
13. **external dependencies**: checkpoint lockとversion一致を要求、regular filesをコピーしtree hashに含める。Node/compiler binary・registry tarball・OSの完全attestationはscope外。
14. **LIVE-003**: review 11/11、inspection 13/13、双方typecheck PASS。003 reviewをpublishしない。
15. **LIVE-004**: 13/13、typecheck PASS。393/394/396と元file-map fingerprintを検証。
16. **LIVE-005**: inherited chain57/57、typecheck PASS。12 inputs / 7 source groups / 31 candidate hashes・IDsの元assertionsを実行。
17. **shared dataset**: SHA `5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`。各familyのselector/generatorは独立。
18. **fingerprints**: 004 `1dbeec4e4719970d7254c4a7b5ba614651a9b13d4bd4fc88308c2b1368a94f69`、005 `c05192742ae39eb86f42a53724d7468922a4173ce764c938a6287b069fa7d3f5`。各historical `verifyFreeze()`で一致。003は元来aggregateなし、個別identity検証。
19. **IDs**: checkpointのgeneratorを元testsが再実行。expected ID/hash変更0。
20. **temporal placeholders**: dry timestamp / UNBOUNDを元prepared contractとして保持。receipt値で置換しない。
21. **review/publish**: original testsとfingerprint関数のみ実行。live root、owner session、publish operational CLIをhistorical executionに渡さない。
22. **root vs historical**: 4 package dirs / 4 testsだけcurrent typecheckから分離。byte coverage guard、current compiler graph、JS/JSX runtime import guardで監視。単なるexcludeではない。baseにpackage dirsは未収録、将来の統合treeは再検証が必要。
23. **APIs**: `verifyHistoricalFamily()` = integrity + compiler。`executeHistoricalFamilyVerification()` = original tests + historical fingerprint。opaque handleを使用。
24. **result identity**: family/checkpoint/manifest/source tree/materialized tree/compiler config/versions/resolved files/tests/fingerprint。canonical recordではない。
25. **no fallback**: Git resolverのwrong/missing identity拒否を維持。family APIsにfetch/current-source/branch/default-root代替なし。runnerの独立setupだけ明示local repositoryからexact historiesを取得。
26. **security**: traversal/absolute/symlink/wrong commit/blob/SHA/lengthを既存resolver suiteで検証。manifest/config/type/source改変、file injection、偽handle、公開receipt改変、outside read/write、child-process、exclude経由importを追加検証。新規security tests全PASS。
27. **independence**: 004、SEMANTIC-007、LIVE-005Bの3worktreeから全4familyを実行。typecheck/tests/fingerprint PASS、全receipt完全一致。current checkout内容は異なる。既存scratch Git testではcurrent bytes改変後も原Git bytes解決を検証。
28. **51 failures**: 51/51を名前単位でPASSに照合。`verification.json.regression_51`に全件記録。元test削除/skip/expected変更0。
29. **TS2554**: correct historical code/types environmentで発生なし。current core typecheck PASS。旧signatureへのcast/any/ts-ignore追加なし。
30. **immutability**: package / selected input / expected hashes / fingerprint / current substrateにdiffなし。実行前後materialized inventoryも一致。
31. **current runtime**: current Core/Human graphおよびserver/src importsにhistorical sourceなし。harnessはscripts/repro audit用途のみ。
32. **Historical suite**: 現行Round1–6等のHistorical testsをfull coreで維持。別childのoriginal historical tests合計94 PASS（checkpoint間の重複を含む）。新規Historical failure0。
33. **full core**: base4132 PASS /2 FAIL（4134）、候補4140 PASS /2 FAIL（4142）。failure name set完全一致。`current candidate has exactly base plus approved core and enumerated contract implementation scope` と `unapproved current core bytes are rejected even when historical checkpoint integrity passes`。期待値を変更していない。子tests94件は親4142件に加算されない。
34. **Storage**: file-store / storage-ownerをfocused実行、PASS。Human adapter testsとの合計58 PASS。
35. **Human**: 現base adapter/browse/source testsを含むfocused58 PASS、UI19 PASS。provenanceはbase未収録のためSEMANTIC-007の未変更referenceで別途17 PASS、live read-only assertions含む、skip0。これを候補branchへのprovenance統合証明とはしない。
36. **typecheck**: current Core / current Human / harness PASS。4 historical environments PASS。3cwdでtypecheck identity一致。
37. **build**: Vite production build PASS。現在のbuildはhistorical packageをruntimeに含めない。
38. **live safety**: start/end SHAとも `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`。live書き込みなし、両HOLDのstatus/staged patch不変。
39. **remote**: `https://github.com/shulovm/seiri-ai-frontend.git` の `ground/historical-freeze-004` のみpush対象。push後exact commit照合は完了応答で報告する。
40. **limitations**: arbitrary package/alias/plugin/computed execution importに一般化しない。Node permission modeはuntrusted native code/networkの完全sandboxを意味しない。external npm tarball非attestation。publish/optional Human CLI経路は未実行。current merged integration treeは未証明。
41. **replay order**: fresh base → 004（002包含）→ LIVE-005B → SEMANTIC-007。002重複merge不要。
42. **return gate**: 004の再現・隔離gateは成立。統合replayを開始できる条件は満たすが、自動復帰しない。実際のmerged treeはその段階で全検査が必要。
43. **blocker**: 004固有blockerなし。既知2 FAILは残存し、完全greenではない。統合承認・fresh convergenceは別checkpoint。

初回sandbox実行ではCLI IPC／HTTP listenのEPERMが発生した。ローカルIPCを許可した再実行では上記の結果となった。テストやassertionを弱めて解消していない。
