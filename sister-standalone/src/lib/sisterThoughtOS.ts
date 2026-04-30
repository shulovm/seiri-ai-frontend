/**
 * SISTER
 * Structured InSighT Engine for Reasoning
 *
 * 妹専用：福岡県公立高校入試向け 思考デバッグOS
 *
 * Core Philosophy:
 * - 答えを出すAIではなく、思考を整えるAI
 * - 苦手原因をAtomic Errorまで分解する
 * - 福岡県公立入試で点になる形へ変換する
 * - 自力思考を守るため、finalAnswerは通常出力しない
 */

export type Subject = "math" | "english" | "science" | "social" | "japanese";

export type LogicLevel =
  | "BLANK"
  | "FRAGMENTS"
  | "LOGICAL_LEAP"
  | "PROCEDURE_ERROR"
  | "CARELESS"
  | "VERIFIED";

export type HintLevel = 1 | 2 | 3;

export interface ConceptNode {
  id: string;
  name: string;
  grade: "M1" | "M2" | "M3" | "S1" | "S2" | "S3" | "E1" | "E2" | "E3" | "J1" | "J2" | "J3" | "SS1" | "SS2" | "SS3";
  subject: Subject;
  dependencies: string[];
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  fukuokaExamUse: string;
  commonMistakes: string[];
  scoreStrategy: string;
}

export interface ProblemContext {
  subject: Subject;
  topicId: string;
  questionText: string;

  /**
   * 正解に至るべき論理ステップ。
   * 生徒にはそのまま出さない。
   */
  correctLogicPath: string[];

  /**
   * システム内部のみ保持。
   * 通常レスポンスでは絶対に出さない。
   */
  finalAnswer: string;

  /**
   * 任意。大問1、小問集合、関数、証明など。
   */
  problemType?: string;

  /**
   * 任意。過去問、類題、学校ワークなど。
   */
  source?: string;
}

export interface AnalysisResult {
  detectedLevel: LogicLevel;
  missingConceptId: string | null;
  logicBugPoint: string | null;
  thoughtProcess: string;
  confidence: number;
  suspectedCause:
    | "PREREQUISITE_MISSING"
    | "FORMULA_UNKNOWN"
    | "READING_ERROR"
    | "LOGIC_JUMP"
    | "PROCEDURE_MISTAKE"
    | "CALCULATION_MISTAKE"
    | "TIME_PRESSURE"
    | "UNKNOWN";
  hiddenWeaknessPatterns: string[];
  recurringRootCause: string | null;
  confidenceScore: number;
  suggestedMicroTraining: string[];
}

export interface WeaknessLogCandidate {
  subject: Subject;
  topicId: string;
  topicName: string;
  missingConceptId: string | null;
  detectedLevel: LogicLevel;
  suspectedCause: AnalysisResult["suspectedCause"];
  priority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewAction: string;
}

export interface SisterResponse {
  safeMessage: string;
  diagnosis: {
    level: LogicLevel;
    plainJapanese: string;
    suspectedCause: AnalysisResult["suspectedCause"];
  };
  probeQuestion: string;
  hintLevel: HintLevel;
  shouldRevealAnswer: boolean;
  weaknessLogCandidate: WeaknessLogCandidate;
  internalDebug?: AnalysisResult;
}

/**
 * 最初は内蔵でOK。
 * 後でJSONファイル / Supabase / Firestoreへ移せる構造にする。
 */
