import Link from "next/link";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";


type Props = {
  title:
    string;

  subtitle?:
    string;

  actionLabel?:
    string;

  actionHref?:
    string;

  theme:
    AppTheme;
};


export default function HomeSectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  theme,
}: Props) {
  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "flex",

        alignItems:
          "flex-start",

        justifyContent:
          "space-between",

        gap:
          12,
      }}
    >
      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            2,
        }}
      >
        <div
          style={{
            color:
              theme.textPrimary,

            fontSize:
              13,

            fontWeight:
              700,

            lineHeight:
              1.25,
          }}
        >
          {title}
        </div>


        {subtitle ? (
          <div
            style={{
              color:
                theme.textMuted,

              fontSize:
                10.5,

              lineHeight:
                1.35,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>


      {actionLabel &&
      actionHref ? (
        <Link
          href={
            actionHref
          }
          style={{
            flexShrink:
              0,

            color:
              theme.textSecondary,

            textDecoration:
              "none",

            fontSize:
              10.5,

            fontWeight:
              600,
          }}
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}