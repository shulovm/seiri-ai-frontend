import type { StudioReport } from "./types.js";

export interface StudioNarrative {
  schema_version: "0.5.4";
  engine: string;
  generated_at: string;
  headline: string;
  /** Q1: 今何が起きているか */
  current_situation: string;
  /** Q2: なぜ今日それをやるべきか */
  today_focus_story: string;
  /** Q4 + 順序: どの順番で進めるか */
  flow_story: string;
  /** Q3: 何が流れを止めているか */
  blocker_story: string;
  /** Q5: どこが伸びているか */
  growth_story: string;
  /** Q6: どこに注意が必要か */
  risk_story: string;
  /** Q8: 何を判断材料として見るべきか */
  decision_story: string;
  /** Q7: 何を後回しにするか */
  deferred_story: string;
  /** Q8: 全体としてどんな状況か */
  summary_story: string;
  requires_human_decision: true;
}

export interface NarrativeBuilderInput {
  report: StudioReport;
}

export interface NarrativeBuilder {
  readonly name: string;
  build(input: NarrativeBuilderInput): StudioNarrative;
}