export const KNOWLEDGE_MAP: Record<Subject, Record<string, ConceptNode>> = {
  math: {
    "M1-algebra": {
      id: "M1-algebra",
      name: "文字式",
      grade: "M1",
      subject: "math",
      dependencies: [],
      entrancePriority: "HIGH",
      fukuokaExamUse: "方程式・関数・証明の前提になる",
      commonMistakes: [
        "文字を数として扱えない",
        "項と係数の区別が曖昧",
        "式の意味を日本語で説明できない"
      ],
      scoreStrategy: "数学の全分野の土台。ここが弱い場合は先に潰す。"
    },

    "M2-equation": {
      id: "M2-equation",
      name: "一次方程式・連立方程式",
      grade: "M2",
      subject: "math",
      dependencies: ["M1-algebra"],
      entrancePriority: "HIGH",
      fukuokaExamUse: "文章題・関数・図形の計算で使う",
      commonMistakes: [
        "移項の符号ミス",
        "文章から式を作れない",
        "答えが問題条件に合うか確認しない"
      ],
      scoreStrategy: "小問集合と文章題で落とさないための必須単元。"
    },

    "M1-parallel_lines": {
      id: "M1-parallel_lines",
      name: "平行線と角",
      grade: "M1",
      subject: "math",
      dependencies: [],
      entrancePriority: "HIGH",
      fukuokaExamUse: "図形証明・相似・角度問題の根拠になる",
      commonMistakes: [
        "錯角・同位角・対頂角の区別が曖昧",
        "なぜ等しいかを言葉で説明できない",
        "図の見た目だけで判断する"
      ],
      scoreStrategy: "証明問題の根拠として頻出。言語化できるまで確認する。"
    },

    "M2-congruence": {
      id: "M2-congruence",
      name: "合同",
      grade: "M2",
      subject: "math",
      dependencies: ["M1-parallel_lines"],
      entrancePriority: "MIDDLE",
      fukuokaExamUse: "図形証明の型を理解する前提",
      commonMistakes: [
        "合同条件を覚えていない",
        "対応する辺・角を取り違える",
        "証明の順番が崩れる"
      ],
      scoreStrategy: "相似証明の前段階。証明の型を作る。"
    },

    "linear_function": {
      id: "M3-1",
      name: "一次関数",
      grade: "M3",
      subject: "math",
      dependencies: ["M1-algebra", "M2-equation"],
      entrancePriority: "HIGH",
      fukuokaExamUse: "関数問題・グラフ読み取り・変化の割合で得点源になる",
      commonMistakes: [
        "傾きと切片を混同する",
        "グラフから式を作れない",
        "変化の割合の意味が曖昧",
        "xとyの対応表を使わない"
      ],
      scoreStrategy: "難問に入る前に、式・表・グラフの変換を確実にする。"
    },

    "similarity": {
      id: "M3-2",
      name: "図形の相似",
      grade: "M3",
      subject: "math",
      dependencies: ["M2-congruence", "M1-parallel_lines"],
      entrancePriority: "HIGH",
      fukuokaExamUse: "図形証明・相似比・線分比・面積比で点差がつく",
      commonMistakes: [
        "相似条件を言えない",
        "角が等しい根拠を言えない",
        "対応順を間違える",
        "相似比と面積比を混同する"
      ],
      scoreStrategy: "満点狙いより、証明の前半と比の基本計算を確実に取る。"
    }
  },

  science: {
    "S1-atomic_structure": {
      id: "S1-atomic_structure",
      name: "原子・分子",
      grade: "S1",
      subject: "science",
      dependencies: [],
      entrancePriority: "HIGH",
      fukuokaExamUse: "化学変化・イオン・水溶液の土台",
      commonMistakes: [
        "原子と分子の違いが曖昧",
        "元素記号を覚えていない",
        "化学式の意味が分からない"
      ],
      scoreStrategy: "化学分野の基礎。暗記だけでなく式の意味を確認する。"
    },

    "S2-chemical_formula": {
      id: "S2-chemical_formula",
      name: "化学式・化学反応式",
      grade: "S2",
      subject: "science",
      dependencies: ["S1-atomic_structure"],
      entrancePriority: "HIGH",
      fukuokaExamUse: "化学変化・イオン・実験考察で必要",
      commonMistakes: [
        "係数と小さい数字の意味を混同する",
        "反応前後で原子数をそろえられない",
        "反応式を丸暗記して意味を理解していない"
      ],
      scoreStrategy: "反応式の意味を図解レベルで理解させる。"
    },

    "ion": {
      id: "S3-1",
      name: "イオンと水溶液",
      grade: "S3",
      subject: "science",
      dependencies: ["S1-atomic_structure", "S2-chemical_formula"],
      entrancePriority: "HIGH",
      fukuokaExamUse: "電池・電気分解・中和・水溶液問題で頻出",
      commonMistakes: [
        "陽イオン・陰イオンの区別が曖昧",
        "電子の移動と電流の向きを混同する",
        "中和と塩の関係が分からない",
        "実験結果から理由を説明できない"
      ],
      scoreStrategy: "暗記で終わらせず、粒子モデルと実験結果をつなげる。"
    }
  },

  english: {},
  social: {},
  japanese: {}
};

