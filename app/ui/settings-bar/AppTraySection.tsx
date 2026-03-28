"use client";

import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  theme: AppTheme;
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
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        background: theme.panelBg2,
        boxShadow: "0 10px 30px rgba(0,0,0,0.12) inset",
      }}
    >
      <div style={{ marginBottom: subtitle ? 14 : 10 }}>
        <div
          style={{
            color: theme.text,
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
              marginTop: 6,
              color: theme.subtleText,
              fontSize: 14,
              lineHeight: 1.45,
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