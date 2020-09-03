import { Injectable } from '@angular/core';
import { WebsocketService } from './subject-websocket.service';
import { Dataset } from 'src/app/shared/interfaces/dataset';

@Injectable({
  providedIn: 'root'
})
export class ImgDataService {

  private readonly url = '/img-char-data' as const;

  constructor(

  private wsService: WebsocketService

  ) {  }

  saveDataset(dataset: Dataset){
    const completeURL = this.url+'/dataset';
    const params = {dataset};
    this.wsService.post(completeURL, params);
  }


}
