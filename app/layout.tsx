import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "katex/dist/katex.min.css";
import "./globals.css";

import HeaderBar from "@/src/UI/Application/HeaderBar/HeaderBar";

import {
  SettingsProvider,
} from "@/app/settings-bar/GlobalSettingsContext";

import SettingsDrawer from "@/src/UI/Application/SettingsDrawer/SettingsDrawer";

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

            minHeight:
              "100vh",

            background:
              "#0b0f14",
          } as React.CSSProperties
        }
      >
        <SettingsProvider>
          <div
            style={{
              minHeight:
                "100vh",

              display:
                "grid",

              gridTemplateRows:
                "56px 1fr",
            }}
          >
            <HeaderBar />

            <div
              style={{
                minHeight:
                  0,
              }}
            >
              {children}
            </div>
          </div>

          <SettingsDrawer />
        </SettingsProvider>
      </body>
    </html>
  );
}