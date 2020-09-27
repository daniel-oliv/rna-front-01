import { Component, OnInit} from '@angular/core';
import { SimulationGUI, SimulationParameter} from 'src/app/shared/interfaces/simulation-gui';
import { ANNService } from '../../websocket/ann.service';
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

  public trainTest(){
    console.log(this.selectedAlgorithm)
    this.imgService.trainTest()
  }

  public trainCrossValidation(){
    console.log(this.selectedAlgorithm)
    this.imgService.trainCrossValidation()
  }

  isNewDataset(){
    const newDatasets = ['sonar', 'iris']
    if(!this.imgService.netDataset){
      return false;
    }
    return newDatasets.includes(this.imgService.netDataset.id)
  }

  test(){
    this.imgService.testNet()
  }

  constructor(public imgService: ANNService) { }

  ngOnInit() {
  }


  public algorithms : SimulationGUI[] = [
    {
      name: 'Two Layer Perceptron',
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
          label: "Sigma hidden layer",
          id:"hiddenSigma",
          value: 0.9,
          input: "text",
          button: null
        },
        {
          label: "Sigma output layer",
          id:"outSigma",
          value: 0.9,
          input: "text",
          button: null
        },
        {
          label: "Neurônios na camada escondida",
          id:"numHiddenNeurons",
          value: 2,
          input: "text",
          button: null
        },
        {
          label: "Taxa de aprendizado",
          id:"learningRate",
          value: 0.1,
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
          value: 0.000001,
          input: "text",
          button: null
        },
        {
          label: "Training Set Length",
          id:"setsLength.train",
          value: 120,
          input: "text",
          button: null
        },
        {
          label: "Test Set Length",
          id:"setsLength.test",
          value: 30,
          input: "text",
          button: null
        },
        {
          label: "Validation Set Length",
          id:"setsLength.validation",
          value: 30,
          input: "text",
          button: null
        },
      ]
    },
    {
      name: 'Sigmoid Perceptron',
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
          label: "Sigma",
          id:"sigma",
          value: 0.1,
          input: "text",
          button: null
        },
        {
          label: "Taxa de aprendizado",
          id:"learningRate",
          value: 0.04,
          input: "text",
          button: null
        },
        {
          label: "Época máxima",
          id:"maxEpoch",
          value: 300,
          input: "text",
          button: null
        },
        {
          label: "Mudança mínima nos pesos",
          id:"dwAbsMin",
          value: 0.000001,
          input: "text",
          button: null
        },
        {
          label: "Training Set Length",
          id:"setsLength.train",
          value: 147,
          input: "text",
          button: null
        },
        {
          label: "Test Set Length",
          id:"setsLength.test",
          value: 41,
          input: "text",
          button: null
        },
        {
          label: "Validation Set Length",
          id:"setsLength.validation",
          value: 20,
          input: "text",
          button: null
        },
      ]
    },
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
