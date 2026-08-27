"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import GlobalSettingsPanel from "@/app/UI/Application/Settings/GlobalSettingsPanel";

import {
  useTheme,
} from "@/app/UI/Application/Theme/ThemeProvider";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import {
  APPLICATION_ACTIVITY_BUTTON_INSET,
  APPLICATION_ACTIVITY_BUTTON_SIZE,
  APPLICATION_ACTIVITY_PANEL_WIDTH,
  APPLICATION_ACTIVITY_RAIL_WIDTH,
} from "./ApplicationShellTokens";


const APPLICATION_FOCUS_OVERLAY =
  "rgba(0, 0, 0, 0.4)";


export default function ApplicationActivityRail() {
  const pathname =
    usePathname();

  const {
    theme,
  } =
    useTheme();


  const [
    settingsOpen,
    setSettingsOpen,
  ] =
    useState(
      false
    );


  const [
    settingsHovered,
    setSettingsHovered,
  ] =
    useState(
      false
    );


  const shellRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /*
   * Changing page closes temporary application
   * activities automatically.
   */

  useEffect(() => {
    setSettingsOpen(
      false
    );
  }, [
    pathname,
  ]);


  /*
   * Clicking anywhere outside the rail/panel
   * dissolves the activity back into the rail.
   *
   * Escape behaves the same way.
   */

  useEffect(() => {
    if (
      !settingsOpen
    ) {
      return;
    }


    function handleMouseDown(
      event:
        MouseEvent
    ) {
      const shell =
        shellRef.current;

      if (
        !shell
      ) {
        return;
      }

      if (
        shell.contains(
          event.target as Node
        )
      ) {
        return;
      }

      setSettingsOpen(
        false
      );
    }


    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      setSettingsOpen(
        false
      );
    }


    window.addEventListener(
      "mousedown",
      handleMouseDown
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    settingsOpen,
  ]);


  return (
    <div
      ref={
        shellRef
      }
      style={{
        width:
          APPLICATION_ACTIVITY_RAIL_WIDTH,

        minWidth:
          APPLICATION_ACTIVITY_RAIL_WIDTH,

        height:
          "100%",

        minHeight:
          0,

        position:
          "relative",

        zIndex:
          200,

        overflow:
          "visible",
      }}
    >
      {/*
       * Focus backdrop.
       *
       * The active page remains visible, but is
       * gently darkened while a global activity
       * panel is open.
       *
       * It begins immediately after the rail and
       * therefore does not darken the rail itself.
       */}

      <div
        aria-hidden="true"
        onMouseDown={(
          event
        ) => {
          event.preventDefault();
          event.stopPropagation();

          setSettingsOpen(
            false
          );
        }}
        style={{
          position:
            "absolute",

          left:
            APPLICATION_ACTIVITY_RAIL_WIDTH,

          top:
            0,

          width:
            `calc(100vw - ${APPLICATION_ACTIVITY_RAIL_WIDTH}px)`,

          height:
            "100%",

          background:
            APPLICATION_FOCUS_OVERLAY,

          opacity:
            settingsOpen
              ? 1
              : 0,

          visibility:
            settingsOpen
              ? "visible"
              : "hidden",

          pointerEvents:
            settingsOpen
              ? "auto"
              : "none",

          transition: [
            "opacity 170ms ease",
            settingsOpen
              ? "visibility 0s linear 0s"
              : "visibility 0s linear 170ms",
          ].join(
            ", "
          ),

          zIndex:
            0,
        }}
      />


      {/*
       * Global application Settings panel.
       *
       * This overlays the active page rather than
       * changing that page's layout dimensions.
       */}

      <aside
        aria-hidden={
          !settingsOpen
        }
        style={{
          position:
            "absolute",

          left:
            APPLICATION_ACTIVITY_RAIL_WIDTH,

          top:
            0,

          bottom:
            0,

          width:
            APPLICATION_ACTIVITY_PANEL_WIDTH,

          minHeight:
            0,

          display:
            "grid",

          gridTemplateRows:
            "44px minmax(0, 1fr)",

          background:
            theme.bgSurface,

          borderRightWidth:
            1,

          borderRightStyle:
            "solid",

          borderRightColor:
            theme.borderStandard,

          boxShadow:
            settingsOpen
              ? theme.shadowStrong
              : "none",

          transform:
            settingsOpen
              ? "translateX(0)"
              : "translateX(-100%)",

          opacity:
            settingsOpen
              ? 1
              : 0,

          visibility:
            settingsOpen
              ? "visible"
              : "hidden",

          pointerEvents:
            settingsOpen
              ? "auto"
              : "none",

          transition: [
            "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            "opacity 150ms ease",
            settingsOpen
              ? "visibility 0s linear 0s"
              : "visibility 0s linear 220ms",
            "box-shadow 180ms ease",
          ].join(
            ", "
          ),

          willChange:
            "transform, opacity",

          zIndex:
            1,
        }}
      >
        {/*
         * Panel header
         */}

        <div
          style={{
            minWidth:
              0,

            height:
              44,

            padding:
              "0 12px",

            boxSizing:
              "border-box",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              8,

            borderBottomWidth:
              1,

            borderBottomStyle:
              "solid",

            borderBottomColor:
              theme.borderStandard,
          }}
        >
          <div
            style={{
              minWidth:
                0,

              color:
                theme.textPrimary,

              ...UI_TEXT.controlTextStrong,

              fontSize:
                14,
            }}
          >
            Settings
          </div>

          <div
            style={{
              color:
                theme.textMuted,

              ...UI_TEXT.helper,
            }}
          >
            Application
          </div>
        </div>


        {/*
         * Global-settings content
         */}

        <div
          style={{
            minWidth:
              0,

            minHeight:
              0,

            padding:
              12,

            boxSizing:
              "border-box",

            overflowY:
              "auto",

            overflowX:
              "hidden",

            scrollbarWidth:
              "thin",

            scrollbarColor:
              `${theme.borderStandard} transparent`,
          }}
        >
          <GlobalSettingsPanel />
        </div>
      </aside>


      {/*
       * Persistent application Activity Rail.
       */}

      <nav
        aria-label="Application activities"
        style={{
          position:
            "absolute",

          inset:
            0,

          width:
            APPLICATION_ACTIVITY_RAIL_WIDTH,

          minWidth:
            APPLICATION_ACTIVITY_RAIL_WIDTH,

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          background:
            theme.bgSurface,

          borderRightWidth:
            1,

          borderRightStyle:
            "solid",

          borderRightColor:
            theme.borderStandard,

          boxSizing:
            "border-box",

          zIndex:
            2,
        }}
      >
        <div
          style={{
            flex:
              "1 1 auto",
          }}
        />


        {/*
         * Global Settings activity.
         */}

        <button
          type="button"
          aria-label="Settings"
          aria-expanded={
            settingsOpen
          }
          title="Settings"
          onClick={() =>
            setSettingsOpen(
              (
                previous
              ) =>
                !previous
            )
          }
          onMouseEnter={() =>
            setSettingsHovered(
              true
            )
          }
          onMouseLeave={() =>
            setSettingsHovered(
              false
            )
          }
          style={{
            width:
              APPLICATION_ACTIVITY_BUTTON_SIZE,

            height:
              APPLICATION_ACTIVITY_BUTTON_SIZE,

            marginBottom:
              APPLICATION_ACTIVITY_BUTTON_INSET,

            padding:
              0,

            flexShrink:
              0,

            position:
              "relative",

            display:
              "grid",

            placeItems:
              "center",

            border:
              "none",

            borderRadius:
              5,

            background:
              settingsOpen
                ? theme.controlSelectedBg
                : settingsHovered
                  ? theme.controlBgHover
                  : "transparent",

            color:
              settingsOpen
                ? theme.textPrimary
                : settingsHovered
                  ? theme.textSecondary
                  : theme.textMuted,

            cursor:
              "pointer",

            outline:
              "none",

            transition: [
              "background 140ms ease",
              "color 140ms ease",
            ].join(
              ", "
            ),
          }}
        >
          {settingsOpen ? (
            <span
              aria-hidden="true"
              style={{
                position:
                  "absolute",

                left:
                  -APPLICATION_ACTIVITY_BUTTON_INSET,

                top:
                  5,

                bottom:
                  5,

                width:
                  2,

                borderRadius:
                  2,

                background:
                  theme.accentPrimary,
              }}
            />
          ) : null}


          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d={[
                "M12 8.25",
                "A3.75 3.75 0 1 0 12 15.75",
                "A3.75 3.75 0 0 0 12 8.25",
              ].join(
                " "
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d={[
                "M19.1 13.5",
                "a7.8 7.8 0 0 0 0-3",
                "l2-1.55",
                "-2-3.45",
                "-2.5 1",
                "a8.5 8.5 0 0 0-2.6-1.5",
                "L13.6 2.25",
                "h-4",
                "L9.2 5",
                "a8.5 8.5 0 0 0-2.6 1.5",
                "l-2.5-1",
                "-2 3.45",
                "2 1.55",
                "a7.8 7.8 0 0 0 0 3",
                "l-2 1.55",
                "2 3.45",
                "2.5-1",
                "a8.5 8.5 0 0 0 2.6 1.5",
                "l.4 2.75",
                "h4",
                ".4-2.75",
                "a8.5 8.5 0 0 0 2.6-1.5",
                "l2.5 1",
                "2-3.45",
                "-2-1.55",
              ].join(
                " "
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}