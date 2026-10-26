# SEMANTIC-006 — Claim / Assessment Schema Proposal & Invariant Specification

設計案のみ。2026-09-17。実装・schema編集・fixture生成・ID生成・migration・publishは行わない。

調査基準は `/private/tmp/ground-human-008c`、commit `2a3ab4278e278e1d61027ddeea2787b5797c9b36`、schema 0.1.25。以下の新しい型名、field、literalは提案であり、既存canonical contractではない。コードブロックは仕様表記であり実装ではない。

結論：新Claimからconfidenceを除き、immutable propositionと独立したappend-only assessmentを採用する。旧Claimは互換branchとして情報を保持し、新writerによる旧形状の作成は許可しない。schema・pure invariant・artifact admission・persistence transitionを別々に検証する。初期v1は保存inspection excerpt／entity-only scopeと、尺度を明示した0..1 numeric assessmentに限定する。

## 1. Current live fingerprint

Project `088d09dc-dfc5-487a-8f8f-22d2b33a9249`。

開始時fingerprint：`9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`。

終了時の再確認は末尾のverificationに記録する。Document 11 / EpistemicObservation 16 / Evidence 16 / Claim 0 / RealityEvent 0 / RealityState 0。ClaimAssessmentは未実装であり、現在の0件collectionとして捏造しない。

## 2. Claim vNext schema案

新schema番号は未確定。以下のobjectは全てadditionalProperties:falseを原則とし、任意のJSONが許されるvalueのみ例外とする。

```text
ClaimPropositionV1 {
  contract: "claim-proposition.v1"             // 必須discriminator
  id: UUID
  project_id: UUID
  subject_id: UUID | null
  predicate_kind: existing ClaimPredicateKind
  predicate: nonblank string, 1..100
  predicate_ref: DefinitionRef
  value: JSONValue
  manifestation_scope: ManifestationScopeV1
  applicable_from: Timestamp | null
  applicable_until: Timestamp | null
  provenance: existing EpistemicProvenance
  recorded_at: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
}
```

全field必須。confidence、assessment_status、current_confidenceは存在しない。id/project_id、subject、predicate/value、applicability、provenance、各時刻の意味を変更しない。predicate_refは問いの意味と許容valueを固定するための新参照。新contractでsubject_id=nullを許すことは未同定の維持であり、entity-onlyの同定済みsubjectを捏造する手段ではない。

ProjectState案：`claims: Array<LegacyClaimV0125 | ClaimPropositionV1>`、必須の`claim_assessments: ClaimAssessmentV1[]`を追加。他collectionは現contractを維持する。LegacyClaimV0125は旧Claimの正確なshape、confidence必須、新discriminatorなし。両branchはoneOfで排他的にする。legacy側の保存を許すschemaは、legacyの新規作成をwriterへ許可する意味ではない。

updated_atは既存field名との連続性のためClaimには残すが、新Claimの作成後は不変。初回created_atと同値にし、assessment追加で更新しない。ProjectState/projectのupdated_atとは別。

現差分：既存13fieldのうちconfidenceを新branchから除去、他12fieldを保持。contract/predicate_ref/manifestation_scopeを追加。旧schema file自体は変更しない。

## 3. 現confidence fieldの扱い

0.1.25およびlegacy互換branchでは、そのまま必須numberとして保持する。新Claimから削除し、nullable化しない。新writerはconfidence:nullも数値も拒否する。

旧数値を新assessmentへ自動変換しない。単純なnullable方式はassessmentと命題を再び混在させるため採用しない。新Claimの未評価状態はderivedであり、記録された旧数値の由来不明状態とは異なる。

## 4. manifestation_scope schema案

共通参照を先に定義する。

```text
ArtifactRef {
  artifact_key: namespaced opaque nonblank string
  sha256: exactly 64 lowercase hexadecimal characters
}
DefinitionRef {
  id: namespaced nonblank string
  version: nonblank string
  artifact: ArtifactRef
  pointer: JSON Pointer string               // rootは空文字を明示
}
ManifestationScopeV1 =
  { kind: "entity_only" }
  | {
      kind: "frozen_artifact"
      representation_kind: "stored_inspection_excerpt"
      source_entity_id: UUID
      artifact: ArtifactRef
      selector: {
        collection_pointer: JSON Pointer
        identity_field: nonblank property name
        identity_value: nonblank string
        field_pointer: JSON Pointer          // 選択recordからの相対的なJSON Pointer
      }
      description: nonblank string, max 2000
    }
```

