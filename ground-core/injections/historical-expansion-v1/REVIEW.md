# LIVE-005B — Seven Document / Twelve Report Review

UNPUBLISHED. Final recorded_at = UNBOUND. Below timestamp 2000-01-01T00:00:00.000Z is DRY_RUN only; candidate hashes are not final published record hashes. Existing applyPatch will assign mutation updated_at at execution. Each group contains one Document and independently paired Observation/Evidence per report.

## frus:1904:395

Document ID: `a4046668-2a14-5190-aa6b-c43f25bfbb34`

Expected report set: `c395-captured`, `c395-sunk`, `c395-first-fire`

### Document identity — document

ID: `a4046668-2a14-5190-aa6b-c43f25bfbb34`

Dry candidate SHA-256: `a606b958756585e3d4537b19d87598aa57fea5b7a66c3a1ae5d89acd319cecc9`

```json
{
  "attrs": {
    "locator": {
      "document_number": "395",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:395",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d395"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "a4046668-2a14-5190-aa6b-c43f25bfbb34",
  "kind": "document",
  "label": "FRUS 1904, document 395",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c395-captured — textual

ID: `fa61cb21-cf36-5709-ac79-323d59c44e68`

Dry candidate SHA-256: `ac92d57c04a17454f1148dd2344c0bac662a70a3755940824c492e977499ab6f`

Selected input SHA-256: `fe6d0c34dcf8028664c7108c6dd51428a2e123f91e37f9a73d4f37543be21ab2`

```json
{
  "content": "Recorded researcher-authored paraphrase: Variag — reported as captured in the report attributed to the Japanese foreign minister and relayed by Griscom to Hay; upstream naval telegram not inspected.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "fa61cb21-cf36-5709-ac79-323d59c44e68",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c395-captured",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "a4046668-2a14-5190-aa6b-c43f25bfbb34"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c395-captured — observation_ref

ID: `58dd0021-9b1d-5571-aab6-db50cc811a18`

Dry candidate SHA-256: `9548b4980c1db0c91c21f706ad1b4586197017ec4fa4c0de6082c0b07a95b652`

Selected input SHA-256: `fe6d0c34dcf8028664c7108c6dd51428a2e123f91e37f9a73d4f37543be21ab2`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "58dd0021-9b1d-5571-aab6-db50cc811a18",
  "kind": "observation_ref",
  "observation_id": "fa61cb21-cf36-5709-ac79-323d59c44e68",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c395-captured",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c395-sunk — textual

ID: `ea4bfcb3-b0cf-5d95-a6ee-0bb9eaa7a5c6`

Dry candidate SHA-256: `0a4978c1e17ee57f62bb25cfcc9b41330948e5f2930ee0a4a2b55928dbcd5f0a`

Selected input SHA-256: `37cd0daec71a7e2f9da6542c9089bb8af94f6743e0fe10ab9321f3e6e45fddf2`

```json
{
  "content": "Recorded researcher-authored paraphrase: Korietz — reported as sunk in the same telegram report attributed to the Japanese foreign minister and relayed by Griscom to Hay.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "ea4bfcb3-b0cf-5d95-a6ee-0bb9eaa7a5c6",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c395-sunk",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "a4046668-2a14-5190-aa6b-c43f25bfbb34"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c395-sunk — observation_ref

ID: `462c0cfd-4b72-52d5-aecd-61030d0f474c`

Dry candidate SHA-256: `75f9330c0224cbcdd8410b594225e854ba08201b10ff80dba2466006dbee142f`

Selected input SHA-256: `37cd0daec71a7e2f9da6542c9089bb8af94f6743e0fe10ab9321f3e6e45fddf2`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "462c0cfd-4b72-52d5-aecd-61030d0f474c",
  "kind": "observation_ref",
  "observation_id": "ea4bfcb3-b0cf-5d95-a6ee-0bb9eaa7a5c6",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c395-sunk",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c395-first-fire — textual

ID: `f22f9834-5686-53e1-a4a5-a5ba914b6134`

Dry candidate SHA-256: `bcc0c640736854f56402b565ef11dc72f444f69a6b6675b468a6c8b7b1d6700a`

Selected input SHA-256: `8c02d18d1a3c4c79dd0557aa8e68dabc7e73fc7a392738358f6daab1558f327d`

```json
{
  "content": "Recorded researcher-authored paraphrase: Korietz — alleged to have opened fire on Japanese torpedo boats; the edition describes an upstream telegram allegation, with its author and event timing unverified.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "f22f9834-5686-53e1-a4a5-a5ba914b6134",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c395-first-fire",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "a4046668-2a14-5190-aa6b-c43f25bfbb34"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c395-first-fire — observation_ref

ID: `cfe6ae8f-5cd6-5954-a14a-29a950627db5`

Dry candidate SHA-256: `6e4010ee89a2ee09fc708aae975a12b31a9f7825fb22bf7462ee809bf15a4111`

Selected input SHA-256: `8c02d18d1a3c4c79dd0557aa8e68dabc7e73fc7a392738358f6daab1558f327d`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "cfe6ae8f-5cd6-5954-a14a-29a950627db5",
  "kind": "observation_ref",
  "observation_id": "f22f9834-5686-53e1-a4a5-a5ba914b6134",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c395-first-fire",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

## frus:1904:678

Document ID: `22e46a9a-c570-512a-ab6e-6e4ed43b7cce`

Expected report set: `c678-uncertainty`, `c678-sent`

### Document identity — document

ID: `22e46a9a-c570-512a-ab6e-6e4ed43b7cce`

Dry candidate SHA-256: `49ec23d72bf94b5e7004d3fb88157deb54bdecce94823c790ba8aa7012efa728`

```json
{
  "attrs": {
    "locator": {
      "document_number": "678",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:678",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d678"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "22e46a9a-c570-512a-ab6e-6e4ed43b7cce",
  "kind": "document",
  "label": "FRUS 1904, document 678",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c678-uncertainty — textual

ID: `aea84378-fce1-59f0-ad4c-a0efbc9bb155`

Dry candidate SHA-256: `524513935b52e6adba67cfb7825f1423f200b28e71e4cbb5ed9628f678ed3f7a`

Selected input SHA-256: `e9fe1509f763b67aadcf655d456ee4ef19fcbb231968dbb45b54cd89fc888d5a`

```json
{
  "content": "Recorded researcher-authored paraphrase: Japanese minister at St. Petersburg — reported as having no positive knowledge of the Russian reply, in the account relayed by McCormick to Hay; this does not mean complete ignorance.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "aea84378-fce1-59f0-ad4c-a0efbc9bb155",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c678-uncertainty",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "22e46a9a-c570-512a-ab6e-6e4ed43b7cce"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c678-uncertainty — observation_ref

ID: `5fd5ac26-f2c2-52b3-aeca-27fa8b974299`

Dry candidate SHA-256: `deca226c56b031d025da3da0e331f497cccc97bffa5319dc22c3f3b926da692a`

Selected input SHA-256: `e9fe1509f763b67aadcf655d456ee4ef19fcbb231968dbb45b54cd89fc888d5a`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "5fd5ac26-f2c2-52b3-aeca-27fa8b974299",
  "kind": "observation_ref",
  "observation_id": "aea84378-fce1-59f0-ad4c-a0efbc9bb155",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c678-uncertainty",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c678-sent — textual

ID: `8e93e555-ddfd-5f9f-a1e8-484044b80b03`

Dry candidate SHA-256: `9cf1bf30cb4b902eac1b92f4bfdcdeac6edbdae4e7e67f3194061804f2d45cdc`

Selected input SHA-256: `562c641e60a67649b01442494a7f536e4c254b591eb7ae4ca0bd8d86720099ac`

```json
{
  "content": "Recorded researcher-authored paraphrase: Russian reply — reported through the Russian foreign minister, Japanese minister at St. Petersburg, McCormick and Hay as sent to Admiral Alexieff with modification authority; proposed conditions were described as the foreign minister’s own view.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "8e93e555-ddfd-5f9f-a1e8-484044b80b03",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c678-sent",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "22e46a9a-c570-512a-ab6e-6e4ed43b7cce"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c678-sent — observation_ref

ID: `5f3d46a4-d52b-5019-a09d-270497de2009`

Dry candidate SHA-256: `13d64af355c6220f2cca377272efd8a41b181b65831bca42cfd145b815225310`

Selected input SHA-256: `562c641e60a67649b01442494a7f536e4c254b591eb7ae4ca0bd8d86720099ac`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "5f3d46a4-d52b-5019-a09d-270497de2009",
  "kind": "observation_ref",
  "observation_id": "8e93e555-ddfd-5f9f-a1e8-484044b80b03",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c678-sent",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

## frus:1904:679

Document ID: `bd50ef41-9888-5541-a7e2-8df8095093e6`

Expected report set: `c679-held`

### Document identity — document

ID: `bd50ef41-9888-5541-a7e2-8df8095093e6`

Dry candidate SHA-256: `f99678cc1539d3218d2f38e1324657ed8de39b3d31a390a92703d8fb50c6d656`

```json
{
  "attrs": {
    "locator": {
      "document_number": "679",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:679",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d679"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "bd50ef41-9888-5541-a7e2-8df8095093e6",
  "kind": "document",
  "label": "FRUS 1904, document 679",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c679-held — textual

ID: `55d67c8e-d628-5b6b-a8a7-fd0b949a2702`

Dry candidate SHA-256: `457793eaefb15bda4e2c36918d543c9a0b3635c554ed7a21c23f6141b3c9e1ca`

Selected input SHA-256: `81aba6037049bcaef92b43209c46ff205b7bcd0452476679a4f83708c309ca81`

```json
{
  "content": "Recorded researcher-authored paraphrase: Russian minister at Tokyo — reportedly possessed the Russian reply when the Japanese minister requested passports, according to the Russian foreign minister’s account relayed by McCormick to Hay; possession does not establish receipt by the Japanese government.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "55d67c8e-d628-5b6b-a8a7-fd0b949a2702",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c679-held",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "bd50ef41-9888-5541-a7e2-8df8095093e6"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c679-held — observation_ref

ID: `c23046f4-c34b-5b0c-a6be-c73203bad2a5`

Dry candidate SHA-256: `0b1d6bee9b651d3757abda1572556b77ac9ddfae5ab48fe0ffeba722ad84d472`

Selected input SHA-256: `81aba6037049bcaef92b43209c46ff205b7bcd0452476679a4f83708c309ca81`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "c23046f4-c34b-5b0c-a6be-c73203bad2a5",
  "kind": "observation_ref",
  "observation_id": "55d67c8e-d628-5b6b-a8a7-fd0b949a2702",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c679-held",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

## frus:1904:680

Document ID: `9f59765a-ede0-5ac8-a316-84d6119cc873`

Expected report set: `c680-attack`

### Document identity — document

ID: `9f59765a-ede0-5ac8-a316-84d6119cc873`

Dry candidate SHA-256: `0d846287cda748d2ebbf46659be30325cfbaa788c24efe016c5ff532847bca87`

```json
{
  "attrs": {
    "locator": {
      "document_number": "680",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:680",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d680"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "9f59765a-ede0-5ac8-a316-84d6119cc873",
  "kind": "document",
  "label": "FRUS 1904, document 680",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c680-attack — textual

ID: `e61acb30-be81-5b85-ab33-98f9cb141b43`

Dry candidate SHA-256: `003834f6e09529c0c213de700474dd382d8915027738326f650144dc97e420a2`

Selected input SHA-256: `a62e5d6964d89e49f3af20d7bcab2c043b6f49fca5ca95aa160ca288cd4b9854`

```json
{
  "content": "Recorded researcher-authored paraphrase: The translated Russian diplomatic telegram reports that Japanese torpedo boats attacked the Russian squadron at anchor; its wording gives “night 27th January [9th February]”. The stored report describes a February 9 telegram deposited February 10; no exact event instant is established.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "e61acb30-be81-5b85-ab33-98f9cb141b43",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c680-attack",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "9f59765a-ede0-5ac8-a316-84d6119cc873"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c680-attack — observation_ref

ID: `574ceb71-a21f-59f4-abf3-43602f375d7c`

Dry candidate SHA-256: `d2450e566e30527fb3e944bdc7d540de8fd0cdf6d0f5b5a42c3d93ab813fdc80`

Selected input SHA-256: `a62e5d6964d89e49f3af20d7bcab2c043b6f49fca5ca95aa160ca288cd4b9854`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "574ceb71-a21f-59f4-abf3-43602f375d7c",
  "kind": "observation_ref",
  "observation_id": "e61acb30-be81-5b85-ab33-98f9cb141b43",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c680-attack",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

## frus:1904:86

Document ID: `0c60e1dc-c8ce-5a88-a112-ffb8410231fe`

Expected report set: `c86-request`

### Document identity — document

ID: `0c60e1dc-c8ce-5a88-a112-ffb8410231fe`

Dry candidate SHA-256: `7b8281fce7f0552ff2ae5c9b8882f04aa845499b8a9cae26cb88644677f8a579`

```json
{
  "attrs": {
    "locator": {
      "document_number": "86",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:86",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d86"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "0c60e1dc-c8ce-5a88-a112-ffb8410231fe",
  "kind": "document",
  "label": "FRUS 1904, document 86",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c86-request — textual

ID: `3253dd31-256c-543c-a1f5-2566cbc17132`

Dry candidate SHA-256: `7a11deefa6d1a228886b49bf6341b281ff5ebdd5464b70bdc3272b8a7921366d`

Selected input SHA-256: `43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f`

```json
{
  "content": "Recorded researcher-authored paraphrase: Hay — instructs Conger to convey the US desire for Chinese neutrality and administrative entity to be respected; the instruction does not establish that neutrality was respected.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "3253dd31-256c-543c-a1f5-2566cbc17132",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c86-request",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "0c60e1dc-c8ce-5a88-a112-ffb8410231fe"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c86-request — observation_ref

ID: `302b3779-6975-56e4-aba0-0f2b16a078c8`

Dry candidate SHA-256: `84bcff31be2f18bb75f1208b5ebfd451c3bfd4891b8f2532c20c64341c4c8c85`

Selected input SHA-256: `43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "302b3779-6975-56e4-aba0-0f2b16a078c8",
  "kind": "observation_ref",
  "observation_id": "3253dd31-256c-543c-a1f5-2566cbc17132",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c86-request",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

## frus:1904:430

Document ID: `705575ca-1a28-5494-ac1f-f723157fcafb`

Expected report set: `c430-consent`, `c430-guarantee`, `c430-occupation`

### Document identity — document

ID: `705575ca-1a28-5494-ac1f-f723157fcafb`

Dry candidate SHA-256: `a21dd59ad94bad28e63c6be3c2dfd7a065bb0772f4ecf0061c647d239ba5392d`

```json
{
  "attrs": {
    "locator": {
      "document_number": "430",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:430",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d430"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "705575ca-1a28-5494-ac1f-f723157fcafb",
  "kind": "document",
  "label": "FRUS 1904, document 430",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c430-consent — textual

ID: `c37d7744-06ed-5495-af67-8a783904346e`

Dry candidate SHA-256: `a3a8af5704de39457e41e9733b441dcacfa119b77e2be2fa16a8177e3ae18c6d`

Selected input SHA-256: `e764b772c1c7e2be04810a9d412d1723d3c2a7c1d09d0e704fd4c0104e40a978`

```json
{
  "content": "Recorded researcher-authored paraphrase: Imperial Japanese Government — asserts that use of Korean ports and territory has full Korean knowledge and consent; this representation does not establish uncoerced Korean consent.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "c37d7744-06ed-5495-af67-8a783904346e",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c430-consent",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "705575ca-1a28-5494-ac1f-f723157fcafb"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c430-consent — observation_ref

ID: `180437f2-77d0-521d-ab99-1561f5268db2`

Dry candidate SHA-256: `ee6001bea34956eba154cc79c60e32185d65a0f5fd537e776ccdcc58994f7c7e`

Selected input SHA-256: `e764b772c1c7e2be04810a9d412d1723d3c2a7c1d09d0e704fd4c0104e40a978`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "180437f2-77d0-521d-ab99-1561f5268db2",
  "kind": "observation_ref",
  "observation_id": "c37d7744-06ed-5495-af67-8a783904346e",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c430-consent",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c430-guarantee — textual

ID: `ccd06bdb-d3bf-5c6d-af35-6e85bc0a336c`

Dry candidate SHA-256: `bf0c65b7a4291cd990e4c68e7832297cd97c6f4e9a6dc80eb82f0f5c8f41b3f1`

Selected input SHA-256: `556f7c0c38061e188bf93cefa20f9c42624fee94e143cf2379c8f488668a17e5`

```json
{
  "content": "Recorded researcher-authored paraphrase: Article III of the reproduced protocol text — guarantees independence and territorial integrity of the Korean Empire; the text does not establish actual sovereignty or control.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "ccd06bdb-d3bf-5c6d-af35-6e85bc0a336c",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c430-guarantee",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "705575ca-1a28-5494-ac1f-f723157fcafb"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c430-guarantee — observation_ref

ID: `d4e0cea6-6644-5ce3-a8d6-04c21d0331a9`

Dry candidate SHA-256: `30148d9bd38a3158f629c75186ccd2e24f7307532d138c8da5eb59e341c47c09`

Selected input SHA-256: `556f7c0c38061e188bf93cefa20f9c42624fee94e143cf2379c8f488668a17e5`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "d4e0cea6-6644-5ce3-a8d6-04c21d0331a9",
  "kind": "observation_ref",
  "observation_id": "ccd06bdb-d3bf-5c6d-af35-6e85bc0a336c",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c430-guarantee",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c430-occupation — textual

ID: `1184725c-02be-5106-aeb3-d7d2450f0fec`

Dry candidate SHA-256: `74f9f75b988153aa424abafbfb348347a788e084afe903bb98fc5f888db8b0b7`

Selected input SHA-256: `9d6d70f4f525190b0bc2f0dcbfc94e3df4c8d46e55fda6e6529b858b04802ca9`

```json
{
  "content": "Recorded researcher-authored paraphrase: Article IV of the reproduced protocol text — conditionally allows occupation of strategically necessary places for the stated object; conditional permission does not establish actual occupation.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "1184725c-02be-5106-aeb3-d7d2450f0fec",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c430-occupation",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "705575ca-1a28-5494-ac1f-f723157fcafb"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c430-occupation — observation_ref

ID: `05767896-15ce-50fb-a346-1f5fb7830010`

Dry candidate SHA-256: `405e881f6d77f620d96aad5006bd3b1e1617423528e85bb26cc4a52ddd785dfc`

Selected input SHA-256: `9d6d70f4f525190b0bc2f0dcbfc94e3df4c8d46e55fda6e6529b858b04802ca9`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "05767896-15ce-50fb-a346-1f5fb7830010",
  "kind": "observation_ref",
  "observation_id": "1184725c-02be-5106-aeb3-d7d2450f0fec",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c430-occupation",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

## frus:1904:815

Document ID: `aedfbb8b-0407-59cd-a131-5ce2cf319a1d`

Expected report set: `c815-inquiry`

### Document identity — document

ID: `aedfbb8b-0407-59cd-a131-5ce2cf319a1d`

Dry candidate SHA-256: `02de96fda203fa4fcdefef95a91d0a573ba26b178947c3e63dfb5d72abae7d18`

```json
{
  "attrs": {
    "locator": {
      "document_number": "815",
      "page": {
        "reason": "HTML page marker not inspected for this record",
        "status": "unknown"
      }
    },
    "source_id": "frus:1904:815",
    "url": "https://history.state.gov/historicaldocuments/frus1904/d815"
  },
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "aedfbb8b-0407-59cd-a131-5ce2cf319a1d",
  "kind": "document",
  "label": "FRUS 1904, document 815",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c815-inquiry — textual

ID: `0dcc23bb-eaae-572a-aa70-2c3e61a0149b`

Dry candidate SHA-256: `59b922f5ca356e6682bf56ffefb39f8ac1e6f11dce7a030a093f9b2048909494`

Selected input SHA-256: `f94ddafb33c99acb957789ba1cae4baab54ce4d5883e19282cf6834caeb6531f`

```json
{
  "content": "Recorded researcher-authored paraphrase: British embassy — reportedly demands an impartial inquiry at Vigo with bilateral representatives and a neutral umpire, and offers a Hull inquiry, in Eddy’s report to Hay; this does not establish commission findings.",
  "created_at": "2000-01-01T00:00:00.000Z",
  "id": "0dcc23bb-eaae-572a-aa70-2c3e61a0149b",
  "kind": "textual",
  "observed_at": null,
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c815-inquiry",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "subject_ids": [
    "aedfbb8b-0407-59cd-a131-5ce2cf319a1d"
  ],
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```

### c815-inquiry — observation_ref

ID: `291aef16-7eaa-53ea-a744-366001b9707c`

Dry candidate SHA-256: `5b9981bc0caecf4b2404038603937c740cde041c1b22a2ed7efd7d23a6690cbc`

Selected input SHA-256: `f94ddafb33c99acb957789ba1cae4baab54ce4d5883e19282cf6834caeb6531f`

```json
{
  "created_at": "2000-01-01T00:00:00.000Z",
  "external_ref": null,
  "id": "291aef16-7eaa-53ea-a744-366001b9707c",
  "kind": "observation_ref",
  "observation_id": "0dcc23bb-eaae-572a-aa70-2c3e61a0149b",
  "project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "provenance": {
    "external_id": "round1.dataset.json#claims/c815-inquiry",
    "kind": "document",
    "label": "Stored Historical Round1 inspection report; researcher-authored paraphrase"
  },
  "recorded_at": "2000-01-01T00:00:00.000Z",
  "summary": "Reference to the recorded document-inspection result.",
  "updated_at": "2000-01-01T00:00:00.000Z"
}
```
