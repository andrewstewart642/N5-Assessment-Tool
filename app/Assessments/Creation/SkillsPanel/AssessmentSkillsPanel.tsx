import type {
  ComponentProps,
} from "react";

import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

import SkillsTree from "./02-SkillsTree/SkillsTree";

type SkillsTreeProps =
  ComponentProps<
    typeof SkillsTree
  >;

type AssessmentSkillsPanelProps = {
  theme: AppTheme;

  skillsTreeProps:
    Omit<
      SkillsTreeProps,
      "theme"
    >;
};

export default function AssessmentSkillsPanel({
  theme,
  skillsTreeProps,
}: AssessmentSkillsPanelProps) {
  return (
    <SkillsTree
      {...skillsTreeProps}
      theme={theme}
    />
  );
}