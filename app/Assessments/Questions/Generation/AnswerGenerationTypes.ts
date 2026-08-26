import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

export type WorkedAnswerLine = {
  id: string;

  parts: PaperPart[];

  /**
   * Marks demonstrated by this line.
   * Useful later for the marking-scheme system,
   * but harmless for the builder now.
   */
  markNumbers?: number[];
};

export type WorkedAnswerMethod = {
  /**
   * Stable mathematical method identity.
   *
   * Examples:
   * REVERSE_PERCENT_UNITARY
   * REVERSE_PERCENT_INVERSE_MULTIPLIER
   */
  methodFamilyId: string;

  /**
   * The chosen presentation variant within
   * the larger method family.
   *
   * Examples:
   * VIA_1_PERCENT
   * VIA_10_PERCENT
   */
  methodVariantId?: string;

  /**
   * Pupil-style working shown in Answers view.
   */
  lines: WorkedAnswerLine[];

  /**
   * Evidence score used to choose which method
   * is shown by default.
   */
  evidenceScore: number;

  /**
   * Historical MS records supporting this method.
   */
  sourceEvidenceIds: string[];
};

export type WorkedAnswerSet = {
  /**
   * Method shown by default.
   */
  defaultMethodFamilyId: string;

  /**
   * Major valid methods available to the teacher.
   *
   * The Method ↻ button cycles this array.
   */
  methods: WorkedAnswerMethod[];
};