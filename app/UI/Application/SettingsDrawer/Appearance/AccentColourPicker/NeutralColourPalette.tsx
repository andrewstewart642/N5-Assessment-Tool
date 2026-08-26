
import type { Theme } from "../../../Theme/AppTheme";
import {
  ACCENT_MAP,
  type AccentOption,
} from "../../../Colours/AccentPalette";

import {
  BLACK_ACCENT_OPTION,
  getAccentLabel,
  NEUTRAL_BOTTOM_ROW,
  NEUTRAL_TOP_ROW,
  WHITE_ACCENT_OPTION,
} from "./AccentColourOptions";

import ColourSwatch from "./ColourSwatch";

export default function NeutralColourPalette({
  selectedColour,
  onSelect,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  theme: Theme;
}) {
  const smallHexWidth = 22;
  const smallHexHeight = 26;
  const largeHexWidth = 30;
  const largeHexHeight = 34;
  const colStep = 18.7;
  const rowStep = 18.5;

  const contentWidth = 290;
  const topLeft = 53;
  const bottomLeft = 43;
  const blackLeft = contentWidth - largeHexWidth;
  const whiteTop = 12;
  const blackTop = 10;

  return (
    <div
      style={{
        width: contentWidth,
        height: 52,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: whiteTop,
        }}
      >
        <ColourSwatch
          colour={ACCENT_MAP[WHITE_ACCENT_OPTION]}
          label="White"
          active={selectedColour === WHITE_ACCENT_OPTION}
          onClick={() => onSelect(WHITE_ACCENT_OPTION)}
          theme={theme}
          width={largeHexWidth}
          height={largeHexHeight}
          innerBorder
        />
      </div>

      {NEUTRAL_TOP_ROW.map((id, index) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: topLeft + index * colStep,
            top: 0,
          }}
        >
          <ColourSwatch
            colour={ACCENT_MAP[id]}
            label={`${getAccentLabel(id)} ${ACCENT_MAP[id]}`}
            active={selectedColour === id}
            onClick={() => onSelect(id)}
            theme={theme}
            width={smallHexWidth}
            height={smallHexHeight}
          />
        </div>
      ))}

      {NEUTRAL_BOTTOM_ROW.map((id, index) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: bottomLeft + index * colStep,
            top: rowStep,
          }}
        >
          <ColourSwatch
            colour={ACCENT_MAP[id]}
            label={`${getAccentLabel(id)} ${ACCENT_MAP[id]}`}
            active={selectedColour === id}
            onClick={() => onSelect(id)}
            theme={theme}
            width={smallHexWidth}
            height={smallHexHeight}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: blackLeft,
          top: blackTop,
        }}
      >
        <ColourSwatch
          colour={ACCENT_MAP[BLACK_ACCENT_OPTION]}
          label="Black"
          active={selectedColour === BLACK_ACCENT_OPTION}
          onClick={() => onSelect(BLACK_ACCENT_OPTION)}
          theme={theme}
          width={largeHexWidth}
          height={largeHexHeight}
        />
      </div>
    </div>
  );
}