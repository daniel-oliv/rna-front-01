import { Injectable } from '@angular/core';
import { WebsocketService } from './subject-websocket.service';
import { Dataset, ImgCharDataset } from 'src/app/shared/interfaces/dataset';
import { hpOnce } from '../helpers/observable';
import { AnnParams } from '../interfaces/ann';
import { SimulationGUI } from '../interfaces/simulation-gui';
import { Subject } from 'rxjs';

import { LineChartSetConfig, Config } from 'src/app/shared/components/chart/line-chart/line-chart.component';
import * as d3 from 'd3';
import { hourTick, fixedNumOfTicks } from 'src/app/shared/components/chart/tick-formatters';
import { randomInt } from 'src/app/shared/helpers/common';
import { removeArr } from '../helpers/object-utils';

@Injectable({
  providedIn: 'root'
})
export class ANNService {

  private readonly url = '/img-char-data' as const;

  constructor(

  private wsService: WebsocketService

  ) {  }

  algorithms;
  selectedAlgorithm: SimulationGUI;
  netDataset: ImgCharDataset;
  trainResult$: Subject<any>;
  result: string;
  trainData = [];
  trainDataMap: Map<string, any>

  dumpData = JSON.parse('[["Weekday",["1.320923213442920","1.163667758463310","1.097100191888680","1.033386934048520","1.056588790197010","1.14226044295480","1.450652958448610","1.480990586433270","1.435830335367150","1.369262768792520","1.513998830016030","1.647133963165290","1.603768252739150","1.566111159781940","1.551655922973230","1.667481510579310","1.919663926341870","2.081709533108560","3.931697239798670","4.0591237554790","3.306349282607650","2.785225984948460","2.437565528993840","1.919296540069130"]],["Saturday",["1.376930485905060","1.257437974028210","1.126166079134830","1.063426244770220","1.049140610048060","1.063418362748330","1.166126870219260","1.474220864544470","1.448545708182220","1.525571177268990","1.628263920696130","1.508389429464750","1.548350220549180","1.589361324776320","1.793704380509780","1.747756432572990","2.134323952526020","2.325447450723820","3.894528101903710","3.764704263551370","3.271466045858830","2.583647070887450","2.178823843921780","1.800546919816650"]],["Sunday",["1.654352096065620","1.59203253409450","1.271275938773440","1.11034936301320","1.096766043506530","1.178354451227350","1.182955966630260","1.280339960878360","1.664544374351070","1.899098501189090","1.769864134523580","2.127941674482650","1.959174096158490","1.742748013530320","1.71440260031640","2.078077175837660","2.113268071456220","2.551805762955580","3.632852165256340","3.765433327802660","3.306498534373090","3.066202090592330","2.562004313920690","1.973828881145950"]]]')
  lineChartConfigs: Config[];
  lineChartSetsConfigs:LineChartSetConfig[][];
  lineChartsSets: Array< Map<string,any[]> >;
  lineChartUpdate = false;

  sonarSet: Dataset = {id:'sonar', data:[]};
  trainTestResult: {train: any, test:any}

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

  getAnnParams(algorithmData: SimulationGUI): AnnParams{
    let annParams = {};
    for (const param of algorithmData.parameters) {
      if(param.id.includes(".")){
        const keys = param.id.split('.')
        if(!annParams[keys[0]]){
          annParams[keys[0]] = {}
        }
        annParams[keys[0]][keys[1]] = param.value;
      }
      else{
        annParams[param.id] = param.value
      }
    }
    annParams['type'] = <AnnParams["type"]>algorithmData.name;
    return annParams as AnnParams;
  }

  resetResults(){
    this.result = undefined;
    this.trainTestResult = undefined;
    this.trainData = [];
    this.trainDataMap = undefined;
  }

  trainTest(){
    console.log('trainAndTest()');
    this.resetResults()
    if(this.selectedAlgorithm && this.netDataset && this.netDataset.id){
      console.log('url ', this.url);
      const annParams: AnnParams = this.getAnnParams(this.selectedAlgorithm)
      console.log('annParams ', annParams);
      const params = {
        res:'trainAndTestSonar',
        datasetID: this.netDataset.id,
        ann: annParams
      };
      this.wsService.getEventObs<any>(this.url, params, (res)=>{
        console.log('chegou ', res);
        if(res.test){ ///última mensagem
          this.trainTestResult = res
          res = res.train;
        }
        
        this.trainData.push(res)
        if(!this.trainDataMap){
          this.initGraphs(res)
        }else{
          this.updateGraphs()
        }
        
        // this.trainResult$.next(res)
      })
    }
  }

