import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

import AppShellTopBar from "@/page-sections/AppShellTopBar";
import { getSQATypographyCssVars } from "@/app/paper-layout/SQA-Typography";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "N5 Assessment Tool",
  description: "Create and manage National 5 maths assessments.",
};

function buildRootCssVarStyle(): React.CSSProperties {
  const vars = getSQATypographyCssVars();
  return vars as unknown as React.CSSProperties;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={buildRootCssVarStyle()}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--app-ui-font-family":
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
            "--app-ui-font-size": "13px",
            fontFamily: "var(--app-ui-font-family)",
            fontSize: "var(--app-ui-font-size)",
            lineHeight: 1.3,
            margin: 0,
            minHeight: "100vh",
            background: "#0b0f14",
          } as React.CSSProperties
        }
      >
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            gridTemplateRows: "56px 1fr",
          }}
        >
          <AppShellTopBar />
          <div style={{ minHeight: 0 }}>{children}</div>
        </div>
      </body>
    </html>
  );
}