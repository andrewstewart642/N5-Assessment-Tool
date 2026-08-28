import Link from "next/link";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";


export default function HomePageHeader({
  theme,
}: {
  theme:
    AppTheme;
}) {
  return (
    <header
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
          16,
      }}
    >
      <div
        style={{
          display:
            "grid",

          gap:
            4,
        }}
      >
        <h1
          style={{
            margin:
              0,

            color:
              theme.textPrimary,

            fontSize:
              30,

            fontWeight:
              700,

            lineHeight:
              1.08,
          }}
        >
          Home
        </h1>


        <div
          style={{
            color:
              theme.textSecondary,

            fontSize:
              13,

            lineHeight:
              1.35,
          }}
        >
          Plan, build and keep track of what comes next.
        </div>
      </div>


      <Link
        href="/create-assessment"
        style={{
          height:
            32,

          padding:
            "0 11px",

          boxSizing:
            "border-box",

          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            6,

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            theme.controlSelectedBorder,

          borderRadius:
            6,

          background:
            theme.controlSelectedBg,

          color:
            theme.textPrimary,

          textDecoration:
            "none",

          fontSize:
            12,

          fontWeight:
            600,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize:
              15,

            lineHeight:
              1,
          }}
        >
          +
        </span>

        New assessment
      </Link>
    </header>
  );
}