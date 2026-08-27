import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import type {
  AssessmentLibrarySortMode,
  AssessmentLibraryStatusFilter,
  AssessmentLibraryViewMode,
} from "../Library/AssessmentLibraryControls";


type AssessmentLibraryToolbarProps = {
  searchText:
    string;

  statusFilter:
    AssessmentLibraryStatusFilter;

  sortMode:
    AssessmentLibrarySortMode;

  viewMode:
    AssessmentLibraryViewMode;

  resultCount:
    number;

  totalCount:
    number;

  theme:
    AppTheme;

  onSearchTextChange:
    (
      value:
        string
    ) => void;

  onStatusFilterChange:
    (
      value:
        AssessmentLibraryStatusFilter
    ) => void;

  onSortModeChange:
    (
      value:
        AssessmentLibrarySortMode
    ) => void;

  onViewModeChange:
    (
      value:
        AssessmentLibraryViewMode
    ) => void;
};


function ViewButton({
  active,
  label,
  theme,
  onClick,
  children,
}: {
  active:
    boolean;

  label:
    string;

  theme:
    AppTheme;

  onClick:
    () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={
        label
      }
      title={
        label
      }
      aria-pressed={
        active
      }
      onClick={
        onClick
      }
      style={{
        width:
          30,

        height:
          26,

        padding:
          0,

        display:
          "grid",

        placeItems:
          "center",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          active
            ? theme.controlSelectedBorder
            : "transparent",

        borderRadius:
          4,

        background:
          active
            ? theme.controlSelectedBg
            : "transparent",

        color:
          active
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",
      }}
    >
      {children}
    </button>
  );
}


export default function AssessmentLibraryToolbar({
  searchText,
  statusFilter,
  sortMode,
  viewMode,
  resultCount,
  totalCount,
  theme,
  onSearchTextChange,
  onStatusFilterChange,
  onSortModeChange,
  onViewModeChange,
}: AssessmentLibraryToolbarProps) {
  const resultText =
    resultCount ===
      totalCount
      ? `${totalCount} total`
      : `${resultCount} of ${totalCount}`;


  const inputStyle:
    React.CSSProperties = {
      height:
        30,

      boxSizing:
        "border-box",

      borderWidth:
        1,

      borderStyle:
        "solid",

      borderColor:
        theme.borderStandard,

      borderRadius:
        5,

      background:
        theme.controlBg,

      color:
        theme.textPrimary,

      fontFamily:
        "var(--app-ui-font-family)",

      fontSize:
        12,

      outline:
        "none",
    };


  return (
    <section
      aria-label="Assessment library controls"
      style={{
        minWidth:
          0,

        minHeight:
          42,

        padding:
          5,

        boxSizing:
          "border-box",

        display:
          "flex",

        alignItems:
          "center",

        gap:
          6,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          theme.borderStandard,

        borderRadius:
          6,

        background:
          theme.bgSurface,
      }}
    >
      <div
        style={{
          position:
            "relative",

          width:
            270,

          minWidth:
            180,

          flex:
            "0 1 270px",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              9,

            top:
              "50%",

            transform:
              "translateY(-50%)",

            color:
              theme.textMuted,

            pointerEvents:
              "none",
          }}
        >
          <circle
            cx="7"
            cy="7"
            r="4.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />

          <path
            d="m10.4 10.4 3 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="search"
          value={
            searchText
          }
          placeholder="Search assessments"
          aria-label="Search assessments"
          onChange={
            (
              event
            ) =>
              onSearchTextChange(
                event.currentTarget
                  .value
              )
          }
          style={{
            ...inputStyle,

            width:
              "100%",

            padding:
              "0 9px 0 29px",
          }}
        />
      </div>


      <select
        aria-label="Filter by status"
        value={
          statusFilter
        }
        onChange={
          (
            event
          ) =>
            onStatusFilterChange(
              event.currentTarget
                .value as
                AssessmentLibraryStatusFilter
            )
        }
        style={{
          ...inputStyle,

          minWidth:
            110,

          padding:
            "0 26px 0 9px",

          cursor:
            "pointer",
        }}
      >
        <option value="ALL">
          All statuses
        </option>

        <option value="DRAFT">
          Draft
        </option>

        <option value="COMPLETE">
          Complete
        </option>
      </select>


      <select
        aria-label="Sort assessments"
        value={
          sortMode
        }
        onChange={
          (
            event
          ) =>
            onSortModeChange(
              event.currentTarget
                .value as
                AssessmentLibrarySortMode
            )
        }
        style={{
          ...inputStyle,

          minWidth:
            150,

          padding:
            "0 26px 0 9px",

          cursor:
            "pointer",
        }}
      >
        <option value="UPDATED_DESC">
          Last edited
        </option>

        <option value="ASSESSMENT_DATE_DESC">
          Assessment date
        </option>

        <option value="CREATED_DESC">
          Date created
        </option>

        <option value="NAME_ASC">
          Name A–Z
        </option>
      </select>


      <div
        style={{
          marginLeft:
            "auto",

          display:
            "flex",

          alignItems:
            "center",

          gap:
            8,
        }}
      >
        <span
          style={{
            color:
              theme.textMuted,

            fontSize:
              11,

            whiteSpace:
              "nowrap",
          }}
        >
          {resultText}
        </span>


        <div
          style={{
            padding:
              2,

            display:
              "flex",

            alignItems:
              "center",

            gap:
              2,

            borderWidth:
              1,

            borderStyle:
              "solid",

            borderColor:
              theme.borderStandard,

            borderRadius:
              5,

            background:
              theme.controlBg,
          }}
        >
          <ViewButton
            active={
              viewMode ===
              "TILES"
            }
            label="Tile view"
            theme={
              theme
            }
            onClick={() =>
              onViewModeChange(
                "TILES"
              )
            }
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="4.5"
                height="4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <rect
                x="9.5"
                y="2"
                width="4.5"
                height="4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <rect
                x="2"
                y="9.5"
                width="4.5"
                height="4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <rect
                x="9.5"
                y="9.5"
                width="4.5"
                height="4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </ViewButton>


          <ViewButton
            active={
              viewMode ===
              "LIST"
            }
            label="List view"
            theme={
              theme
            }
            onClick={() =>
              onViewModeChange(
                "LIST"
              )
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M5 4h9M5 8h9M5 12h9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />

              <circle
                cx="2.3"
                cy="4"
                r=".75"
                fill="currentColor"
              />

              <circle
                cx="2.3"
                cy="8"
                r=".75"
                fill="currentColor"
              />

              <circle
                cx="2.3"
                cy="12"
                r=".75"
                fill="currentColor"
              />
            </svg>
          </ViewButton>
        </div>
      </div>
    </section>
  );
}