v1のfrozen branchはJSON内に保存されたinspection excerptに限定。FRUS専用のsource ID、field名、URL判定は実装しない。selectorは任意コードやJSONPathではなく、arrayを指すpointer→identity fieldで一意選択→record内pointerでstringを選択、という限定手順。0件・複数件・型不一致は拒否。own JSON membersのみを扱う。

frozen branchのsource_entity_idは同Projectの既存RealityEntityで、subject_idと一致を要求。source_entityのkindがdocumentであることだけからscopeを推定しない。entity_onlyはmanifestationが不要である命題用。source-content predicate定義がfrozen scopeを要求する場合、entity_onlyへの逃避は禁止。

descriptionは明示的な読解補助であり比較keyには入れない。record全体は不変。artifact_keyは回収locatorであり意味identityではない。比較に使用するbytes anchorはsha256。representation_kind/source entity/selectorも必要であり、hashだけをsemantic manifestation identityとは呼ばない。

edition/transcriptionの一般的同等性やHTML全文scopeは未対応のまま拒否する。未知のscope kindをgeneric objectとして通さない。

## 5. Claim immutability invariants

新Claimは作成後、全stored fieldsを更新不可とする。semantic identity-bearing fieldsはsubject/predicate definition/value/scope/applicability。provenance・記録時刻も、出所を後付け変更しないため保存recordとして不変。

confidenceやassessment数の変更によってClaimを書き換えない。predicate定義artifactの同じid/versionを違うbytesへ差し替えることも禁止。record IDの一致だけで新しい意味を承認しない。

## 6. Correction / delete / ID reuse

内容訂正は新Claimとして独立したadmissionを要求する。旧Claimを保持し、新Claimの存在から旧Claimの無効化を推論しない。同一scopeで異なるvalueなら両positionが残る。

v1はClaimのdeleteを禁止し、tombstoneも導入しない。保存recordを残すためID reuseを防げる。将来retention/deletionを導入する場合は、永久ID予約と参照履歴を別途設計する。supersession/correction relationは未対応。

## 7. ClaimAssessment collection案

ProjectStateに必須`claim_assessments`を追加する。空配列は有効。新Claimを保存するために評価recordを作る必要はない。

```text
ClaimAssessmentV1 {
  id: UUID
  project_id: UUID
  claim_id: UUID
  assessor: AssessorIdentity
  purpose: "proposition_epistemic_assessment"
  method_ref: DefinitionRef
  scale_ref: DefinitionRef
  result: number in [0, 1]
  calibration_qualification: DefinitionRef
  evidence_snapshot: EvidenceSnapshotRef
  rationale: nonblank string, max 10000
  rationale_artifact?: ArtifactRef
  assessed_at: Timestamp | null
  recorded_at: Timestamp
  created_at: Timestamp
}
```

purposeは一般的な作業検証・source authenticity検査をconfidenceへ流し込まないために限定する。method定義が具体的な評価対象・尺度の意味を定める。assessmentが存在することと確率校正済みであることは別。

## 8. Required / optional fields

上記のrationale_artifact以外はrequired。assessed_atもfield自体はrequiredでnullを許す。updated_atは持たせない。recordの更新行為が存在しないため、評価が更新されたかのようなfieldを追加しない。

入力artifact配列はfield必須で空を許すが、methodが必要とする資料が揃わなければadmissionで拒否する。空配列だけから評価根拠なしと推定しない。新FRUS Claimにassessmentは作らない。

## 9. Assessor schema

```text
AssessorIdentity {
  kind: "human" | "organization" | "ai_model" | "system"
  entity_id?: UUID
  external_id?: namespaced stable identity string
  label?: nonblank string
}
```

entity_id/external_idの少なくとも一方を必須とし、nullや空文字をidentityとして許さない。両方ある場合の同一主体対応をwriterが確認する。entity_idは同Projectで参照可能であること。external_idはnamespace＋local identifierの形式を検査し、割当の安定性はoperations identity policyで確認する。

labelだけでは拒否。kindだけでも拒否。文字列形式の妥当性を本人認証・権限認定・信頼性とは扱わない。架空Entityを作らない。

## 10. method_ref

DefinitionRefで局所的な固定定義artifactを参照する。artifactはid/versionと一致し、手順・評価対象・入力要件・必要なartifact role・許容scale・時刻要件・結果解釈を持つ。方法名だけではadmission不可。

canonicalには定義への参照、operationsの保護されたregistry/storeにはbytesと解決設定を置く。server configだけにmethodの意味を置かない。algorithm実行の再現に設定/model versionが必要なmethodは、それらの固定も要求する。

参照先のdefinition自体もversion付きの閉じたshapeにする案：

