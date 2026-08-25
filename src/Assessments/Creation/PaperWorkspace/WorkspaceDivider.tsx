import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

type WorkspaceDividerProps = {
  theme: AppTheme;

  width: number;

  isDragging: boolean;

  setIsDragging:
    Dispatch<
      SetStateAction<boolean>
    >;
};

export default function WorkspaceDivider({
  theme,
  width,
  isDragging,
  setIsDragging,
}: WorkspaceDividerProps) {
  const dividerColour =
    isDragging
      ? theme.accentSoft
      : theme.borderStandard;

  return (
    <div
      onMouseDown={() =>
        setIsDragging(true)
      }
      onMouseUp={() =>
        setIsDragging(false)
      }
      style={{
        width,

        background:
          dividerColour,

        cursor:
          "col-resize",

        position:
          "relative",
      }}
      title="Drag to resize panes"
    >
      <div
        style={{
          position:
            "absolute",

          inset: 0,

          background:
            "linear-gradient(to right, transparent 0, transparent 2px, rgba(147,197,253,0.20) 2px, rgba(147,197,253,0.20) 6px, transparent 6px, transparent 100%)",

          opacity:
            isDragging
              ? 1
              : 0.3,
        }}
      />
    </div>
  );
}