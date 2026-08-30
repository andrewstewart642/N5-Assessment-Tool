import type { A8ContextShell } from "./ContextLibrary";

const range = (min: number, max: number, step: number) => ({ min, max, step });

const derivedMass = (
  id: string,
  itemSingular: [string, string],
  itemPlural: [string, string],
  setting: string,
  firstRange: ReturnType<typeof range>,
  secondRange: ReturnType<typeof range>,
): A8ContextShell => ({
  id,
  kind: "MASS",
  papers: ["P2"],
  itemSingular,
  itemPlural,
  setting,
  sameSetting: "onto another lorry",
  resourceLabel: null,
  activityLead: null,
  activityVerb: null,
  unitDimension: "mass",
  unitSymbol: "kg",
  unitPromptLabel: "kilograms",
  unitPosition: "SUFFIX",
  displayDecimals: 0,
  valueRanges: [firstRange, secondRange],
  supportsDerivedTotal: true,
});

/**
 * Additional evidence-near large/round mass shells for the single-source
 * derived-total family. They vary the believable freight objects without
 * changing the mathematical family or introducing unrelated contexts.
 */
export const A8_DERIVED_MASS_CONTEXT_SHELLS: A8ContextShell[] = [
  derivedMass(
    "BRICK_BLOCK_PALLETS",
    ["pallet of bricks", "pallet of concrete blocks"],
    ["pallets of bricks", "pallets of concrete blocks"],
    "onto a builders' merchant lorry",
    range(200, 420, 20),
    range(160, 360, 20),
  ),
  derivedMass(
    "PAVING_KERB_PALLETS",
    ["pallet of paving slabs", "pallet of kerbstones"],
    ["pallets of paving slabs", "pallets of kerbstones"],
    "onto a delivery lorry",
    range(180, 380, 20),
    range(120, 300, 20),
  ),
  derivedMass(
    "STEEL_TIMBER_BUNDLES",
    ["bundle of steel sections", "bundle of timber beams"],
    ["bundles of steel sections", "bundles of timber beams"],
    "onto a construction lorry",
    range(80, 180, 10),
    range(60, 150, 10),
  ),
  derivedMass(
    "FLOOR_WALL_TILE_PALLETS",
    ["pallet of floor tiles", "pallet of wall tiles"],
    ["pallets of floor tiles", "pallets of wall tiles"],
    "onto a tile supplier's lorry",
    range(100, 260, 20),
    range(80, 220, 20),
  ),
  derivedMass(
    "SCAFFOLD_BOARD_POLE_BUNDLES",
    ["bundle of scaffold boards", "bundle of scaffold poles"],
    ["bundles of scaffold boards", "bundles of scaffold poles"],
    "onto a site lorry",
    range(100, 260, 20),
    range(80, 220, 20),
  ),
  derivedMass(
    "FENCING_PANEL_POST_BUNDLES",
    ["bundle of fence panels", "bundle of fence posts"],
    ["bundles of fence panels", "bundles of fence posts"],
    "onto a fencing supplier's lorry",
    range(120, 300, 20),
    range(60, 180, 20),
  ),
  derivedMass(
    "ROOF_TILE_SLATE_PALLETS",
    ["pallet of roof tiles", "pallet of roofing slates"],
    ["pallets of roof tiles", "pallets of roofing slates"],
    "onto a roofing supplier's lorry",
    range(180, 420, 20),
    range(160, 360, 20),
  ),
  derivedMass(
    "STONE_BLOCK_PALLETS",
    ["pallet of stone blocks", "pallet of concrete slabs"],
    ["pallets of stone blocks", "pallets of concrete slabs"],
    "onto a builders' merchant lorry",
    range(200, 500, 20),
    range(160, 420, 20),
  ),
];