```text
MethodDefinitionV1 {
  id, version,
  purpose: "proposition_epistemic_assessment",
  procedure: nonblank string,
  procedure_artifacts: ArtifactRef[],
  allowed_scales: Array<DefinitionRef | { id, version, local_pointer }>, // 1件以上
  input_requirements: {
    evidence_required: boolean,
    observation_required: boolean,
    frozen_input_required: boolean,
    review_artifact_required: boolean,
    rationale_artifact_required: boolean,
    known_assessed_at_required: boolean,
    resolved_assessed_at_required: boolean
  },
  interpretation: nonblank string
}
```

このshapeは必要資料の機械的検査と固定手順の再読を可能にする。procedureの実施品質や判断の正しさをJSON validationで保証するものではない。特殊methodが追加の実行検査を要するなら、識別されたversionのvalidatorを別に実装するまでそのmethodのpublishは許可しない。

resolved_assessed_at_required=trueならknown_assessed_at_required=trueを要求する。局所参照と外部参照のshapeはoneOfで排他的にする。

## 11. scale_ref

DefinitionRefでid/version、range、両端の意味、interpretationを固定する。initial v1はrange=[0,1]を宣言するscaleだけを受理する。0.8の意味はこの定義に依存し、[0,1]であることから確率と推定しない。

methodとscaleは同じJSON artifact内の別pointerでもよい。別artifactでもよい。同じid/versionに異なるdefinition bytesを結び直さない。保存recordのmethod/scale整合はadmissionで確認する。

ScaleDefinitionV1のrequired fields案はid/version、minimum:0、maximum:1、minimum_meaning、maximum_meaning、interpretation、numeric_kind。numeric_kindはこのv1で必要なsubjective_estimate/rule_score/probability_estimateの三分類に限定する提案であり、scope別confidenceやtruth scoreのenumは増やさない。probability_estimateという宣言だけでcalibratedとはしない。

同一artifactにmethodとscaleを入れる場合、artifact内部のallowed_scalesはid/version/local pointerによる局所参照とし、自分のartifact hashを自分のbytesに含めない。assessment側のDefinitionRefがartifact hashを固定する。別artifact参照はArtifactRef付きでよい。

## 12. Result validation

JSON Schemaではnumber/minimum:0/maximum:1を検査する。runtimeでもfinite numberを要求し、NaN/Infinity/文字列を拒否する。

artifact admissionではscale定義のrange=[0,1]、methodの許容scale、resultの意味・追加制約を検査する。JSON Schemaだけで外部定義との整合は保証できない。

scale別の任意rangeを初期v1では採用しない。0..100の入力を自動で0..1へ換算せず、未対応として拒否する。categorical/structured resultはfuture scope。

## 13. Calibration qualification

assessment recordにQualificationの固定参照を必須で置き、内容はmethod artifactまたは評価固有の凍結artifactへ置く。単なるmethod名からrunのcalibration適用を推定しない。

参照先は、この評価で数値をどう解釈するか、calibrationが未確立/非適用/根拠付きで宣言されるのいずれかを明記する。根拠付き宣言では固定されたbasis refsと適用条件を要求する。新しい多数のcanonical enumは導入せず、version付きqualification文書のcontractで検査する。

共通method内qualificationの再利用は、その適用条件を満たす評価だけに許可する。主観的見積りとrule scoreと校正済み確率をreaderが同一視しない。根拠付き宣言の保存も、GROUNDが校正の正しさを独立に証明したという意味ではない。

QualificationDefinitionV1のrequired fields案はid/version、method identity、scale identity、qualification（not_established / not_applicable / declared_with_basis）、explanation、applicability、basis_refs。最後の配列はdeclared_with_basisなら1件以上、それ以外でもfieldは保持する。subjective/rule/probabilityの種類と、calibrationの根拠有無は別軸である。

同一definition artifact内のmethod/scale identityは局所id/version/pointerで表し、self-hashを含めない。qualifierの条件に今回の評価が該当することをadmissionで確認し、unknownを宣言根拠ありへ補完しない。

## 14. Evidence snapshot schema

```text
EvidenceSnapshotRef {
  project_snapshot: {
    project_id: UUID
    stored_schema_version: supported version string
    artifact: ArtifactRef
  }
  evidence_ids: unique UUID[]
  observation_ids: unique UUID[]
  frozen_inputs: ArtifactRef[]
  review_artifacts: ArtifactRef[]
}
```

project_snapshot.artifact.sha256は元ProjectState exact bytesのfingerprint。normalized objectのhashと取り違えない。対象Claimを含む評価前snapshotを要求し、assessment自身を含むafter snapshotは使わない。

Evidence/Observation IDは参照snapshotの同Project内で存在確認する。observation_ref Evidenceについては、参照先Observationもsnapshotに存在し、評価basisに含まれることを要求する。Evidence IDが現在のliveから消えていても、過去snapshot中の根拠を現在のliveで置換しない。

