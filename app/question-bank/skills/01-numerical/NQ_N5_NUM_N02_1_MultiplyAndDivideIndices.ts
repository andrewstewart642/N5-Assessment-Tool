import type {
  ConceptGeneratorModule,
  GeneratorContext,
  GeneratedQuestionData,
} from "@/shared-types/QuestionGenerationTypes";

function generate(): GeneratedQuestionData {

  const variable = ["a","x","y"][Math.floor(Math.random()*3)];
  const m = Math.floor(Math.random()*6)+1;
  const n = Math.floor(Math.random()*6)+1;

  const multiply = Math.random() < 0.5;

  if(multiply){
    return {
      prompt:`Simplify ${variable}^${m} × ${variable}^${n}.`,
      answer:`${variable}^${m+n}`,
      marks:2
    };
  }

  return {
    prompt:`Simplify ${variable}^${m} ÷ ${variable}^${n}.`,
    answer:`${variable}^${m-n}`,
    marks:2
  };
}

export const MultiplyDivideIndicesModule: ConceptGeneratorModule = {

  metadata:{
    calculatorStatus:"NonCalculatorOnly",
    paperSuitability:"P1",
    typicalStructureTypes:["IndexLawSimplification"]
  },

  canHandle(code:string){
    return code==="N2.1";
  },

  generate
};

export default MultiplyDivideIndicesModule;