import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";

import type {
  A8GeneratedContext,
  A8GeneratorFamily,
  A8GeneratorPaper,
} from "./Types";

const formatNumber = (value: number) =>
  Number.isInteger(value)
    ? `${value}`
    : value.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");

const textPart = (value: string): PaperPart => ({ kind: "text", value });

const singularOrPlural = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

const promptValue = (context: A8GeneratedContext, value: number) => {
  if (context.unitDimension === "currency") return `£${value.toFixed(2)}`;
  const numeric = context.displayDecimals > 0
    ? formatNumber(value)
    : `${Math.round(value)}`;
  return `${numeric} ${context.unitPromptLabel}`;
};

const equationCommand = (variant: number, second: boolean) => {
  const firstChoices = [
    "Write down an equation to represent this information.",
    "Write down an equation which represents this information.",
  ];
  const secondChoices = [
    "Write down a second equation to represent this information.",
    "Write down a second equation which represents this information.",
  ];
  const choices = second ? secondChoices : firstChoices;
  return choices[variant % choices.length];
};

const finalSolveCommand = (context: A8GeneratedContext, paper: A8GeneratorPaper) => {
  const [firstItem, secondItem] = context.itemLabels;
  const algebraicWord = paper === "P2" ? " algebraically" : "";

  if (context.contextKind === "PURCHASE") {
    return `Calculate${algebraicWord} the cost of one ${firstItem} and one ${secondItem}.`;
  }
  if (context.contextKind === "MASS") {
    return `Calculate${algebraicWord} the weight of one ${firstItem} and one ${secondItem}.`;
  }
  return `Calculate${algebraicWord} the amount of ${context.resourceLabel} needed for one ${firstItem} and one ${secondItem}.`;
};

const onSetting = (setting: string) => setting.replace(/^onto\s+/, "on ");

const infinitiveVerb = (verb: string) => {
  const known: Record<string, string> = {
    makes: "make",
    sews: "sew",
    covers: "cover",
    builds: "build",
  };
  return known[verb] ?? verb.replace(/s$/, "");
};

const COMMON_NAME_MAP: Record<string, string> = {
  Amina: "Aisha",
  Ben: "Ben",
  Cara: "Chloe",
  Dylan: "Daniel",
  Eva: "Emily",
  Fraser: "Jack",
  Hana: "Isla",
  Imran: "Ali",
  Jenna: "Lucy",
  Kai: "Leo",
  Leah: "Mia",
  Murray: "Noah",
  Nadia: "Olivia",
  Owen: "Oliver",
  Priya: "Priya",
  Ravi: "Ryan",
  Sofia: "Sophie",
  Tariq: "Sam",
  Una: "Amelia",
  Vikram: "Jamie",
  Yasmin: "Ava",
  Zara: "Yusuf",
};

const commonName = (name: string) => COMMON_NAME_MAP[name] ?? name;

export type A8ContextPromptBuild = {
  prompt: string;
  promptParts: PaperPart[];
  sections: { label: "a" | "b" | "c"; text: string; marks: number }[];
  promptStructureId: string;
};

