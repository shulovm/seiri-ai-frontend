# Historical Reality experimental — Russo-Japanese War Round 1

Source-led calibration, isolated from canonical schema and production storage.

Read [the Japanese Round 1 report](../../../docs/HISTORICAL_REALITY_RUSSO_JAPANESE_WAR_ROUND1.md) for inspected-source levels, semantic gaps, mapping limits and next-window comparison.

`round1.dataset.json` is a researcher-authored, provenance-bearing experimental sidecar. It contains short excerpts and attributed paraphrases, not original-document full snapshots. `round1.landscape.json` separates inspected sources from discovery leads and unresolved coverage.

```sh
node --import tsx ground-core/experimental/historical-reality/replay.ts /private/tmp/ground-rj-round1-replay
node --import tsx --test ground-core/__tests__/historical-reality-round1.test.ts
```

Replay uses the existing canonical schema, patch engine and file-store. The canonical projection asserts inspected source content only. Historical assertions, qualifications, actor epistemic records and reconstructions require the sidecar. Nothing auto-promotes into historical RealityEvent/RealityState. Source authenticity, translation accuracy and independence are not certified by structural validation.

Manifest hashes cover dataset and landscape notes, not remote originals. Verify locally:

```sh
python3 -c 'import hashlib,json,pathlib; r=pathlib.Path("ground-core/experimental/historical-reality"); m=json.loads((r/"manifest.json").read_text()); assert all(hashlib.sha256((r/p).read_bytes()).hexdigest()==h for p,h in m["sha256"].items()); print("manifest verified")'
```
