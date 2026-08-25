import type {
  ComponentProps,
} from "react";

import BuilderSettingsPanel from "@/app/create-assessment/builder/components/builder-controls/BuilderSettingsPanel";

type LegacyBuilderSettingsProps =
  ComponentProps<
    typeof BuilderSettingsPanel
  >;

type AssessmentSettingsProps =
  LegacyBuilderSettingsProps;

export default function AssessmentSettings(
  props: AssessmentSettingsProps
) {
  return (
    <BuilderSettingsPanel
      {...props}
    />
  );
}