## 15. Snapshot artifact resolution

保護されたoperations artifact registryによる解決を採用する。ArtifactRefのopaque keyを、承認済みresolverが不変bytesへ解決しSHA-256を検査する。keyを直接filesystem pathへ変換せず、外部URLへの自動fetchも行わない。

registryはkey→固定hash/格納先/媒体種別/保持責任を管理する。返されたhashとの不一致、未登録、missing、symlink/path逸脱等は失敗。空・最新snapshot・別sourceへfallbackしない。

canonicalにfilesystem pathやmachine secretは保存しない。参照artifactの削除・上書きを禁止するretention contractとバックアップが必要。保存場所の移設は同一bytesの回収mappingだけを変更し、canonical refを書き換えない。

現HUMAN-008B resolverは特定の16 bindings用であり、この汎用snapshot archiveを実装済みとは扱わない。

## 16. Rationale

rationaleはnon-whitespace string、maxLength 10000を提案する。JSON Schemaの長さ/非空検査に加え、空白だけをruntimeで拒否する。上限はtransport/storage上の境界で、証拠の重要度ではない。自動truncateしない。

長文はrationale_artifactへ分離する。methodが詳細artifactを要求する場合はoptional fieldであってもそのmethodのadmissionで必須。短いcanonical rationaleだけに数値根拠を縮約して失わない。

## 17. assessed_at

既存timestamp syntaxとcanonical temporal resolutionを再利用する。assessed_at=nullは評価行為の時刻不明。recorded_at/created_atから補完しない。

recorded_at/created_atは必須timestamp。評価順序を必要とする処理でUNRESOLVEDなら順序を未解決として扱い、Dateで代替解決しない。methodが評価時刻を要求する場合、不明/解決不能を勝手に許可しない。新たな一般的時刻大小制約はこの提案で発明しない。

## 18. Append-only enforcement spec

責務を四段階に分ける。

1. JSON Schema：shape、required、禁止field、型、数値範囲。
2. pure state invariants：project一致、参照存在、ID一意、before/afterのimmutable record比較。
3. artifact admission：固定資料を解決し、predicate/method/scale/qualification/basisを検証。
4. writer/persistence：owner session下でbefore fingerprintを再確認し、admission対象payloadと一致するafterのみatomic publish。

新Claim/ClaimAssessmentは未存在IDへの完全payload追加のみ。既存IDへのupsert/update/status_change/deleteは拒否。同じpayloadをもう一度patchする場合も、core mutationとしては拒否し、retryはoperationsが既存結果を返す。

直接saveProjectで差し替えても回避できないことを要求する。現saveProjectはschema validation後にsnapshotを書けるため、state-engineに制約を足すだけでは不足。vNextのcanonical write入口全てでbefore/after transitionを検証する。外部artifact解決はpure core reader内部へ混入させず、writer側で検証した入力を境界で束縛する。

新規rootへのinitial state injectionで制約を迂回しない。既存データ取り込みも明示migration/admission経路に限定する。

## 19. Retry / idempotency

operations keyとcanonical assessment IDを分離する。scopeはProject＋writer/request namespace＋request key。一度割当てたIDと初回payloadをprepared記録へ固定する。

同key/同payload→既存assessmentとreceiptを返す。同key/異payload→拒否。再評価→新key＋新ID。payload比較では保存timestampも初回値を再利用し、retryごとに再生成しない。

prepared後・publish前、publish後・receipt完了前のcrashを区別する。後者は固定ID/payloadが存在することを検証してreceipt完了へ進み、二重追加しない。別writerの変更でbeforeがずれた場合は無条件retryしない。結果内容が同じだけの別評価をhash dedupeしない。

## 20. Referential invariants

- assessmentのclaim_idは同Projectの新immutable branchに存在する。
- basis snapshotにも同じClaim recordが存在し、内容が一致する。legacy mutable targetは拒否。
- assessor IDがvalid、Entity refは同Projectに存在。external identityは承認済みnamespace。
- method/scale/qualificationが固定bytesへ解決し、id/version/pointer/適用条件が整合する。
- Evidence/Observationはbasis snapshotに存在し、basis refsが破損していない。
- frozen inputs/review/rationale artifactが必要に応じて回収可能。
- resultとmethod/scaleが整合する。
- referenced Claim/assessor Entity等を削除してcurrent referential integrityを壊さない。

ID/hashだけを検査し、意味やmethod適用条件が未確認のまま評価済みにしない。schema validation PASSとadmission PASSを区別する。

## 21. Legacy Claim read model

