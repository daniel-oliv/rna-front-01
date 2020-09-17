export interface AnnParams{
  type: AnnType;
  epoch: number;
  nInputs: number; 
  nOutputs: number; 
  initWeightsMode: InitWeightsMode;
  learningRate: number;
  theta?: number;
  setsLength: SetsLength
}

export type AnnType = 'Perceptron' | 'Adaline' | 'Sigmoid Perceptron';

export interface AdalineParams extends AnnParams{
  maxEpoch: number;
  dwAbsMin: number;
}

export interface SigmoidPerceptronParams extends AnnParams{
  type: 'Sigmoid Perceptron'
  sigma; // = 1
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

export interface SetsLength{
  train: number
  test: number
  validation: number
}