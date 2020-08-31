import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HebbRuleService {
  public nInputs;
  private dataLength;
  constructor(
    ) { }

  public trainAllLogicFunctions(nInputs = 2){
    this.nInputs = nInputs;
    this.dataLength = Math.pow(2,nInputs);
    
  }
  public verify(){

  }
}