```text
{
  kind: "legacy_claim",
  proposition: <旧Claimの命題fieldを保持したview>,
  legacy_record: <旧Claim全field>,
  legacy_numeric_confidence: <stored number>,
  qualification: {
    method: "NOT_RECORDED", assessor: "NOT_RECORDED",
    calibration: "UNKNOWN", source_snapshot: <exact stored snapshot reference>
  },
  assessment_state: "LEGACY_NUMERIC_PRESENT",
  assessment_count: 0,
  assessment_records: []
}
```

これはtransport/read view。new ClaimAssessmentを生成しない。0件は新contractのassessmentについてで、歴史的に評価行為がなかったという意味ではない。

旧Historicalのuncalibrated説明を追加する場合は特定sourceへの固定参照を別に付ける。一般legacyのUNKNOWNを書き換えない。旧recordにないmanifestation_scopeをentity_onlyとして補わず、未宣言としてlegacy scopeに隔離する。

## 22. UNASSESSED read model

```text
{
  kind: "claim_proposition",
  proposition: <ClaimPropositionV1>,
  assessment_state: "UNASSESSED" | "ASSESSMENTS_PRESENT",
  assessment_count: nonnegative integer,
  assessment_records: <all matching stored records>
}
```

validな完全Project snapshotで該当recordが0件のときだけUNASSESSED。Claim recordにはstatusを保存しない。ASSESSMENTS_PRESENTは校正済みや高confidenceの意味ではない。

## 23. Assessment failure semantics

vNextの必須collection欠落、型不正、Project snapshot取得失敗はread failure。空配列へ変換しない。部分取得しかできないreaderは完全なcount/UNASSESSEDを返さない。

保存assessmentは読めたが外部method/basis artifactだけ回収不能の場合、stored assessmentと件数を保持し、reference_resolutionの失敗を別に返す。成功した再検証やUNASSESSEDへ変換しない。表示可能なstored declarationと監査artifact availabilityを分ける。

## 24. Belief vNext output

```text
{
  comparison_scope,
  at,
  applicable_claims,
  positions: [{ value, value_key, claim_ids, claims,
                supporting_evidence, contradicting_evidence,
                has_evidence_tension }],
  status: NO_CLAIMS | UNCONTESTED | CONTESTED,
  per_claim_assessment_views,
  unassessed_claim_count,
  legacy_numeric_claim_count,
  assessment_count,
  unresolved_reasons
}
```

countsはこのqueryに適用するClaimsの範囲。method/scale/resultは各assessmentのraw recordを返す。confidence_summary/min/max/mean/current scoreを新viewに置かない。position existenceはassessmentの有無に依存しない。旧readerの返却型を黙って変更せず、vNext APIをversionで区別する。

legacy queryはlegacy scopeとして別結果にし、新frozen/entity_only scopeへ自動合流しない。subject全体の一覧はscope別結果を返し、異scopeの総合CONTESTEDを作らない。

subject_id=nullの新Claimも既存の未同定subject読取に相当する専用inventoryへ残す。Entity queryへ架空subjectとして結び付けず、assessment未評価とsubject未同定を混同しない。

## 25. Comparison scope

新scope key = Project＋subject＋predicate_kind＋predicate＋predicate definition identity＋manifestation comparison key。

definition identity = id/version/definition artifact hash/pointer。frozen scope key = kind/representation_kind/source_entity_id/artifact sha256/selector。回収用artifact_keyとdescriptionは除外する。同じbytesのlocator aliasでfalse conflictを作らない。異bytesを意味同値として自動統合しない。

valueはposition keyとして分離する。applicability boundsは命題identityに関係するがcomparison keyへ期間全体を入れず、query時点filterで適用性を決める。predicateの許容value shapeは固定definitionで検証する。FRUS候補ではbooleanのみ。

## 26. Applicability behavior

既存の半開区間[from,until)、null from=下限なし、null until=上限なしを維持。null/nullは常時適用でunknownではない。時点filter後、同じ意味scopeでposition比較する。

canonical temporal resolverを使い、unresolvedはunresolved/errorとして返す。recorded_at/inspection date/historical date/native Dateを代用しない。旧readerの時間上の制約を黙って緩めない。

## 27. ClaimEvidenceLink compatibility

既存shapeとSUPPORTS/CONTRADICTSをそのまま使える。参照先claim_idがlegacy/newいずれかの同Project Claimに存在することを検査する。

Claimの支持関係とassessmentの評価basisは異なる。assessment.evidence_snapshotへ自動コピーしない。後でlinkが増えても過去assessmentのbasisを変えない。新Claimのinitial linkはadmission artifactとreceiptに束縛する。

## 28. Admission artifact schema案（operations）