export class SisterThoughtOS {
  private readonly knowledgeGraph: Record<Subject, Record<string, ConceptNode>>;
  private readonly recentRootCauseHistory: Array<{
    subject: Subject;
    rootCause: string;
    ts: number;
  }> = [];

  constructor(knowledgeMap = KNOWLEDGE_MAP) {
    this.knowledgeGraph = knowledgeMap;
  }

  /**
   * UI側から呼ぶメイン関数。
   * LLM API接続前でも動くように、まずはルールベースで仮実装。
   * 後で analyzeStudentLogic の中身をOpenAI/Claude APIへ差し替える。
   */
  async process(
    studentInput: string,
    context: ProblemContext,
    hintLevel: HintLevel = 1
  ): Promise<SisterResponse> {
    const analysis = await this.analyzeStudentLogic(studentInput, context);
    const concept = this.getConcept(context.subject, context.topicId);

    return {
      safeMessage: this.generateSafeMessage(analysis),
      diagnosis: {
        level: analysis.detectedLevel,
        plainJapanese: this.levelToJapanese(analysis),
        suspectedCause: analysis.suspectedCause
      },
      probeQuestion: this.generateSurgicalProbe(analysis, context, hintLevel),
      hintLevel,
      shouldRevealAnswer: false,
      weaknessLogCandidate: {
        subject: context.subject,
        topicId: context.topicId,
        topicName: concept?.name ?? context.topicId,
        missingConceptId: analysis.missingConceptId,
        detectedLevel: analysis.detectedLevel,
        suspectedCause: analysis.suspectedCause,
        priority: this.determinePriority(analysis, concept),
        nextReviewAction: this.generateNextReviewAction(analysis, concept)
      },
      internalDebug: analysis
    };
  }

  /**
   * 答えを出していい例外処理。
   * 条件：
   * - 生徒が十分に考えた
   * - ヒント3まで到達
   * - それでも分からない
   *
   * ただし、答えだけではなく「なぜそうなるか」を出す。
   */
  async revealWithExplanation(
    studentInput: string,
    context: ProblemContext
  ): Promise<SisterResponse & { finalExplanation: string }> {
    const base = await this.process(studentInput, context, 3);

    return {
      ...base,
      shouldRevealAnswer: true,
      finalExplanation: [
        "ここまで考えたなら、答えまで確認しよう。",
        "ただし、丸暗記じゃなくて流れで覚えるよ。",
        "",
        `答え：${context.finalAnswer}`,
        "",
        "考え方：",
        context.correctLogicPath.map((step, index) => `${index + 1}. ${step}`).join("\n"),
        "",
        "次に同じタイプが出たら、まず最初の1ステップだけ思い出せばいい。"
      ].join("\n")
    };
  }

