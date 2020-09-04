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
  showData = false; 

  constructor(

  private imgService:  ImgDataService
  
  ){}

  ngOnInit(){
    //TODO baixar datasets do back
    this.imgService.getAllDataset((datasets)=>{console.log('datasets.length ', datasets.length);this.datasets = datasets})
  }

  mostrarDataset(event){
    // TODO fazer component que mostra imagens (ngFor com img) 
    this.showData = !this.showData;

  }

  treinar(e){
    this.imgService.trainNet((res)=>{this.result = res;console.log('treinar ', res)},
    this.netDataset.id, this.theta, this.leaningRate)
  }

  testar(e){
    this.imgService.testNet((res)=>{this.result = res;console.log('treinar ', res)}, 
    this.netDataset.id,this.theta)
  }

  copiarDataset(e){
    console.log('copiarDataset ', this.newName);
    if(this.newName){
      this.startedDataset= {id: this.newName, data:this.selectedDataset.data.concat()}
      this.selectedDataset = this.startedDataset;
      this.saveDataset(undefined)
      this.newName='';
    }
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
      for (let i = 0; i < this.datasets.length; i++) {
        if(this.datasets[i].id === this.startedDataset.id){
          break;
        }
        if(i === this.datasets.length-1){
          this.datasets.push(this.startedDataset);
        }
      }
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
    let dataset: Dataset;
    if(this.startedDataset)dataset = this.startedDataset;
    else if(this.selectedDataset)dataset = this.selectedDataset;
    
    for (let i = 0; i < dataset.data.length; i++) {
      if(dataset.data[i].id === e.id){
        dataset.data.splice(i, 1, e);
        break;
      }
      if(i === dataset.data.length-1){
        dataset.data.push(e);
      }
    }

    if(this.selectedDataset){
      this.startedDataset = this.selectedDataset;
      this.saveDataset(undefined)
    }
  }

}