```text
ClaimAdmissionArtifactV1 {
  format: "claim-admission.v1",
  project_id,
  input_project_snapshot: { artifact, stored_schema_version },
  candidate_claim: <complete proposed new Claim>,
  proposed_links: <complete proposed links>,
  predicate_definition: DefinitionRef,
  manifestation_scope: <exact candidate scope>,
  source_observation_ids, source_evidence_ids,
  frozen_inputs: ArtifactRef[],
  transformation_rationale: nonblank string,
  preserved_limitations: nonempty string[],
  reviewer: AssessorIdentity,
  review_process: DefinitionRef,
  approval: { result: "APPROVED" | "REJECTED", reviewed_at: Timestamp | null }
}
```

publish可能なのはAPPROVEDだけ。draftはこの完成artifactと別。scope/predicate参照がcandidateと重複する部分は完全一致を要求する。ID・記録時刻を含むcomplete候補をprepared時点で固定してから承認する。レビューはconfidence assessmentではない。

candidate.provenance.external_idは一度割り当てたadmission requestの安定した論理identityを参照する。candidateを内包する完成admission artifactのhashをcandidate自身へ入れない。完成後にoperations registry/receiptがrequest identityとartifact hashを束縛する。これにより内容hashの循環を避ける。

意味レビューでは、対象限定、paraphrase/excerptの区別、valueの問いへの適合、unboundedの根拠を確認する。hash照合だけでレビュー完了にはしない。

## 29. Publish receipt schema案（operations）

```text
ClaimPublishReceiptV1 {
  format: "claim-publish-receipt.v1",
  project_id, writer, request_identity,
  before_snapshot: ArtifactRef,
  after_snapshot: ArtifactRef,
  claim: { id, record_hash, hash_contract },
  claim_evidence_links: [{ id, record_hash, hash_contract }],
  admission_artifact: ArtifactRef,
  recorded_at: Timestamp,
  publish_result,
  independent_read_result
}
```

snapshot sha256はexact bytes。record_hashは別のversion付きserialization contractを明記し、snapshot fingerprintやsemantic identityと同一視しない。既存publishedRecordHashを無条件で新canonical identityに昇格させない。

prepared/completedはoperations workflow。after hashはpublish後receiptへ置き、Claim内へ入れない。assessmentなしのClaim＋link publishを許せる構造だが、現時点のpublish許可ではない。

## 30. FRUS 86 dry vNext Claim payload

以下は非実行template。UNBOUNDは説明用placeholderであり、UUID/timestamp/refとしてschema-validではない。実在しないIDを生成していない。

```json
{
  "contract": "claim-proposition.v1",
  "id": "UNBOUND",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "subject_id": "0c60e1dc-c8ce-5a88-a112-ffb8410231fe",
  "predicate_kind": "attribute",
  "predicate": "contains_request_to_respect_chinese_neutrality_and_administrative_entity",
  "predicate_ref": {
    "id": "UNBOUND",
    "version": "1",
    "artifact": { "artifact_key": "UNBOUND", "sha256": "UNBOUND" },
    "pointer": ""
  },
  "value": true,
  "manifestation_scope": {
    "kind": "frozen_artifact",
    "representation_kind": "stored_inspection_excerpt",
    "source_entity_id": "0c60e1dc-c8ce-5a88-a112-ffb8410231fe",
    "artifact": {
      "artifact_key": "UNBOUND",
      "sha256": "43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f"
    },
    "selector": {
      "collection_pointer": "/sources",
      "identity_field": "id",
      "identity_value": "frus:1904:86",
      "field_pointer": "/excerpt"
    },
    "description": "凍結inspection入力のFRUS 86 source recordに保存されたexcerpt。公開FRUS全文・原電報ではない。"
  },
  "applicable_from": null,
  "applicable_until": null,
  "provenance": {
    "kind": "system",
    "external_id": "UNBOUND",
    "label": "承認された命題作成processとadmission artifactへの参照"
  },
  "recorded_at": "UNBOUND",
  "created_at": "UNBOUND",
  "updated_at": "UNBOUND"
}
```

provenance.kind=systemは承認済みprocessによる命題作成を想定した案であり、現writerの存在だけでreview済みとはしない。実際に採用するprocessと参照先はadmission前に固定する。Claimへのconfidence、assessment_status、assessmentは一切ない。

凍結入力の現在の回収元は `fixtures/human-interface/provenance/historical-round1-v1/005/selected-c86-request.json`。origin commit `1a5cd833b96c40aea87752f86dea9949db661ecd`、origin path `ground-core/injections/historical-expansion-v1/selected-c86-request.json`。これらはartifact registryの登録根拠であり、Claimへfilesystem pathを埋めない。

