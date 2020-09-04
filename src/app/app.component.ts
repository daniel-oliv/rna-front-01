import { Component } from '@angular/core';
import { ImgCharDatum } from './shared/interfaces/image-digit-datum';
import { Dataset } from './shared/interfaces/dataset';
import { ImgDataService } from './shared/websocket/img-data.service';
import { generateTargets } from './shared/helpers/dataset';
import {hpOnce} from 'src/app/shared/helpers/observable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rna-front';
  datasets: Dataset[] = [];
  selectedDataset: Dataset;

  criandoDataset = false;
  startedDataset: Dataset;
  newName: string;
  result: string;

  netDataset: Dataset;
  theta: number = 0;
  leaningRate: number = 1;

  constructor(

  private imgService:  ImgDataService
  
  ){}

  ngOnInit(){
    //TODO baixar datasets do back
    this.imgService.getAllDataset((datasets)=>{console.log('datasets.length ', datasets.length);this.datasets = datasets})
  }

  mostrarDataset(event){
    // TODO fazer component que mostra imagens (ngFor com img) 
  }

  treinar(e){
    this.imgService.trainNet((res)=>{this.result = res;console.log('treinar ', res)},
    this.netDataset.id, this.theta, this.leaningRate)
  }

  testar(e){
    this.imgService.testNet((res)=>{this.result = res;console.log('treinar ', res)}, 
    this.netDataset.id,this.theta)
  }

  criarDataset(event){
    console.log('criarDataset ', this.newName);
    if(this.newName){
      this.criandoDataset = true;
      this.startedDataset = {
        id: this.newName,
        data: []
      }
      this.selectedDataset = undefined;
    }
  }

  saveDataset(event){
    if(this.startedDataset){
      generateTargets(this.startedDataset)
      this.datasets.push(this.startedDataset);
      console.log('saveDataset ',  this.startedDataset);
      // TODO MANDAR PARA O BACK SALVAR O DATASET
      hpOnce(this.imgService.saveDataset(this.startedDataset),
      (value)=>{this.result = value, console.log('value ', value);},
      (err)=>{console.log('saveDataset() err ', err);}
      )
      this.criandoDataset = false;
      this.startedDataset = undefined
      // this.selectedDataset = undefined;
    }
  }

  addDatum(e){
    console.log('addDatum ', e);
    if(this.startedDataset)this.startedDataset.data.push(e);
    else if(this.selectedDataset)this.selectedDataset.data.push(e);
  }

}
