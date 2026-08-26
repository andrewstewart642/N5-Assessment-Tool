"use client";

import { useMemo } from "react";

import type { Theme } from "../../../Theme/AppTheme";
import {
  ACCENT_MAP,
  type AccentOption,
} from "../../../Colours/AccentPalette";

import {
  COLOUR_HONEYCOMB_ROWS,
  getAccentLabel,
} from "./AccentColourOptions";

import ColourSwatch from "./ColourSwatch";

type HoneycombCell = {
  id: AccentOption;
  row: number;
  col: number;
};

function buildHoneycombCells(rows: AccentOption[][]): HoneycombCell[] {
  return rows.flatMap((row, rowIndex) =>
    row.map((id, colIndex) => ({
      id,
      row: rowIndex,
      col: colIndex,
    }))
  );
}

export default function ColourHoneycomb({
  selectedColour,
  onSelect,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  theme: Theme;
}) {
  const cells = useMemo(() => buildHoneycombCells(COLOUR_HONEYCOMB_ROWS), []);

  const hexWidth = 24;
  const hexHeight = 28;
  const colStep = 20.9;
  const rowStep = 21.2;
  const maxCols = Math.max(...COLOUR_HONEYCOMB_ROWS.map((row) => row.length));
  const width = (maxCols - 1) * colStep + hexWidth;
  const height = (COLOUR_HONEYCOMB_ROWS.length - 1) * rowStep + hexHeight;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        margin: "0 auto",
      }}
    >
      {cells.map((cell) => {
        const rowLength = COLOUR_HONEYCOMB_ROWS[cell.row].length;
        const baseLeft = ((maxCols - rowLength) * colStep) / 2;
        const left = baseLeft + cell.col * colStep;
        const top = cell.row * rowStep;

        return (
          <div
            key={`${cell.row}-${cell.col}-${cell.id}`}
            style={{
              position: "absolute",
              left,
              top,
            }}
          >
            <ColourSwatch
              colour={ACCENT_MAP[cell.id]}
              label={`${getAccentLabel(cell.id)} ${ACCENT_MAP[cell.id]}`}
              active={cell.id === selectedColour}
              onClick={() => onSelect(cell.id)}
              theme={theme}
              width={hexWidth}
              height={hexHeight}
            />
          </div>
        );
      })}
    </div>
  );
}