"use client";

import type { Theme } from "@/ui/AppTheme";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  theme: Theme;
};

export default function AppTraySection({
  title,
  subtitle,
  children,
  theme,
}: Props) {
  return (
    <section
      style={{
        border: `1px solid ${theme.borderStandard}`,
        borderRadius: 16,
        padding: 16,
        background: theme.bgElevated,
        boxShadow: theme.shadow,
      }}
    >
      <div style={{ marginBottom: subtitle ? 12 : 8 }}>
        <div
          style={{
            color: theme.textPrimary,
            fontSize: 16,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              marginTop: 4,
              color: theme.textMuted,
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {children}
    </section>
  );
}