null/nullは固定excerptについてのatemporal命題というadmission条件付き候補。現在の公開FRUSや歴史上の実現へscopeを広げない。predicate定義artifactとregistry keyが未作成であるため、このpayloadをpublish可能としない。

## 31. FRUS 86 dry Link payload

```json
{
  "id": "UNBOUND",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "claim_id": "UNBOUND",
  "evidence_id": "302b3779-6975-56e4-aba0-0f2b16a078c8",
  "relation": "SUPPORTS",
  "recorded_at": "UNBOUND",
  "created_at": "UNBOUND",
  "updated_at": "UNBOUND"
}
```

EvidenceはObservation `3253dd31-256c-543c-a1f5-2566cbc17132`を明示参照する。Observation→frozen inputは既存のexplicit resolver bindingであり、全経路をcanonical relationと呼ばない。支持linkはderivation reviewの代わりではなく、admissionで命題との適合を確認する。

## 32. Isolated test Project plan

将来の実装検証は隔離rootのtest Projectで行う。今回fixtureは作らない。test用recordをlive Realityや史実proofへ昇格させない。

対象：未評価Claim、assessment 1件、複数assessment、未評価Claim同士のtrue/false競合、異excerptの非競合、legacy read、非互換writer、archive障害、再評価、retry/crash。live Projectを最初のupgrade対象にしない。

## 33. Migration normalization policy

0.1.25のvalid stored bytesを維持し、read normalizationで新viewへ移す。claims内のlegacy recordは全fieldをそのまま保持。新scope/predicate_ref/assessor/methodを補完しない。claim_assessments=[]は、このcollectionを持たない既知旧schemaからの明示的な互換正規化だけに許す。

vNext stored dataにcollectionが欠ける場合は不正であり、同じ補完を適用しない。normalizationは物理保存を許可するものではない。saveにより旧Projectをsilent upgradeする動作を禁止する。

将来の明示physical upgradeではlegacy recordをcarry-onlyとして保存できるが、新writerはその追加/変更/削除を行わない。新assessmentはそのlegacy recordへ直接作成不可。legacy propositionを新contractで扱うなら別のscope/admissionが必要で、機械的昇格はしない。

## 34. Serialization requirements

legacy数値、JSON valueの型/全members、timestamp表記、array内容/順序、new scope、assessment結果、ref、unknown qualificationをround-tripで失わないこと。

JSON object key orderとexact bytes identityは別。再serializationでsnapshot hashが変わり得るため、元snapshot bytesをarchiveに保持する。古いfingerprintを新bytesへ再利用しない。

型castだけのClaim[]互換ではなく、legacy/new unionを実際にnarrowして処理する。new recordに旧confidence defaultを埋めるserializationは禁止。

## 35. Old writer rejection

vNext schemaを扱えないwriterはfail closed。旧patch versionやconfidence入り新Claimを、normalizeして通さない。明示migration経路以外でlegacy branchを新規作成できない。

既存legacy recordをunchangedにcarryすることと、旧writerによる更新を区別する。Project root owner/capability設定を更新し、古いbinaryがそのままlive rootへ書ける状態でupgradeしない。schema自体だけでは古いprogramの全file置換を防げない。

## 36. Old reader rejection

未知schemaはunsupportedとして失敗。collectionを捨てて読まない。version偽装やassessmentを落とした0.1.25 payloadの提供はしない。

新readerにはstored/read schemaとlegacy qualificationを明示する。既存の旧schema-readerを維持する場合も、新Projectを透明に渡すことはしない。

## 37. Human Interface future contract

Claim proposition、frozen inspection excerpt scope、Unassessedまたはassessment一覧を分離して表示可能にする。assessmentにはassessor/method/scale/result/rationale/basis snapshotを表示し、legacy numericは別領域とする。

read failure/参照不可/未評価を分ける。代表値・最新評価・trust gaugeを生成しない。今回UI変更なし。

## 38. Explicitly deferred features

assessmentの撤回、supersedes/corrects、categorical/structured result、fusion/effective confidence、generic manifestation equivalence、historical reconstruction admission、Event/State admissionはv1外。unknown enumやextra fieldsを許可して先取りしない。

撤回が運用上必要になった場合、既存評価の上書きで対処せず別contractまで止める。新しい評価が旧評価と違うこと自体は問題なく保持できる。

## 39. Implementation checkpoint acceptance criteria

