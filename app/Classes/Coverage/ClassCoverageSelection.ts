export type ClassCoverageSelection =
  | {
      kind:
        "skill";

      skillId:
        string;
    }
  | {
      kind:
        "concept";

      skillId:
        string;

      conceptId:
        string;
    }
  | null;