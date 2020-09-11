export interface AnnParams{
  type: AnnType;
  epoch: number;
  nInputs: number; 
  nOutputs: number; 
  initWeightsMode: InitWeightsMode;
  learningRate: number;
  theta: number;
}

export type AnnType = 'Perceptron' | 'Adaline';

export interface AdalineParams extends AnnParams{
  maxEpoch: number;
  dwAbsMin: number;
}

export interface TestResult{
  erros: number,
  notLearned: {
    id:(string|number)
    outs: number[];
  }[]
}

export interface InitWeightsMode{
  name: 'zeros' | 'random',
  params: any;
} 

export interface InitWeightsRandom{
  name: 'random',
  params: {
    initWLimit: number;
  };
} 