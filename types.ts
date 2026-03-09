// types.ts

export type SkillId = string;

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type GeneratorKey =
  | "int_multiply"
  | "pythagoras_hypotenuse";

export type Skill = {
  id: SkillId;
  title: string;
  generatorKey: GeneratorKey;
  params?: Record<string, unknown>;
};

export type Concept = {
  id: string;
  title: string;
  skills: Skill[];
};

export type Category = {
  id: string;
  title: string;
  concepts: Concept[];
};

export type GeneratedQuestion = {
  prompt: string;
  answer: number | string;
  working?: string; // optional explanation for later feedback
};