  private async analyzeStudentLogic(
    input: string,
    context: ProblemContext
  ): Promise<AnalysisResult> {
    const normalized = input.trim();
    const concept = this.getConcept(context.subject, context.topicId);
    const hiddenWeaknessPatterns = this.inferHiddenWeaknessPatterns(normalized, context);
    const recurringRootCause = this.detectRecurringRootCause(context.subject, hiddenWeaknessPatterns);
    const suggestedMicroTraining = this.buildSuggestedMicroTraining(context, hiddenWeaknessPatterns);

    /**
     * LLM接続時の理想プロンプト。
     * 今はコメントとして保持。
     *
     * System:
     * You are a Logic Debugger for a 14-year-old Japanese student preparing for the Fukuoka public high school entrance exam.
     * Never reveal the final answer.
     * Identify the smallest missing concept or broken logical step.
     *
     * Context:
     * Subject: ${context.subject}
     * Topic: ${concept?.name}
     * Question: ${context.questionText}
     * Student Input: ${input}
     * Reference Logic Path: ${context.correctLogicPath.join(" -> ")}
     *
     * Task:
     * 1. Classify student state.
     * 2. Detect atomic error.
     * 3. Choose the minimum useful hint.
     * 4. Do not solve the problem.
     */

    if (normalized.length === 0 || ["わからん", "わからない", "無理", "全部わからん", "全然わかんない"].includes(normalized)) {
      return {
        detectedLevel: "BLANK",
        missingConceptId: concept?.dependencies[0] ?? context.topicId,
        logicBugPoint: "問題に入る前の前提知識で止まっている",
        thoughtProcess: "Student cannot start. Need to check prerequisite concept first.",
        confidence: 0.82,
        suspectedCause: "PREREQUISITE_MISSING",
        hiddenWeaknessPatterns,
        recurringRootCause,
        confidenceScore: 0.82,
        suggestedMicroTraining
      };
    }

    if (this.looksCareless(normalized)) {
      return {
        detectedLevel: "CARELESS",
        missingConceptId: null,
        logicBugPoint: "考え方よりも計算・写し間違いの可能性",
        thoughtProcess: "Student may understand the logic but made a surface-level mistake.",
        confidence: 0.72,
        suspectedCause: "CALCULATION_MISTAKE",
        hiddenWeaknessPatterns,
        recurringRootCause,
        confidenceScore: 0.72,
        suggestedMicroTraining
      };
    }

    if (this.looksProcedureError(normalized)) {
      return {
        detectedLevel: "PROCEDURE_ERROR",
        missingConceptId: context.topicId,
        logicBugPoint: "手順の選択または順序で止まりやすい",
        thoughtProcess: "Student has core knowledge but sequence control is unstable.",
        confidence: 0.7,
        suspectedCause: "PROCEDURE_MISTAKE",
        hiddenWeaknessPatterns,
        recurringRootCause,
        confidenceScore: 0.7,
        suggestedMicroTraining
      };
    }

    if (this.hasLogicJump(normalized, context.correctLogicPath)) {
      return {
        detectedLevel: "LOGICAL_LEAP",
        missingConceptId: context.topicId,
        logicBugPoint: "根拠を言わずに結論へ飛んでいる",
        thoughtProcess: "Student skipped a required reason in the logic path.",
        confidence: 0.78,
        suspectedCause: "LOGIC_JUMP",
        hiddenWeaknessPatterns,
        recurringRootCause,
        confidenceScore: 0.78,
        suggestedMicroTraining
      };
    }

    if (normalized.length < 20) {
      return {
        detectedLevel: "FRAGMENTS",
        missingConceptId: context.topicId,
        logicBugPoint: "部分的な知識はあるが、流れとしてつながっていない",
        thoughtProcess: "Student has fragments but cannot chain them.",
        confidence: 0.67,
        suspectedCause: "UNKNOWN",
        hiddenWeaknessPatterns,
        recurringRootCause,
        confidenceScore: 0.67,
        suggestedMicroTraining
      };
    }

    return {
      detectedLevel: "VERIFIED",
      missingConceptId: null,
      logicBugPoint: null,
      thoughtProcess: "Student response appears logically connected.",
      confidence: 0.7,
      suspectedCause: "UNKNOWN",
      hiddenWeaknessPatterns,
      recurringRootCause,
      confidenceScore: 0.7,
      suggestedMicroTraining
    };
  }

