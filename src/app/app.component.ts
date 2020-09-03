import { Component } from '@angular/core';
import { ImgCharDatum } from './shared/interfaces/image-digit-datum';
import { Dataset } from './shared/interfaces/dataset';
import { ImgDataService } from './shared/websocket/img-data.service';
import { generateTargets } from './shared/helpers/dataset';

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

  constructor(

  /* private imgService:  ImgDataService */
  
  ){}

  ngOnInit(){
    //TODO baixar datasets do back
  }

  mostrarDataset(event){
    // TODO fazer component que mostra imagens (ngFor com img) 
  }

  criarDataset(event){
    console.log('criarDataset ', this.newName);
    if(this.newName){
      this.criandoDataset = true;
      this.startedDataset = {
        id: this.newName,
        data: []
      }
      this.selectedDataset = this.startedDataset;
    }
  }

  saveDataset(event){
    if(this.startedDataset){
      generateTargets(this.startedDataset)
      this.datasets.push(this.startedDataset);
      console.log('saveDataset ',  this.startedDataset);
      // TODO MANDAR PARA O BACK SALVAR O DATASET
      // this.imgService.saveDataset(this.startedDataset)
      this.criandoDataset = false;
      this.startedDataset = undefined
      this.selectedDataset = undefined;
    }
  }

  addDatum(e){
    console.log('addDatum ', e);
    this.selectedDataset.data.push(e);
  }

}
