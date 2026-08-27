import type {
  ComponentProps,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import SkillsTree from "./02-SkillsTree/SkillsTree";

type SkillsTreeProps =
  ComponentProps<
    typeof SkillsTree
  >;

type AssessmentSkillsPanelProps = {
  theme:
    AppTheme;

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
    <section
      style={{
        minWidth:
          0,

        minHeight:
          0,

        height:
          "100%",

        display:
          "grid",

        gridTemplateRows:
          "minmax(0, 1fr)",

        overflow:
          "hidden",

        background:
          theme.bgPage,

        padding:
          "4px 0 4px 4px",

        boxSizing:
          "border-box",
      }}
    >
      <SkillsTree
        {...skillsTreeProps}
        theme={
          theme
        }
      />
    </section>
  );
}