  private generateSafeMessage(analysis: AnalysisResult): string {
    if (analysis.recurringRootCause) {
      return `最近のミスを見ると、「${analysis.recurringRootCause}」で止まりやすいかもしれない。今日はそこだけ確認しよう。`;
    }

    switch (analysis.detectedLevel) {
      case "BLANK":
        return "大丈夫。これは才能じゃなくて、最初の一歩が見えてないだけ。";
      case "FRAGMENTS":
        return "いいよ。少し材料は出てるから、あとは順番につなげよう。";
      case "LOGICAL_LEAP":
        return "考え方の方向は悪くない。ただ、途中の根拠が一つ抜けてる。";
      case "PROCEDURE_ERROR":
        return "方向は合ってる。順番を整えるだけで安定しそう。";
      case "CARELESS":
        return "これは理解不足というより、最後の確認で取れる点かもしれない。";
      case "VERIFIED":
        return "今の説明はかなり良い。次は本番で同じように再現できるか見よう。";
      default:
        return "一緒に一つずつ整理しよう。";
    }
  }

  private generateSurgicalProbe(
    analysis: AnalysisResult,
    context: ProblemContext,
    hintLevel: HintLevel
  ): string {
    const concept = this.getConcept(context.subject, context.topicId);

    if (analysis.detectedLevel === "BLANK") {
      const prerequisiteId = analysis.missingConceptId ?? concept?.dependencies[0];
      const prerequisite = prerequisiteId
        ? this.findConceptById(prerequisiteId)
        : null;

      return [
        `この問題に入る前に、まず「${prerequisite?.name ?? "前提のルール"}」を確認しよう。`,
        this.subjectSpecificFirstQuestion(context.subject, context.topicId)
      ].join("\n");
    }

    if (analysis.detectedLevel === "FRAGMENTS") {
      return [
        "今、材料は少し出てる。",
        "次はそれを順番に並べたい。",
        `この問題で最初に使うべき条件は、問題文のどこに書いてある？`
      ].join("\n");
    }

    if (analysis.detectedLevel === "LOGICAL_LEAP") {
      if (hintLevel === 1) {
        return "今の考えの中で、結論に行く前に『なぜそう言えるか』を1つだけ足すなら、どんな根拠が必要？";
      }

      if (hintLevel === 2) {
        return this.subjectSpecificSecondHint(context.subject, context.topicId);
      }

      return "式・図・問題文の条件のうち、今の結論を支えているものを1つ選んで説明してみて。";
    }

    if (analysis.detectedLevel === "CARELESS") {
      return "考え方は合ってる可能性が高い。最後に、符号・単位・対応する場所を1つずつ確認してみて。どこが怪しい？";
    }

    if (analysis.detectedLevel === "VERIFIED") {
      return "よし。じゃあ本番用に短く言うなら、この問題の最初の一手は何だった？";
    }

    return "次の一手だけ考えよう。この問題で最初に見るべき情報はどこ？";
  }

  private subjectSpecificFirstQuestion(subject: Subject, topicId: string): string {
    if (subject === "math" && topicId === "similarity") {
      return "この図の中で、等しいと言えそうな角はどれ？その理由も一言で言える？";
    }

    if (subject === "math" && topicId === "linear_function") {
      return "まず、問題文の中で x と y にあたるものは何？";
    }

    if (subject === "science" && topicId === "ion") {
      return "まず、陽イオンと陰イオンのどちらが電子を失ったものか覚えてる？";
    }

    return "この問題で最初に見るべき条件はどこかな？";
  }

  private subjectSpecificSecondHint(subject: Subject, topicId: string): string {
    if (subject === "math" && topicId === "similarity") {
      return "相似を言うには、対応する角が2組等しいことを示せると強い。今、1組目の角の根拠は何？";
    }

    if (subject === "math" && topicId === "linear_function") {
      return "一次関数は、表・式・グラフのどれか2つが分かると進めやすい。今分かっているのはどれ？";
    }

    if (subject === "science" && topicId === "ion") {
      return "イオンの問題は『電子が増えたか減ったか』を見ると整理しやすい。今回はどちらが起きてる？";
    }

    return "問題文の条件と、使いたい知識を1つずつ分けてみよう。";
  }

