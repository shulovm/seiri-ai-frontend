# Clean-worktree legacy test preparation

Some older CLI/Studio tests read three local project files from ignored
`ground-core/storage/projects`. The checkpoint does not contain these files.
They are test inputs, not canonical runtime authorities.

In a fresh test worktree, after `npm ci`, run:

```sh
npx tsx ground-core/__tests__/prepare-legacy-fixtures.ts
npm run test:ground-core
npx tsc --noEmit -p ground-core/tsconfig.json
npm run build
```

Preparation reconstructs Momotaro and GROUND Core from committed manual patches,
and copies the committed historical FreeWater fixture without changing its schema.
The old action payloads receive the existing nullable dependency default.
It refuses to overwrite any of the three project paths. Never use another
worktree's live project files to supply test inputs; never commit generated storage.
The fallback in reality-semantics tests rebinds all owned entity project IDs.
No production semantic behavior or test assertions are changed.
