import type {
  ComponentProps,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import type {
  AssessmentMetricsSnapshot,
} from "../Metrics";

import {
  MetricsPanel,
} from "../Metrics";

import SkillsTree from "./02-SkillsTree/SkillsTree";

type SkillsTreeProps =
  ComponentProps<
    typeof SkillsTree
  >;

type AssessmentSkillsPanelProps = {
  theme:
    AppTheme;

  metrics?:
    AssessmentMetricsSnapshot | null;

  skillsTreeProps:
    Omit<
      SkillsTreeProps,
      "theme" |
      "attachedFooter"
    >;
};

export default function AssessmentSkillsPanel({
  theme,
  metrics,
  skillsTreeProps,
}: AssessmentSkillsPanelProps) {
  const hasMetrics =
    Boolean(metrics);

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
          hasMetrics
            ? "minmax(0, 1fr) auto"
            : "minmax(0, 1fr)",

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
        attachedFooter={
          hasMetrics
        }
        theme={
          theme
        }
      />

      {metrics ? (
        <MetricsPanel
          metrics={metrics}
          theme={theme}
        />
      ) : null}
    </section>
  );
}
