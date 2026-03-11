import type {
  ConceptGeneratorModule,
  GeneratorContext,
  GeneratedQuestionData,
} from "@/shared-types/QuestionGenerationTypes";

function generate(): GeneratedQuestionData {

  const bases = [4,9,16,25,36];
  const base = bases[Math.floor(Math.random()*bases.length)];

  const power = [1/2,3/2][Math.floor(Math.random()*2)];

  const answer = Math.pow(base,power);

  return {
    prompt:`Evaluate ${base}^(${power}).`,
    answer:`${answer}`,
    marks:3
  };
}

export const FractionalIndicesModule: ConceptGeneratorModule = {

  metadata:{
    calculatorStatus:"NonCalculatorOnly",
    paperSuitability:"P1",
    typicalStructureTypes:["FractionalIndexEvaluation"]
  },

  canHandle(code:string){
    return code==="N2.4";
  },

  generate
};

export default FractionalIndicesModule;