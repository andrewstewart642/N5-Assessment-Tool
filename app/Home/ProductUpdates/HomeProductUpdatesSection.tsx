import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";

import {
  HOME_PRODUCT_UPDATES,
} from "./HomeProductUpdatesData";


export default function HomeProductUpdatesSection({
  theme,
}: {
  theme:
    AppTheme;
}) {
  return (
    <section
      style={{
        minWidth:
          0,

        padding:
          14,

        boxSizing:
          "border-box",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          11,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          theme.borderStandard,

        borderRadius:
          6,

        background:
          `linear-gradient(
            145deg,
            color-mix(
              in srgb,
              ${theme.accentPrimary} 5%,
              ${theme.bgSurface}
            ) 0%,
            ${theme.bgSurface} 58%
          )`,

        boxShadow:
          theme.shadow,
      }}
    >
      <HomeSectionHeader
        title="What's new"
        subtitle="Latest improvements to the assessment platform."
        theme={
          theme
        }
      />


      <div
        style={{
          display:
            "grid",

          gap:
            5,
        }}
      >
        {HOME_PRODUCT_UPDATES.map(
          (
            update,
            index
          ) => (
            <article
              key={
                update.id
              }
              style={{
                padding:
                  "8px 0",

                display:
                  "grid",

                gap:
                  4,

                borderTopWidth:
                  index ===
                  0
                    ? 0
                    : 1,

                borderTopStyle:
                  "solid",

                borderTopColor:
                  theme.borderStandard,
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    6,
                }}
              >
                {update.label ? (
                  <span
                    style={{
                      height:
                        18,

                      padding:
                        "0 5px",

                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      borderWidth:
                        1,

                      borderStyle:
                        "solid",

                      borderColor:
                        theme.controlSelectedBorder,

                      borderRadius:
                        4,

                      background:
                        theme.controlSelectedBg,

                      color:
                        theme.accentPrimary,

                      fontSize:
                        8,

                      fontWeight:
                        750,

                      letterSpacing:
                        "0.05em",
                    }}
                  >
                    {update.label}
                  </span>
                ) : null}


                <span
                  style={{
                    color:
                      theme.textMuted,

                    fontSize:
                      9,

                    fontVariantNumeric:
                      "tabular-nums",
                  }}
                >
                  {update.date}
                </span>
              </div>


              <div
                style={{
                  color:
                    theme.textPrimary,

                  fontSize:
                    11,

                  fontWeight:
                    650,

                  lineHeight:
                    1.35,
                }}
              >
                {update.title}
              </div>


              <div
                style={{
                  color:
                    theme.textMuted,

                  fontSize:
                    9.5,

                  lineHeight:
                    1.4,
                }}
              >
                {update.description}
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}