  private levelToJapanese(analysis: AnalysisResult): string {
    switch (analysis.detectedLevel) {
      case "BLANK":
        return "まだ問題に入る前の前提知識で止まっている状態";
      case "FRAGMENTS":
        return "部分的には分かっているけど、順番につながっていない状態";
      case "LOGICAL_LEAP":
        return "結論に飛んでいて、途中の根拠が抜けている状態";
      case "PROCEDURE_ERROR":
        return "知識はあるけど、解く手順がズレている状態";
      case "CARELESS":
        return "理解よりも確認不足・計算ミスで落としている可能性がある状態";
      case "VERIFIED":
        return "考え方はつながっている状態";
      default:
        return "確認が必要な状態";
    }
  }

  private determinePriority(
    analysis: AnalysisResult,
    concept?: ConceptNode
  ): "HIGH" | "MIDDLE" | "LOW" {
    if (analysis.detectedLevel === "BLANK") return "HIGH";
    if (analysis.detectedLevel === "LOGICAL_LEAP") return "HIGH";
    if (analysis.detectedLevel === "PROCEDURE_ERROR") return "HIGH";
    if (concept?.entrancePriority === "HIGH") return "HIGH";
    if (analysis.detectedLevel === "CARELESS") return "MIDDLE";
    return "MIDDLE";
  }

  private generateNextReviewAction(
    analysis: AnalysisResult,
    concept?: ConceptNode
  ): string {
    const topicName = concept?.name ?? "この単元";

    switch (analysis.detectedLevel) {
      case "BLANK":
        return `${topicName}に入る前の前提単元を5分だけ確認する`;
      case "FRAGMENTS":
        return `${topicName}の基本例題を1問、手順を声に出して解く`;
      case "LOGICAL_LEAP":
        return `${topicName}で「なぜそう言えるか」を書く練習を1問する`;
      case "PROCEDURE_ERROR":
        return `${topicName}の解法を3ステップに分け、1問で順番どおり再現する`;
      case "CARELESS":
        return `${topicName}の類題を1問解き、最後に符号・単位・条件を確認する`;
      case "VERIFIED":
        return `${topicName}の入試形式問題を時間を測って1問解く`;
      default:
        return `${topicName}の基本確認をする`;
    }
  }

  private getConcept(subject: Subject, topicId: string): ConceptNode | undefined {
    return this.knowledgeGraph[subject]?.[topicId];
  }

  private findConceptById(id: string): ConceptNode | null {
    for (const subject of Object.keys(this.knowledgeGraph) as Subject[]) {
      for (const concept of Object.values(this.knowledgeGraph[subject])) {
        if (concept.id === id || concept.id === concept.id || concept.id === id) {
          return concept;
        }
      }

      if (this.knowledgeGraph[subject][id]) {
        return this.knowledgeGraph[subject][id];
      }
    }

    return null;
  }

  private looksCareless(input: string): boolean {
    const carelessSignals = [
      "計算ミス",
      "符号",
      "写し間違い",
      "単位",
      "最後",
      "たぶん合ってる",
      "凡ミス"
    ];

    return carelessSignals.some((signal) => input.includes(signal));
  }

  private looksProcedureError(input: string): boolean {
    const procedureSignals = [
      "手順",
      "順番",
      "途中で",
      "どこから",
      "解き方",
      "やり方",
      "式変形"
    ];

    return procedureSignals.some((signal) => input.includes(signal));
  }

  private hasLogicJump(input: string, logicPath: string[]): boolean {
    if (logicPath.length <= 1) return false;

    const conclusionSignals = [
      "だから",
      "つまり",
      "よって",
      "なので",
      "答えは",
      "相似",
      "等しい"
    ];

    const hasConclusion = conclusionSignals.some((signal) => input.includes(signal));
    const isShort = input.length < 60;

    return hasConclusion && isShort;
  }

