import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { SimulationGUI, SimulationParameter} from 'src/app/shared/interfaces/simulation-gui';
import { ImgDataService } from '../../websocket/img-data.service';
import{Subject} from 'rxjs'

@Component({
  selector: 'app-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./side-bar.component.scss', './simulations.component.scss']
})
export class SimulationsComponent implements OnInit {
  
  // @Input() algorithms: SimulationGUI[];

  public selectedParameters : any = undefined;
  public selectedAlgorithm : SimulationGUI = undefined;
  
  public setAlgorithm(algorithm : any) : void {
    // this.selectedParameters = parameters;
    this.selectedAlgorithm = algorithm;
    this.imgService.selectedAlgorithm = algorithm;
    console.log(this.selectedAlgorithm);
  }

  public train(){
    console.log(this.selectedAlgorithm)
    this.imgService.trainNet()
  }

  test(){
    this.imgService.testNet()
  }

  constructor(private imgService: ImgDataService) { }

  ngOnInit() {
  }


  public algorithms : SimulationGUI[] = [
    {
      name: "Adaline",
      parameters: [
        {
          label: "Inicialização dos pesos",
          id:"initWeightsMode.name",
          value: 'random',
          input: "select",
          options: ['random', 'zeros'],
          button: null
        },
        {
          label: "Limite inicialização randômica",
          id:"initWeightsMode.wLimit",
          value: 0.1,
          input: "text",
          button: null
        },
        {
          label: "Theta",
          id:"theta",
          value: 0,
          input: "text",
          button: null
        },
        {
          label: "Taxa de aprendizado",
          id:"learningRate",
          value: 0.01,
          input: "text",
          button: null
        },
        {
          label: "Época máxima",
          id:"maxEpoch",
          value: 100,
          input: "text",
          button: null
        },
        {
          label: "Mudança mínima nos pesos",
          id:"dwAbsMin",
          value: 0.0001,
          input: "text",
          button: null
        }
      ]
    },
    {
      name: "Perceptron",
      parameters: [
        {
          label: "Inicialização dos pesos",
          id:"initWeightsMode.name",
          value: 'random',
          input: "select",
          options: ['random', 'zeros'],
          button: null
        },
        {
          label: "Limite inicialização randômica",
          id:"initWeightsMode.wLimit",
          value: 0.1,
          input: "text",
          button: null
        },
        {
          label: "Theta",
          id:"theta",
          value: 0,
          input: "text",
          button: null
        },
        {
          label: "Taxa de aprendizado",
          id:"learningRate",
          value: 1,
          input: "text",
          button: null
        }
      ]
    },
    
  ];

}
