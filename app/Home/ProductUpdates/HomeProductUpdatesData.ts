export type HomeProductUpdate = {
  id:
    string;

  date:
    string;

  title:
    string;

  description:
    string;

  label?:
    string;
};


export const HOME_PRODUCT_UPDATES:
  HomeProductUpdate[] = [
    {
      id:
        "class-coverage-subskills",

      date:
        "28 Aug 2026",

      label:
        "NEW",

      title:
        "Course coverage now tracks individual subskills",

      description:
        "Classes can now record partial coverage within a skill and inspect representative generated questions.",
    },

    {
      id:
        "assessment-library-refresh",

      date:
        "28 Aug 2026",

      title:
        "Assessment library refreshed",

      description:
        "Tile and list views now use Course identity, clearer progress and faster access to saved work.",
    },

    {
      id:
        "pdf-preview-workflow",

      date:
        "27 Aug 2026",

      title:
        "Generated assessment previews expanded",

      description:
        "Saved assessments can now be previewed directly from the assessment library.",
    },
  ];