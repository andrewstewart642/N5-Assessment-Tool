import type { A8GeneratorPaper } from "./Types";

export type A8ContextKind = "PURCHASE" | "MASS" | "RESOURCE";
export type A8ContextUnitDimension = "currency" | "mass" | "area" | "length" | "volume";

export type A8ValueRange = {
  min: number;
  max: number;
  step: number;
};

export type A8ContextShell = {
  id: string;
  kind: A8ContextKind;
  papers: A8GeneratorPaper[];
  itemSingular: [string, string];
  itemPlural: [string, string];
  setting: string;
  sameSetting: string;
  resourceLabel: string | null;
  activityLead: string | null;
  activityVerb: string | null;
  unitDimension: A8ContextUnitDimension;
  unitSymbol: string;
  unitPromptLabel: string;
  unitPosition: "PREFIX" | "SUFFIX";
  displayDecimals: number;
  valueRanges: [A8ValueRange, A8ValueRange];
  supportsDerivedTotal: boolean;
};

const range = (min: number, max: number, step: number): A8ValueRange => ({ min, max, step });

const purchase = (
  id: string,
  itemSingular: [string, string],
  itemPlural: [string, string],
  setting: string,
  sameSetting: string,
  firstRange: A8ValueRange,
  secondRange: A8ValueRange,
): A8ContextShell => ({
  id,
  kind: "PURCHASE",
  papers: ["P2"],
  itemSingular,
  itemPlural,
  setting,
  sameSetting,
  resourceLabel: null,
  activityLead: null,
  activityVerb: null,
  unitDimension: "currency",
  unitSymbol: "£",
  unitPromptLabel: "pounds",
  unitPosition: "PREFIX",
  displayDecimals: 2,
  valueRanges: [firstRange, secondRange],
  supportsDerivedTotal: false,
});

