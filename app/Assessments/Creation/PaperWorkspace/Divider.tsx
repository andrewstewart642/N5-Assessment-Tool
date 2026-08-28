import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

type WorkspaceDividerProps = {
  theme:
    AppTheme;

  width:
    number;

  isDragging:
    boolean;

  setIsDragging:
    Dispatch<
      SetStateAction<boolean>
    >;
};

const DOT_SIZE =
  2;

const DOT_GAP =
  3;

export default function WorkspaceDivider({
  theme,
  width,
  isDragging,
  setIsDragging,
}: WorkspaceDividerProps) {
  return (
    <div
      onMouseDown={(
        event
      ) => {
        event.preventDefault();

        setIsDragging(
          true
        );
      }}
      style={{
        width,

        minWidth:
          width,

        height:
          "100%",

        background:
          theme.bgPage,

        cursor:
          "col-resize",

        position:
          "relative",

        display:
          "grid",

        placeItems:
          "center",

        userSelect:
          "none",

        WebkitUserSelect:
          "none",
      }}
      title="Drag to resize panes"
    >
      <div
        aria-hidden="true"
        style={{
          display:
            "grid",

          gridTemplateRows:
            `repeat(3, ${DOT_SIZE}px)`,

          gap:
            DOT_GAP,

          placeItems:
            "center",

          pointerEvents:
            "none",
        }}
      >
        {[
          0,
          1,
          2,
        ].map(
          (dot) => (
            <span
              key={
                dot
              }
              style={{
                width:
                  DOT_SIZE,

                height:
                  DOT_SIZE,

                borderRadius:
                  999,

                background:
                  isDragging
                    ? theme.accentPrimary
                    : theme.textMuted,

                opacity:
                  isDragging
                    ? 0.9
                    : 0.48,

                transition:
                  "background 0.15s ease, opacity 0.15s ease",
              }}
            />
          )
        )}
      </div>
    </div>
  );
}