  trainNet(){
    console.log('trainNet()');
    this.resetResults()
    if(this.selectedAlgorithm && this.netDataset && this.netDataset.id){
      console.log('url ', this.url);
      const annParams: AnnParams = this.getAnnParams(this.selectedAlgorithm)
      console.log('annParams ', annParams);
      const params = {
        res:'trainNet',
        datasetID: this.netDataset.id,
        ann: annParams
      };
      this.wsService.getEventObs<any>(this.url, params, (res)=>{
        console.log('chegou ', res);
        this.trainData.push(res)
        if(!this.trainDataMap){
          this.initGraphs(res)
        }else{
          this.updateGraphs()
        }
        // this.trainResult$.next(res)
      })
    }
  }

  initGraphs(res){
    const graphKeys = Object.keys(res);
    removeArr('epoch',graphKeys);
    this.trainDataMap = new Map();
    this.lineChartConfigs = [];
    this.lineChartSetsConfigs = [];
    this.lineChartsSets = [];
    for (const key of graphKeys) {
      if(key === 'epoch') continue;
      this.trainDataMap.set(key, this.trainData);
      this.lineChartConfigs.push({
        boundHeight: 300,
        boundWidth: 500,
        xScale: d3.scaleLinear().nice(),//d3.scaleTime(),
        yScale: d3.scaleLinear().nice(),
        labelX: 'Época',
        labelY: key,
        xFormatter: fixedNumOfTicks(10),
        getX: (d,i)=>{/* console.log(i + ", " + d); console.log('i+1 ', i+1);*/return d.epoch},
        getY: d=>{/* console.log('d ', d); */
        return d[key]},
        colorScale:  d3.scaleOrdinal(d3.schemeSet1)
      })

      this.lineChartsSets.push(new Map([[key,this.trainData]]))
      this.lineChartSetsConfigs.push( [{
        legend: key,
        dataKey: key
      }])
    }
    console.log('this.lineChartSetsConfigs ', this.lineChartSetsConfigs);
    // this.dumpData = JSON.parse('[["Weekday",["1.320923213442920","1.163667758463310","1.097100191888680","1.033386934048520","1.056588790197010","1.14226044295480","1.450652958448610","1.480990586433270","1.435830335367150","1.369262768792520","1.513998830016030","1.647133963165290","1.603768252739150","1.566111159781940","1.551655922973230","1.667481510579310","1.919663926341870","2.081709533108560","3.931697239798670","4.0591237554790","3.306349282607650","2.785225984948460","2.437565528993840","1.919296540069130"]],["Saturday",["1.376930485905060","1.257437974028210","1.126166079134830","1.063426244770220","1.049140610048060","1.063418362748330","1.166126870219260","1.474220864544470","1.448545708182220","1.525571177268990","1.628263920696130","1.508389429464750","1.548350220549180","1.589361324776320","1.793704380509780","1.747756432572990","2.134323952526020","2.325447450723820","3.894528101903710","3.764704263551370","3.271466045858830","2.583647070887450","2.178823843921780","1.800546919816650"]],["Sunday",["1.654352096065620","1.59203253409450","1.271275938773440","1.11034936301320","1.096766043506530","1.178354451227350","1.182955966630260","1.280339960878360","1.664544374351070","1.899098501189090","1.769864134523580","2.127941674482650","1.959174096158490","1.742748013530320","1.71440260031640","2.078077175837660","2.113268071456220","2.551805762955580","3.632852165256340","3.765433327802660","3.306498534373090","3.066202090592330","2.562004313920690","1.973828881145950"]]]')
  }

  updateGraphs(){
    this.lineChartUpdate = !this.lineChartUpdate;
  }

  testNet(){
    console.log('url ', this.url);
    this.resetResults();
    const params = {res:'testNet',datasetID: this.netDataset.id};
    let res;
    hpOnce(this.wsService.post(this.url, params),
    (value)=>{
      console.log('value ', value);
      if(value.body) this.result = Object.assign({},value.body, {dataset:this.netDataset.id});
    },
    (err)=>{console.log('saveDataset() err ', err);}
    )
  }

  saveDataset(dataset: ImgCharDataset){
    console.log('url ', this.url);
    const params = {dataset, res:'dataset'};
    return this.wsService.post(this.url, params);
  }


}
