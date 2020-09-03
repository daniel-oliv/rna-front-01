import { Dataset } from '../interfaces/dataset';

export function generateTargets(dataset: Dataset){
  const dsLen = dataset.data.length;
  for (let i = 0; i < dataset.data.length; i++) {
    const datum = dataset.data[i];
    datum.targetVector = Array(dsLen).fill(-1);
    datum.targetVector[i]=1;
  }
}