export const buildA8ContextualPrompt = (args: {
  context: A8GeneratedContext;
  variables: [string, string];
  family: A8GeneratorFamily;
  paper: A8GeneratorPaper;
  names: [string, string, string];
}): A8ContextPromptBuild => {
  const { context, family, paper, names } = args;
  const [rawName1, rawName2, rawName3] = names;
  const name1 = commonName(rawName1);
  const name2 = commonName(rawName2);
  const name3 = commonName(rawName3);
  const [item1, item2] = context.itemLabels;
  const [item1Plural, item2Plural] = context.itemPluralLabels;
  const firstItems = `${singularOrPlural(context.firstCounts[0], item1, item1Plural)} and ${singularOrPlural(context.firstCounts[1], item2, item2Plural)}`;
  const secondItems = `${singularOrPlural(context.secondCounts[0], item1, item1Plural)} and ${singularOrPlural(context.secondCounts[1], item2, item2Plural)}`;
  const firstTotal = promptValue(context, context.firstTotal);
  const secondTotal = promptValue(context, context.secondTotal);
  const variant = context.wordingVariant % 6;
  const firstCommand = equationCommand(variant, false);
  const secondCommand = equationCommand(variant + 1, true);
  let firstBlock = "";
  let secondBlock = "";
  let finalBlock = "";
  let promptStructureId = "";

  if (family === "CONTEXT_DERIVED_TOTAL") {
    const thirdCounts = context.derivedCounts ?? [2, 3];
    const thirdItems = `${singularOrPlural(thirdCounts[0], item1, item1Plural)} and ${singularOrPlural(thirdCounts[1], item2, item2Plural)}`;

    if (variant % 2 === 0) {
      promptStructureId = "DERIVED_NAMED_LORRIES_NO_VARIABLE_LEAD";
      firstBlock = `${name1} loads ${firstItems} ${context.settingLabel}.\nTogether they weigh ${firstTotal}.\n(a) ${firstCommand}`;
      secondBlock = `${name2} loads ${secondItems} ${context.sameSettingLabel}.\nTogether they weigh ${secondTotal}.\n(b) ${secondCommand}`;
      finalBlock = `${name3} has ${thirdItems} on a third lorry.\n(c) Calculate the total weight of these items.`;
    } else {
      promptStructureId = "DERIVED_THREE_LORRIES_COMPACT";
      firstBlock = `${name1} has ${firstItems} ${onSetting(context.settingLabel)}.\nTogether they weigh ${firstTotal}.\n(a) ${firstCommand}`;
      secondBlock = `${name2} has ${secondItems} ${onSetting(context.sameSettingLabel)}.\nTogether they weigh ${secondTotal}.\n(b) ${secondCommand}`;
      finalBlock = `A third lorry carries ${thirdItems}.\n(c) Calculate the total weight of this load.`;
    }
  } else if (context.contextKind === "PURCHASE") {
    switch (variant) {
      case 0:
        promptStructureId = "PURCHASE_PAY_TOTAL_FIRST";
        firstBlock = `${name1} pays ${firstTotal} for ${firstItems} ${context.settingLabel}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} pays ${secondTotal} for ${secondItems} ${context.sameSettingLabel}.\n(b) ${secondCommand}`;
        break;
      case 1:
        promptStructureId = "PURCHASE_COUNTS_THEN_COST";
        firstBlock = `${name1} buys ${firstItems} ${context.settingLabel}.\nThe total cost is ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} buys ${secondItems} ${context.sameSettingLabel}.\nThe total cost is ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 2:
        promptStructureId = "PURCHASE_SAME_CUSTOMER_TWO_VISITS";
        firstBlock = `${name1} buys ${firstItems} ${context.settingLabel} for ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `On another visit, ${name1} buys ${secondItems} ${context.sameSettingLabel} for ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 3:
        promptStructureId = "PURCHASE_COST_SENTENCE_COMPACT";
        firstBlock = `The cost of ${firstItems} ${context.settingLabel} is ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `The cost of ${secondItems} ${context.sameSettingLabel} is ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 4:
        promptStructureId = "PURCHASE_SECOND_RELATIONSHIP_IN_PART_B";
        firstBlock = `${name1} buys ${firstItems} ${context.settingLabel}. They cost ${firstTotal} altogether.\n(a) ${firstCommand}`;
        secondBlock = `(b) ${name2} buys ${secondItems} ${context.sameSettingLabel} for ${secondTotal}.\n${secondCommand}`;
        break;
      default:
        promptStructureId = "PURCHASE_TWO_CUSTOMERS_COMPACT";
        firstBlock = `${name1} spends ${firstTotal} on ${firstItems} ${context.settingLabel}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} spends ${secondTotal} on ${secondItems} ${context.sameSettingLabel}.\n(b) ${secondCommand}`;
        break;
    }
    finalBlock = `(c) ${finalSolveCommand(context, paper)}`;
  } else if (context.contextKind === "MASS") {
    switch (variant) {
      case 0:
        promptStructureId = "MASS_NAMED_LOADING";
        firstBlock = `${name1} loads ${firstItems} ${context.settingLabel}.\nTogether they weigh ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} loads ${secondItems} ${context.sameSettingLabel}.\nTogether they weigh ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 1:
        promptStructureId = "MASS_VISIBLE_VEHICLE";
        firstBlock = `There are ${firstItems} ${onSetting(context.settingLabel)}.\nTogether they weigh ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `There are ${secondItems} ${onSetting(context.sameSettingLabel)}.\nTogether they weigh ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 2:
        promptStructureId = "MASS_NAMED_CARRYING";
        firstBlock = `${name1} has ${firstItems} ${onSetting(context.settingLabel)}.\nTheir total weight is ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} has ${secondItems} ${onSetting(context.sameSettingLabel)}.\nTheir total weight is ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 3:
        promptStructureId = "MASS_TRANSPORT_RELATIONSHIPS";
        firstBlock = `${name1} is transporting ${firstItems} ${onSetting(context.settingLabel)}.\nTogether they weigh ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} is transporting ${secondItems} ${onSetting(context.sameSettingLabel)}.\nTogether they weigh ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 4:
        promptStructureId = "MASS_SECOND_RELATIONSHIP_IN_PART_B";
        firstBlock = `${name1} loads ${firstItems} ${context.settingLabel}.\nTheir total weight is ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `(b) ${name2} loads ${secondItems} ${context.sameSettingLabel}.\nTheir total weight is ${secondTotal}.\n${secondCommand}`;
        break;
      default:
        promptStructureId = "MASS_SAME_PERSON_TWO_JOURNEYS";
        firstBlock = `${name1} loads ${firstItems} ${context.settingLabel}.\nTogether they weigh ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `On another journey, ${name1} has ${secondItems} ${onSetting(context.sameSettingLabel)}.\nTogether they weigh ${secondTotal}.\n(b) ${secondCommand}`;
        break;
    }
    finalBlock = `(c) ${finalSolveCommand(context, paper)}`;
  } else {
    const verb = context.activityVerb ?? "makes";
    const infinitive = infinitiveVerb(verb);
    switch (variant) {
      case 0:
        promptStructureId = "RESOURCE_DIRECT_TWO_RELATIONSHIPS";
        firstBlock = `${name1} ${verb} ${firstItems}.\nThis uses ${firstTotal} of ${context.resourceLabel}.\n(a) ${firstCommand}`;
        secondBlock = `${name1} ${verb} ${secondItems}.\nThis uses ${secondTotal} of ${context.resourceLabel}.\n(b) ${secondCommand}`;
        break;
      case 1:
        promptStructureId = "RESOURCE_TWO_DAYS";
        firstBlock = `On Monday, ${name1} ${verb} ${firstItems}.\nThis uses ${firstTotal} of ${context.resourceLabel}.\n(a) ${firstCommand}`;
        secondBlock = `On Tuesday, ${name1} ${verb} ${secondItems}.\nThis uses ${secondTotal} of ${context.resourceLabel}.\n(b) ${secondCommand}`;
        break;
      case 2:
        promptStructureId = "RESOURCE_AMOUNT_FIRST";
        firstBlock = `${name1} uses ${firstTotal} of ${context.resourceLabel} to ${infinitive} ${firstItems}.\n(a) ${firstCommand}`;
        secondBlock = `${name1} uses ${secondTotal} of ${context.resourceLabel} to ${infinitive} ${secondItems}.\n(b) ${secondCommand}`;
        break;
      case 3:
        promptStructureId = "RESOURCE_TWO_PEOPLE";
        firstBlock = `${name1} ${verb} ${firstItems}.\nThe amount of ${context.resourceLabel} used is ${firstTotal}.\n(a) ${firstCommand}`;
        secondBlock = `${name2} ${verb} ${secondItems}.\nThe amount of ${context.resourceLabel} used is ${secondTotal}.\n(b) ${secondCommand}`;
        break;
      case 4:
        promptStructureId = "RESOURCE_SECOND_RELATIONSHIP_IN_PART_B";
        firstBlock = `${name1} ${verb} ${firstItems}, using ${firstTotal} of ${context.resourceLabel}.\n(a) ${firstCommand}`;
        secondBlock = `(b) On another occasion, ${name1} ${verb} ${secondItems}, using ${secondTotal} of ${context.resourceLabel}.\n${secondCommand}`;
        break;
      default:
        promptStructureId = "RESOURCE_REQUIREMENT_STATEMENTS";
        firstBlock = `${name1} ${verb} ${firstItems}.\nThis requires ${firstTotal} of ${context.resourceLabel}.\n(a) ${firstCommand}`;
        secondBlock = `${name1} ${verb} ${secondItems}.\nThis requires ${secondTotal} of ${context.resourceLabel}.\n(b) ${secondCommand}`;
        break;
    }
    finalBlock = `(c) ${finalSolveCommand(context, paper)}`;
  }

  const prompt = [firstBlock, "", secondBlock, "", finalBlock]
    .join("\n")
    .replace(/^\n+|\n+$/g, "")
    .replace(/\n{3,}/g, "\n\n");

  return {
    prompt,
    promptParts: [textPart(prompt)],
    sections: [
      { label: "a", text: firstBlock, marks: 1 },
      { label: "b", text: secondBlock, marks: 1 },
      { label: "c", text: finalBlock, marks: 4 },
    ],
    promptStructureId,
  };
};