1. 新Claimでconfidence欠落が正常、confidence:null/numberを含めると拒否。assessment 0件で保存/readできる。
2. 新Claim/new assessmentのupdate/delete/status_change/ID再利用を拒否。direct snapshot saveの迂回も拒否。
3. scope selectorの0件/複数/型不一致、hash不一致、未登録artifactをadmissionで拒否。異scopeでfalse conflictを作らない。
4. 同scopeのtrue/falseはassessmentなしでもCONTESTED。異適用期間は既存query時間規則でfilter。unresolved時間は未解決のまま。
5. assessor identityなし、legacy target、project不一致、missing Claim/Evidence/Observationを拒否。
6. method/scale/qualificationの固定definition、result範囲、必要rationale artifactを検証。scale不整合は自動換算せず拒否。
7. basisは評価前snapshotに固定。参照後のlive変更で過去assessmentが変わらず、after-hash循環参照がない。
8. 複数評価を全件保持。min/max/mean/latest/current_confidenceを返さない。
9. 0件とcollection failureとartifact failureを区別。外部資料不達でstored assessmentを消さない。
10. legacy数値を保存・表示し、method/assessor/calibrationを創作しない。新assessment数へ含めない。
11. same request/same payload、same request/different payload、reassessment、publish前後crashを区別し、二重追加しない。
12. full round-trip、stored/read schema、archive bytes/hash、owner release後のindependent readを検証。
13. 旧writer/reader拒否、明示upgradeとsilent normalization-save禁止を検証。
14. isolated rootだけで検証し、live/proof fixture/experimental source不変を確認。FRUS候補やtest dataを自動publishしない。

これらは将来の受入条件であり、今回PASSした実装テストではない。

predicate定義artifactもid/version、predicate_kind、predicate、問いの説明、許容value schema、許容scope kinds、applicability policyを固定する閉じたversion付き文書を要求する。FRUS例ではboolean valueとstored_inspection_excerptのみを許す。定義artifact hashが変わる場合、新definition identityとして扱う。自然言語の同義性を自動判定しない。

## 40. Schema実装へ進めるか

この限定v1について、承認後にisolated implementationへ進める粒度の案になった。JSON Schemaだけを先に変えて完了とはできず、transition guard・artifact resolution・read unionを同一checkpointの成立条件にする。

実装が成立してもlive migration/publishは別承認。method/scale定義の具体例やFRUS predicate定義artifactは、その検証checkpointで明示的に用意する対象で、今回は生成しない。

## 41. 推奨次checkpoint

SEMANTIC-007 — Isolated Claim / Assessment vNext Implementation & Contract Verification。

上記受入条件をisolated test rootで実装・検証する。live upgrade、FRUS Claim admission、Human Interface変更を含めない。今回は開始しない。

## 42. Blocking issue

現在のlive publishには、新schema/immutable enforcement/汎用artifact archive/read contractが未実装、FRUS predicate定義とartifact registry登録が未作成、命題のadmission review未実施というblockerがある。

propositionとassessmentを分離する設計を阻む未解決点は、限定v1内では残さない方針。ただしこの提案自体の承認と実装検証が必要。一般manifestation同等性やassessment撤回を解決済みとしない。

## Source anchors / verification

- 既存Claim schema: `/private/tmp/ground-human-008c/docs/schemas/ground-core-project-state.v0.1.25.schema.json:1435`
- 既存Claim/Provenance types: `/private/tmp/ground-human-008c/ground-core/types.ts:313`
- 現upsert: `/private/tmp/ground-human-008c/ground-core/state-engine.ts:614`
- 現save/load boundary: `/private/tmp/ground-human-008c/ground-core/file-store.ts:70`
- 旧正規化: `/private/tmp/ground-human-008c/ground-core/migrate.ts:1114`
- Belief scope: `/private/tmp/ground-human-008c/ground-core/reality/belief.ts:211`
- Temporal resolution: `/private/tmp/ground-human-008c/ground-core/temporal.ts:43`
- Frozen selected input: `/private/tmp/ground-human-008c/fixtures/human-interface/provenance/historical-round1-v1/005/selected-c86-request.json`

この文書だけをrepository外に作成。実schema/TypeScript/core/UI変更なし。新ID/fixture/assessment/migration/publishなし。

終了時verification：loadProjectSnapshotのstored/read schemaはともに0.1.25、validation.valid=true。live fingerprintは開始時と同じ `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`。Document 11 / Observation 16 / Evidence 16 / Claim 0 / Event 0 / RealityState 0。既存readerでFRUS 86 ObservationのEvidence `302b3779-6975-56e4-aba0-0f2b16a078c8`を再確認。selected input SHA-256は `43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f` と一致。git statusはclean。

実装変更がないためcore/UI suiteを再実行しておらず、新schema案のvalidation PASSも主張しない。実施したのは既存canonical snapshot validationとread/hash検証、および設計の整合性確認のみ。
