import { Injectable } from '@angular/core';
import { WebsocketService } from './subject-websocket.service';
import { Dataset } from 'src/app/shared/interfaces/dataset';
import { hpOnce } from '../helpers/observable';

@Injectable({
  providedIn: 'root'
})
export class ImgDataService {

  private readonly url = '/img-char-data' as const;

  constructor(

  private wsService: WebsocketService

  ) {  }

  getAllDataset(func: Function){
    console.log('url ', this.url);
    const params = {res:'dataset'};
    let datasets = [];
    hpOnce(this.wsService.get(this.url, params),
    (value)=>{
      console.log('value ', value);
      if(value.body) datasets = value.body;
      func(datasets)
    },
    (err)=>{console.log('saveDataset() err ', err);}
    )
  }

  trainNet(func: Function, datasetID:string , theta:number, learningRate:number){
    console.log('url ', this.url);
    const params = {res:'trainNet',theta, learningRate, datasetID};
    let res;
    hpOnce(this.wsService.post(this.url, params),
    (value)=>{
      console.log('value ', value);
      if(value) res = value;
      func(res)
    },
    (err)=>{console.log('saveDataset() err ', err);}
    )
  }

  testNet(func: Function, datasetID:string , theta?){
    console.log('url ', this.url);
    const params = {res:'testNet',datasetID, theta};
    let res;
    hpOnce(this.wsService.post(this.url, params),
    (value)=>{
      console.log('value ', value);
      if(value.body) res = value.body;
      func(res)
    },
    (err)=>{console.log('saveDataset() err ', err);}
    )
  }

  saveDataset(dataset: Dataset){
    console.log('url ', this.url);
    const params = {dataset, res:'dataset'};
    return this.wsService.post(this.url, params);
  }


}
