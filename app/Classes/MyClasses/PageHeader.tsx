import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";


type Props = {
  classCount:
    number;

  hasLoaded:
    boolean;

  onAddClass:
    () => void;

  theme:
    AppTheme;
};


export default function ClassesHeader({
  classCount,
  hasLoaded,
  onAddClass,
  theme,
}: Props) {
  const classCountText =
    classCount ===
    1
      ? "1 class"
      : `${classCount} classes`;


  return (
    <section
      style={{
        minWidth:
          0,

        display:
          "flex",

        alignItems:
          "flex-start",

        justifyContent:
          "space-between",

        gap:
          16,

        flexWrap:
          "wrap",
      }}
    >
      <div
        style={{
          display:
            "grid",

          gap:
            4,
        }}
      >
        <h1
          style={{
            margin:
              0,

            color:
              theme.textPrimary,

            fontSize:
              30,

            fontWeight:
              700,

            lineHeight:
              1.08,
          }}
        >
          My Classes
        </h1>


        <div
          style={{
            color:
              theme.textSecondary,

            fontSize:
              13,

            lineHeight:
              1.35,
          }}
        >
          {hasLoaded
            ? classCountText
            : "Loading classes..."}
        </div>
      </div>


      <button
        type="button"
        onClick={
          onAddClass
        }
        style={{
          height:
            32,

          padding:
            "0 11px",

          boxSizing:
            "border-box",

          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            6,

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            theme.controlSelectedBorder,

          borderRadius:
            6,

          background:
            theme.controlSelectedBg,

          color:
            theme.textPrimary,

          cursor:
            "pointer",

          fontFamily:
            "inherit",

          fontSize:
            12,

          fontWeight:
            600,

          whiteSpace:
            "nowrap",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize:
              14,

            lineHeight:
              1,
          }}
        >
          +
        </span>

        New class
      </button>
    </section>
  );
}