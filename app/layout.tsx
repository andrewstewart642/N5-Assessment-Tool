import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "katex/dist/katex.min.css";
import "@/app/UI/Application/Styles/ApplicationGlobals.css";

import HeaderBar from "@/app/UI/Application/HeaderBar/HeaderBar";

import {
  SettingsProvider,
} from "@/app/UI/Application/Settings/ApplicationSettings";

import ApplicationActivityRail from "@/app/UI/Application/Shell/ApplicationActivityRail";

import {
  APPLICATION_ACTIVITY_RAIL_WIDTH,
  APPLICATION_HEADER_HEIGHT,
} from "@/app/UI/Application/Shell/ApplicationShellTokens";


const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin",
    ],
  });


const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });


export const metadata:
  Metadata = {
    title:
      "N5 Assessment Tool",

    description:
      "Create and manage National 5 maths assessments.",
  };


export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--app-ui-font-family":
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',

            "--app-ui-font-size":
              "13px",

            fontFamily:
              "var(--app-ui-font-family)",

            fontSize:
              "var(--app-ui-font-size)",

            lineHeight:
              1.3,

            margin:
              0,

            width:
              "100%",

            height:
              "100dvh",

            minHeight:
              "100vh",

            overflow:
              "hidden",

            background:
              "#0b0f14",
          } as React.CSSProperties
        }
      >
        <SettingsProvider>
          <div
            style={{
              width:
                "100%",

              height:
                "100dvh",

              minWidth:
                0,

              minHeight:
                0,

              display:
                "grid",

              gridTemplateRows:
                `${APPLICATION_HEADER_HEIGHT}px minmax(0, 1fr)`,

              overflow:
                "hidden",
            }}
          >
            <HeaderBar />

            <div
              style={{
                minWidth:
                  0,

                minHeight:
                  0,

                display:
                  "grid",

                gridTemplateColumns:
                  `${APPLICATION_ACTIVITY_RAIL_WIDTH}px minmax(0, 1fr)`,

                overflow:
                  "hidden",

                position:
                  "relative",
              }}
            >
              <ApplicationActivityRail />

              <div
                style={{
                  minWidth:
                    0,

                  minHeight:
                    0,

                  height:
                    "100%",

                  position:
                    "relative",

                  overflow:
                    "auto",
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}