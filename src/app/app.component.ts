import { Component } from '@angular/core';
import { ImageDigitDatum } from './utils/drawing-square/image-digit-datum';
import { Dataset } from './utils/drawing-square/dataset';

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

  ngOnInit(){
    //TODO baixar datasets do back
  }

  mostrarDataset(event){
    // TODO fazer component que mostra imagens (ngFor com img) 
  }

  criarDataset(event){
    if(this.newName){
      // console.log('name ', this.newName);
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
      // console.log('name ', this.newName);
      this.datasets.push(this.startedDataset);
      this.criandoDataset = false;
      this.startedDataset = undefined
      this.selectedDataset = undefined;
      // TODO MANDAR PARA O BACK SALVAR O DATASET
    }
  }

  addDatum(e){
    console.log('addDatum ', e);
    this.selectedDataset.data.push(e);
  }

}
