"use client";

import {
  APPLICATION_HEADER_HEIGHT,
} from "../Shell/ApplicationShellTokens";

import {
  useTheme,
} from "../Theme/ThemeProvider";

import Logo from "./Logo";

import Navigation from "./Navigation";


const HEADER_SIDE_REGION_WIDTH =
  180;


export default function HeaderBar() {
  const {
    theme,
  } =
    useTheme();


  return (
    <header
      style={{
        width:
          "100%",

        height:
          APPLICATION_HEADER_HEIGHT,

        minWidth:
          0,

        borderBottomWidth:
          1,

        borderBottomStyle:
          "solid",

        borderBottomColor:
          theme.borderStandard,

        background:
          theme.bgSurface,

        display:
          "grid",

        gridTemplateColumns:
          `${HEADER_SIDE_REGION_WIDTH}px minmax(0, 1fr) ${HEADER_SIDE_REGION_WIDTH}px`,

        alignItems:
          "center",

        gap:
          12,

        padding:
          "0 12px",

        boxSizing:
          "border-box",

        position:
          "relative",

        zIndex:
          300,
      }}
    >
      <Logo />

      <Navigation />

      {/*
       * Intentionally empty.
       *
       * The right-hand Header region is reserved
       * for future application/account controls.
       *
       * Global Settings now belongs exclusively
       * to the application Activity Rail.
       */}
      <div
        aria-hidden="true"
        style={{
          width:
            "100%",

          height:
            "100%",
        }}
      />
    </header>
  );
}