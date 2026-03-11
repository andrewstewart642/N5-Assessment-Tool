import type {
  ConceptGeneratorModule,
  GeneratorContext,
  GeneratedQuestionData,
} from "@/shared-types/QuestionGenerationTypes";

function gcd(a:number,b:number):number{
  while(b!==0){
    const t=b;
    b=a%b;
    a=t;
  }
  return a;
}

function reduce(n:number,d:number){
  const g=gcd(n,d);
  return [n/g,d/g];
}

function generate():GeneratedQuestionData{

  const a=Math.floor(Math.random()*8)+1;
  const b=Math.floor(Math.random()*8)+2;

  const c=Math.floor(Math.random()*8)+1;
  const d=Math.floor(Math.random()*8)+2;

  const numerator=a*d + c*b;
  const denominator=b*d;

  const [rn,rd]=reduce(numerator,denominator);

  return{
    prompt:`Calculate ${a}/${b} + ${c}/${d}.`,
    answer:`${rn}/${rd}`,
    marks:2
  };
}

export const FractionsModule:ConceptGeneratorModule={

  metadata:{
    calculatorStatus:"NonCalculatorOnly",
    paperSuitability:"P1",
    typicalStructureTypes:["FractionArithmetic"]
  },

  canHandle(code:string){
    return code==="N5.1";
  },

  generate
};

export default FractionsModule;