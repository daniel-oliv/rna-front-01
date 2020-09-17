import { Component } from '@angular/core';
import { ImgCharDatum } from './shared/interfaces/image-digit-datum';
import { ImgCharDataset } from './shared/interfaces/dataset';
import { ANNService } from './shared/websocket/ann.service';
import { generateTargets } from './shared/helpers/dataset';
import {hpOnce} from 'src/app/shared/helpers/observable'
import {takeUntil} from 'rxjs/operators'
import { Subject } from 'rxjs';
import { LineChartSetConfig, Config } from './shared/components/chart/line-chart/line-chart.component';
import * as d3 from 'd3';
import { hourTick } from './shared/components/chart/tick-formatters';
import { randomInt } from './shared/helpers/common';
import { neatJSONArray } from './shared/helpers/object-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rna-front';
  datasets: ImgCharDataset[] = [];
  selectedDataset: ImgCharDataset;
  neatJSONArray= neatJSONArray
  criandoDataset = false;
  startedDataset: ImgCharDataset;
  newName: string;
  // result: string;

  // netDataset: Dataset;
  // theta: number = 0;
  // leaningRate: number = 1;
  showData = false; 

  private unsubscribe$ = new Subject();

  constructor(

  public imgService:  ANNService
  
  ){}

  ngOnInit(){
    // this.imgService.trainResult$.pipe(takeUntil(this.unsubscribe$))
    //TODO baixar datasets do back
    this.imgService.getAllDataset((datasets)=>{console.log('datasets.length ', datasets.length);this.datasets = datasets})
    
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    // setTimeout(() => {
    //   this.generateData();

    //   // change the data periodically
    //   setInterval(() => this.generateData(), 3000);
    // }, 8000);
  }

  // generateData() {
    
  //   for (const set of this.imgService.lineChartsSets.values()) {
  //     set.push(randomInt(6));
  //   }
  //   this.imgService.lineChartUpdate = !this.imgService.lineChartUpdate;
  //   console.log('lineChartUpdate ', this.imgService.lineChartUpdate);
  // }

  ngOnDestroy(){
    this.unsubscribe$.next(true);
  }


  mostrarDataset(event){
    // TODO fazer component que mostra imagens (ngFor com img) 
    this.showData = !this.showData;

  }

  // treinar(e){
  //   this.imgService.trainNet(
  //     (res)=>{this.result = res;console.log('treinar ', res)},
  //     this.netDataset.id)
  // }

  // testar(e){
  //   this.imgService.testNet((res)=>{this.result = res;console.log('treinar ', res)}, 
  //   this.netDataset.id,this.theta)
  // }

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
      (value)=>{this.imgService.result = value, console.log('value ', value);},
      (err)=>{console.log('saveDataset() err ', err);}
      )
      this.criandoDataset = false;
      this.startedDataset = undefined
      // this.selectedDataset = undefined;
    }
  }

  addDatum(e){
    console.log('addDatum ', e);
    let dataset: ImgCharDataset;
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

    if(!dataset.data.length){
      dataset.data.push(e);
    }

    console.log('this.startedDataset ', this.startedDataset);

    if(this.selectedDataset){
      this.startedDataset = this.selectedDataset;
      this.saveDataset(undefined)
    }
  }


  

}
