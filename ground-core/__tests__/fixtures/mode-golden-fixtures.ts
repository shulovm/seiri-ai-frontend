import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createProjectFromExperimentSeed } from "../../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../../intake/validate-seed.js";
import { buildCompleteActionPatch } from "../../session/build-complete-action-patch.js";
import { applyPatch } from "../../state-engine.js";
import type { ProjectState } from "../../types.js";

const SEED_DIR = join(process.cwd(), "ground-core/examples/experiment-seeds");

/** Stable labels for golden assertions (titles from experiment seeds). */
export const MODE_GOLDEN = {
  business: {
    projectTitle: "無料配布型プロモーション検証 v0.1",
    primaryActionTitle: "配布する対象物と数量を決める",
    session01CompletedActionTitle: "検証場所の候補を3つ出す",
  },
  research: {
    projectTitle: "脳とAI接続領域の研究テーマ整理 v0.1",
    primaryActionTitle: "関連分野を5つに分類する",
  },
  product: {
    projectTitle: "思考整理ツールの最小利用体験検証 v0.1",
    primaryActionTitle: "想定ユーザーを1人に絞る",
    downstreamDeepWorkActionTitle: "1画面フローを文章で描く",
  },
} as const;

export type ModeGoldenPortfolio = {
  business: ProjectState;
  research: ProjectState;
  product: ProjectState;
};

function loadSeed(filename: string): ProjectState {
  const raw = JSON.parse(readFileSync(join(SEED_DIR, filename), "utf8"));
  return createProjectFromExperimentSeed(validateExperimentSeed(raw));
}

/**
 * business = session-01 complete (observation + decision on first action).
 * research / product = fresh intake with action_intents from seeds.
 */
export function loadModeGoldenPortfolio(): ModeGoldenPortfolio {
  let business = loadSeed("business-sample.json");
  const research = loadSeed("research-sample.json");
  const product = loadSeed("product-sample.json");

  const completedActionId = business.next_actions.find(
    (action) => action.title === MODE_GOLDEN.business.session01CompletedActionTitle
  )?.id;

  if (!completedActionId) {
    throw new Error("mode golden fixture: business missing session-01 action");
  }

  const { patch } = buildCompleteActionPatch(business, {
    action_id: completedActionId,
    decision_title: "初回検証場所の候補を3つに絞る",
    decision_rationale:
      "受取率・怪しさ・導線の違いを比較しやすく、100本規模の小規模テストに向いているため。",
    observation_title: "検証場所候補メモ",
    observation_body:
      "初回は人通りの多さだけでなく、配布行為が自然に見える場所を優先する。",
    summary: "検証場所候補を3つに絞った。次は配布する対象物と数量を決める。",
  });
  business = applyPatch(business, patch);

  const businessPrimary = business.next_actions.find(
    (action) => action.id === business.current_state.primary_next_action_id
  );
  if (businessPrimary?.title !== MODE_GOLDEN.business.primaryActionTitle) {
    throw new Error(
      `mode golden fixture: business primary expected "${MODE_GOLDEN.business.primaryActionTitle}", got "${businessPrimary?.title}"`
    );
  }

  return { business, research, product };
}

export function modeGoldenOrder(
  portfolio: ModeGoldenPortfolio,
  order: "business-first" | "research-first" = "business-first"
): ProjectState[] {
  const { business, research, product } = portfolio;
  return order === "research-first"
    ? [research, business, product]
    : [business, research, product];
}