const mass = (
  id: string,
  itemSingular: [string, string],
  itemPlural: [string, string],
  setting: string,
  sameSetting: string,
  firstRange: A8ValueRange,
  secondRange: A8ValueRange,
  papers: A8GeneratorPaper[] = ["P1", "P2"],
): A8ContextShell => ({
  id,
  kind: "MASS",
  papers,
  itemSingular,
  itemPlural,
  setting,
  sameSetting,
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

const resource = (
  id: string,
  itemSingular: [string, string],
  itemPlural: [string, string],
  activityLead: string,
  activityVerb: string,
  resourceLabel: string,
  unitDimension: "area" | "length" | "volume",
  unitSymbol: string,
  unitPromptLabel: string,
  firstRange: A8ValueRange,
  secondRange: A8ValueRange,
): A8ContextShell => ({
  id,
  kind: "RESOURCE",
  papers: ["P1", "P2"],
  itemSingular,
  itemPlural,
  setting: "",
  sameSetting: "",
  resourceLabel,
  activityLead,
  activityVerb,
  unitDimension,
  unitSymbol,
  unitPromptLabel,
  unitPosition: "SUFFIX",
  displayDecimals: 1,
  valueRanges: [firstRange, secondRange],
  supportsDerivedTotal: false,
});

/**
 * Curated contextual shells for A8 generation.
 *
 * These are semantic scenario models, not historical prompt templates. Every
 * shell has been chosen so that a fixed unit value for each item is genuinely
 * believable and two additive relationships naturally form simultaneous
 * equations. The pool deliberately avoids arbitrary noun-swapping.
 */
export const A8_CONTEXT_SHELLS: A8ContextShell[] = [
  // Purchase / price contexts (30) - calculator-paper only.
  purchase("CINEMA_TICKETS", ["adult ticket", "child ticket"], ["adult tickets", "child tickets"], "at a cinema", "at the same cinema", range(6, 15, 0.5), range(4, 10, 0.5)),
  purchase("THEATRE_TICKETS", ["adult ticket", "child ticket"], ["adult tickets", "child tickets"], "at a theatre", "at the same theatre", range(12, 30, 0.5), range(6, 18, 0.5)),
  purchase("MUSEUM_TICKETS", ["adult ticket", "junior ticket"], ["adult tickets", "junior tickets"], "at a museum", "at the same museum", range(6, 18, 0.5), range(3, 10, 0.5)),
  purchase("ZOO_TICKETS", ["adult ticket", "child ticket"], ["adult tickets", "child tickets"], "at a zoo", "at the same zoo", range(10, 25, 0.5), range(5, 15, 0.5)),
  purchase("AQUARIUM_TICKETS", ["adult ticket", "child ticket"], ["adult tickets", "child tickets"], "at an aquarium", "at the same aquarium", range(9, 22, 0.5), range(5, 14, 0.5)),
  purchase("SWIMMING_ENTRIES", ["adult entry", "junior entry"], ["adult entries", "junior entries"], "at a swimming pool", "at the same swimming pool", range(4, 9, 0.25), range(2.5, 6, 0.25)),
  purchase("ICE_RINK_ENTRIES", ["adult entry", "junior entry"], ["adult entries", "junior entries"], "at an ice rink", "at the same ice rink", range(7, 14, 0.5), range(4, 10, 0.5)),
  purchase("BOWLING_GAMES", ["adult game", "junior game"], ["adult games", "junior games"], "at a bowling centre", "at the same bowling centre", range(5, 11, 0.5), range(3.5, 8, 0.5)),
  purchase("FOOTBALL_TICKETS", ["adult ticket", "child ticket"], ["adult tickets", "child tickets"], "for a football match", "for the same football match", range(12, 35, 1), range(5, 18, 1)),
  purchase("CONCERT_TICKETS", ["standard ticket", "student ticket"], ["standard tickets", "student tickets"], "for a concert", "for the same concert", range(15, 40, 1), range(10, 28, 1)),
  purchase("BUS_DAY_TICKETS", ["adult day ticket", "child day ticket"], ["adult day tickets", "child day tickets"], "from a bus station", "from the same bus station", range(4, 9, 0.25), range(2, 5, 0.25)),
  purchase("TRAIN_DAY_TICKETS", ["adult day ticket", "child day ticket"], ["adult day tickets", "child day tickets"], "from a railway station", "from the same railway station", range(8, 24, 0.5), range(4, 12, 0.5)),
  purchase("MANGO_APPLE", ["mango", "apple"], ["mangoes", "apples"], "at a fruit shop", "at the same fruit shop", range(0.6, 1.8, 0.05), range(0.25, 0.9, 0.05)),
  purchase("PEAR_ORANGE", ["pear", "orange"], ["pears", "oranges"], "at a fruit shop", "at the same fruit shop", range(0.35, 1.1, 0.05), range(0.3, 1, 0.05)),
  purchase("PEACH_PLUM", ["peach", "plum"], ["peaches", "plums"], "at a market stall", "at the same market stall", range(0.45, 1.3, 0.05), range(0.3, 0.9, 0.05)),
  purchase("SANDWICH_JUICE", ["sandwich", "bottle of juice"], ["sandwiches", "bottles of juice"], "at a cafe", "at the same cafe", range(2.5, 6, 0.25), range(1.2, 3.5, 0.25)),
  purchase("MUFFIN_COOKIE", ["muffin", "cookie"], ["muffins", "cookies"], "at a bakery", "at the same bakery", range(1.5, 3.5, 0.25), range(0.75, 2, 0.25)),
  purchase("HOT_CHOCOLATE_TEA", ["hot chocolate", "tea"], ["hot chocolates", "teas"], "at a cafe", "at the same cafe", range(2.2, 4.5, 0.25), range(1.5, 3.2, 0.25)),
  purchase("SMOOTHIE_FRUIT_CUP", ["smoothie", "fruit pot"], ["smoothies", "fruit pots"], "at a juice bar", "at the same juice bar", range(2.5, 5.5, 0.25), range(1.8, 4, 0.25)),
  purchase("NOTEBOOK_PEN_SET", ["notebook", "pen set"], ["notebooks", "pen sets"], "at a stationery shop", "at the same stationery shop", range(1.5, 6, 0.25), range(1, 5, 0.25)),
  purchase("FOLDER_NOTEBOOK", ["folder", "notebook"], ["folders", "notebooks"], "at a stationery shop", "at the same stationery shop", range(0.75, 3, 0.25), range(1.25, 5, 0.25)),
  purchase("PENCIL_CASE_RULER", ["pencil case", "ruler"], ["pencil cases", "rulers"], "at a stationery shop", "at the same stationery shop", range(2, 8, 0.5), range(0.5, 2.5, 0.25)),
  purchase("PAPERBACK_HARDBACK", ["paperback book", "hardback book"], ["paperback books", "hardback books"], "at a bookshop", "at the same bookshop", range(5, 12, 0.5), range(10, 24, 0.5)),
  purchase("ROSE_TULIP", ["rose", "tulip"], ["roses", "tulips"], "at a florist", "at the same florist", range(1.5, 4, 0.25), range(1, 3, 0.25)),
  purchase("PLANT_SEED_PACKET", ["potted plant", "packet of seeds"], ["potted plants", "packets of seeds"], "at a garden centre", "at the same garden centre", range(4, 14, 0.5), range(1, 4, 0.25)),
  purchase("PAINT_BRUSH_ROLLER", ["paint brush", "paint roller"], ["paint brushes", "paint rollers"], "at a DIY store", "at the same DIY store", range(2, 7, 0.5), range(3, 9, 0.5)),
  purchase("GIFT_BAG_CARD", ["gift bag", "greeting card"], ["gift bags", "greeting cards"], "at a gift shop", "at the same gift shop", range(1.5, 4.5, 0.25), range(1, 3.5, 0.25)),
  purchase("TSHIRT_CAP", ["T-shirt", "cap"], ["T-shirts", "caps"], "at a sports shop", "at the same sports shop", range(8, 24, 1), range(6, 18, 1)),
  purchase("CANDLE_DIFFUSER", ["candle", "reed diffuser"], ["candles", "reed diffusers"], "at a homeware shop", "at the same homeware shop", range(4, 14, 0.5), range(7, 20, 0.5)),
  purchase("PIZZA_GARLIC_BREAD", ["pizza", "garlic bread"], ["pizzas", "garlic breads"], "from a takeaway", "from the same takeaway", range(7, 15, 0.5), range(2.5, 6, 0.5)),

  // Fixed-mass contexts (15). Each shell represents standardised packs/loads
  // whose unit weights can credibly be treated as fixed within one question.
  mass("CEMENT_GRAVEL_BAGS", ["bag of cement", "bag of gravel"], ["bags of cement", "bags of gravel"], "onto a builder's van", "onto another van", range(15, 35, 5), range(10, 30, 5)),
  mass("SAND_STONE_BAGS", ["bag of sand", "bag of decorative stone"], ["bags of sand", "bags of decorative stone"], "onto a delivery truck", "onto another delivery truck", range(15, 30, 5), range(10, 25, 5)),
  mass("COMPOST_TOPSOIL_BAGS", ["bag of compost", "bag of topsoil"], ["bags of compost", "bags of topsoil"], "onto a garden-centre trolley", "onto another trolley", range(10, 25, 5), range(15, 35, 5)),
  mass("FLOUR_SUGAR_SACKS", ["sack of flour", "sack of sugar"], ["sacks of flour", "sacks of sugar"], "onto a bakery pallet", "onto another pallet", range(10, 30, 5), range(10, 25, 5)),
  mass("POTATO_ONION_SACKS", ["sack of potatoes", "sack of onions"], ["sacks of potatoes", "sacks of onions"], "onto a market trailer", "onto another market trailer", range(15, 35, 5), range(10, 30, 5)),
  mass("APPLE_PEAR_CRATES", ["crate of apples", "crate of pears"], ["crates of apples", "crates of pears"], "onto a farm van", "onto another farm van", range(10, 25, 5), range(10, 25, 5)),
  mass("TILE_ADHESIVE_PACKS", ["box of tiles", "bag of adhesive"], ["boxes of tiles", "bags of adhesive"], "onto a tradesperson's van", "onto another van", range(12, 30, 2), range(5, 15, 1)),
  mass("PAPER_ENVELOPE_BOXES", ["box of printer paper", "box of envelopes"], ["boxes of printer paper", "boxes of envelopes"], "onto an office storeroom trolley", "onto another trolley", range(10, 20, 2), range(4, 10, 2)),
  mass("SEALED_TOOL_FIXING_CRATES", ["tool kit", "box of fixings"], ["tool kits", "boxes of fixings"], "onto a workshop trolley", "onto another trolley", range(12, 30, 2), range(4, 14, 2)),
  mass("RICE_LENTIL_SACKS", ["sack of rice", "sack of lentils"], ["sacks of rice", "sacks of lentils"], "onto a storeroom pallet", "onto another pallet", range(10, 30, 5), range(10, 25, 5)),
  mass("PLASTER_MORTAR_BAGS", ["bag of plaster", "bag of mortar"], ["bags of plaster", "bags of mortar"], "onto a builder's trolley", "onto another trolley", range(10, 25, 5), range(10, 25, 5)),
  mass("BOTTLED_WATER_SOFT_DRINK_CASES", ["case of bottled water", "case of soft drinks"], ["cases of bottled water", "cases of soft drinks"], "onto a catering stock trolley", "onto another trolley", range(8, 20, 2), range(6, 18, 2)),
  mass("PAVING_EDGING_STACKS", ["stack of paving slabs", "stack of edging blocks"], ["stacks of paving slabs", "stacks of edging blocks"], "onto a lorry", "onto another lorry", range(120, 360, 20), range(80, 240, 20), ["P2"]),
  mass("TIMBER_POST_BUNDLES", ["bundle of timber boards", "bundle of fence posts"], ["bundles of timber boards", "bundles of fence posts"], "onto a builders' merchant lorry", "onto another lorry", range(40, 120, 10), range(30, 100, 10)),
  mass("PETFOOD_LITTER_BAGS", ["bag of dog food", "bag of cat litter"], ["bags of dog food", "bags of cat litter"], "onto a pet-shop trolley", "onto another trolley", range(10, 25, 5), range(5, 15, 5)),

  // Resource-use contexts (15).
  resource("CLOAK_DRESS_FABRIC", ["cloak", "dress"], ["cloaks", "dresses"], "is making costumes for a school production", "makes", "fabric", "area", "m²", "square metres", range(1.2, 3.5, 0.1), range(1.2, 3.5, 0.1)),
  resource("CURTAIN_CUSHION_FABRIC", ["curtain", "cushion cover"], ["curtains", "cushion covers"], "is sewing soft furnishings", "sews", "fabric", "area", "m²", "square metres", range(1.2, 4, 0.1), range(0.4, 1.5, 0.1)),
  resource("FLAG_BANNER_FABRIC", ["flag", "banner"], ["flags", "banners"], "is making decorations for a community event", "makes", "fabric", "area", "m²", "square metres", range(0.6, 2, 0.1), range(1.5, 4.5, 0.1)),
  resource("SKIRT_JACKET_FABRIC", ["skirt", "jacket"], ["skirts", "jackets"], "is making clothes for a fashion project", "makes", "fabric", "area", "m²", "square metres", range(0.8, 2, 0.1), range(1.5, 3.5, 0.1)),
  resource("TABLECLOTH_APRON_FABRIC", ["tablecloth", "apron"], ["tablecloths", "aprons"], "is sewing items for a catering company", "sews", "fabric", "area", "m²", "square metres", range(1.5, 4, 0.1), range(0.6, 1.8, 0.1)),
  resource("QUILT_PILLOWCASE_FABRIC", ["quilt cover", "pillowcase"], ["quilt covers", "pillowcases"], "is sewing bedding", "sews", "fabric", "area", "m²", "square metres", range(2, 5, 0.1), range(0.5, 1.4, 0.1)),
  resource("DRAWSTRING_BAG_PENCIL_CASE_FABRIC", ["drawstring bag", "pencil case"], ["drawstring bags", "pencil cases"], "is making fabric items for a school project", "makes", "fabric", "area", "m²", "square metres", range(0.5, 1.5, 0.1), range(0.3, 1, 0.1)),
  resource("SPORTS_BIB_TEAM_FLAG_FABRIC", ["sports bib", "team flag"], ["sports bibs", "team flags"], "is making fabric items for a sports club", "makes", "fabric", "area", "m²", "square metres", range(0.4, 1.0, 0.1), range(0.6, 1.6, 0.1)),
  resource("NOTICEBOARD_DISPLAY_FELT", ["noticeboard", "display panel"], ["noticeboards", "display panels"], "is covering display boards for a school", "covers", "felt", "area", "m²", "square metres", range(1, 3.5, 0.1), range(0.8, 2.8, 0.1)),
  resource("SHELF_STOOL_TIMBER", ["shelf unit", "stool"], ["shelf units", "stools"], "is building furniture for a workshop", "builds", "timber", "length", "m", "metres", range(2, 6, 0.1), range(1.5, 4, 0.1)),
  resource("PICTURE_MIRROR_FRAME_TIMBER", ["picture frame", "mirror frame"], ["picture frames", "mirror frames"], "is making wooden frames", "makes", "timber", "length", "m", "metres", range(0.8, 2.5, 0.1), range(1.2, 3.5, 0.1)),
  resource("GATE_FENCE_PANEL_TIMBER", ["garden gate", "fence panel"], ["garden gates", "fence panels"], "is building timber fencing", "builds", "timber", "length", "m", "metres", range(3, 7, 0.1), range(2, 6, 0.1)),
  resource("PLANTER_BENCH_TIMBER", ["planter", "bench"], ["planters", "benches"], "is building outdoor furniture for a community garden", "builds", "timber", "length", "m", "metres", range(2, 5, 0.1), range(4, 8, 0.1)),
  resource("GARLAND_WREATH_RIBBON", ["garland", "wreath"], ["garlands", "wreaths"], "is making decorations for a hall", "makes", "ribbon", "length", "m", "metres", range(1.5, 4, 0.1), range(0.8, 2.5, 0.1)),
  resource("MODEL_BRIDGE_TOWER_WIRE", ["model bridge", "model tower"], ["model bridges", "model towers"], "is making models for a technology project", "makes", "wire", "length", "m", "metres", range(1.5, 4.5, 0.1), range(1, 3.5, 0.1)),
];

export const A8_CONTEXT_POOL_SIZE = A8_CONTEXT_SHELLS.length;

export const contextShellsFor = (
  paper: A8GeneratorPaper,
  derivedTotal: boolean,
): A8ContextShell[] => A8_CONTEXT_SHELLS.filter(
  (shell) => shell.papers.includes(paper) && (!derivedTotal || shell.supportsDerivedTotal),
);