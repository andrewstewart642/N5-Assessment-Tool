import type { ReactNode } from "react";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

type SetupCardProps = {
  title: string;
  children: ReactNode;
  theme: AppTheme;
};

export default function SetupCard({
  title,
  children,
  theme,
}: SetupCardProps) {
  return (
    <section
      style={{
        minWidth: 0,
        border: `1px solid ${theme.borderStandard}`,
        borderRadius: 22,
        background: theme.bgSurface,
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 14,
          color: theme.textPrimary,
        }}
      >
        {title}
      </div>

      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </section>
  );
}