  private inferHiddenWeaknessPatterns(input: string, context: ProblemContext): string[] {
    const patterns: string[] = [];
    const source = `${context.questionText} ${input}`;

    if (context.subject === "math") {
      if (/一次関数|グラフ|変化の割合|傾き|x|y/.test(source)) {
        patterns.push("変化量を比で捉えるところで止まりやすい");
      }
      if (/比例|反比例|速さ|比|割合/.test(source)) {
        patterns.push("比例感覚が不安定で数量関係の変換が崩れやすい");
      }
      if (/文章題|式|条件/.test(source)) {
        patterns.push("文章を式へ変換する工程で負荷が高い");
      }
    }

    if (context.subject === "science") {
      if (/イオン|電子|電池|中和|水溶液/.test(source)) {
        patterns.push("粒子視点より用語暗記が先に立ちやすい");
      }
      if (/実験|結果|考察|理由/.test(source)) {
        patterns.push("実験結果から因果を言語化する工程で止まりやすい");
      }
    }

    if (context.subject === "english") {
      patterns.push("設問先読みと主語動詞の抽出が弱い可能性");
    }

    if (/焦|急いだ|時間|間に合わ/.test(input)) {
      patterns.push("時間圧で手順を飛ばす傾向");
    }

    if (/なんとなく|たぶん|勘/.test(input)) {
      patterns.push("根拠より感覚で進める傾向");
    }

    if (patterns.length === 0) {
      patterns.push("前提知識と解法手順の接続が不安定");
    }

    return patterns.slice(0, 4);
  }

  private detectRecurringRootCause(subject: Subject, patterns: string[]): string | null {
    const candidate = patterns[0];
    if (!candidate) return null;

    const now = Date.now();
    this.recentRootCauseHistory.push({ subject, rootCause: candidate, ts: now });

    const alive = this.recentRootCauseHistory.filter((item) => now - item.ts < 1000 * 60 * 60 * 24 * 14);
    this.recentRootCauseHistory.length = 0;
    this.recentRootCauseHistory.push(...alive);

    const repeated = alive.filter((item) => item.subject === subject && item.rootCause === candidate).length;
    return repeated >= 2 ? candidate : null;
  }

  private buildSuggestedMicroTraining(context: ProblemContext, patterns: string[]): string[] {
    if (context.subject === "math") {
      if (patterns.some((pattern) => pattern.includes("比例感覚"))) {
        return [
          "比例・反比例・一次関数を30秒で分類するミニ問題を3問",
          "xが1増えた時のyの増加量を口で説明する練習を2回"
        ];
      }

      return [
        "問題文の数量をxとyに対応づけるメモを1回作る",
        "式・表・グラフの変換を1セットだけ解く"
      ];
    }

    if (context.subject === "science") {
      return [
        "電子が増えたか減ったかを粒子図で1問だけ確認",
        "実験結果から理由を1文で言語化する練習を2回"
      ];
    }

    if (context.subject === "english") {
      return [
        "設問を先に読んで本文で根拠文を1つ探す練習を1題",
        "主語と動詞に下線を引きながら1段落だけ読む"
      ];
    }

    return ["前提知識を5分確認", "同タイプの基本問題を1問だけ解き直す"];
  }
}

// 実行例
const sisterOS = new SisterThoughtOS();

const currentProblem: ProblemContext = {
  subject: "math",
  topicId: "similarity",
  questionText: "三角形ABCにおいて、DE // BC のとき、相似を利用して線分の長さを求める問題。",
  correctLogicPath: [
    "平行線の錯角または同位角を特定する",
    "2組の角が等しいことを示す",
    "三角形の相似を言う",
    "対応する辺を確認する",
    "相似比から線分の長さを計算する"
  ],
  finalAnswer: "4cm",
  problemType: "図形の相似",
  source: "福岡県公立入試対策"
};

// sisterOS.process("全然わかんない", currentProblem).then(console.log);
