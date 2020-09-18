import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { extendInArrays, maxInArrays, extendInMapsOfArrays, maxInMapsOfArrays } from 'src/app/shared/helpers/common';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class LineChartComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() datasetsConfigs: LineChartSetConfig[];
  @Input() datasetsMap: Map<string,any[]>;
  @Input() config: Config;
  @Input() updateFlag: boolean;
  // @Input() label: string
  // @Input() xAccessor: Function
  // @Input() yAccessor: Function
  @ViewChild('chart') private chartContainer: ElementRef;
  private chart: any;
  private margin: any = {left:60, right:50, top:60, bottom:60};
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private xAxisConfig: any;
  private yAxisConfig: any;

  private transition: any;
  private legend:any;
  private legendX:number;
  private legendY:number;
  private lines;
  private lineConfig;

  // dataArrays: any[];

  constructor() { }
  ngOnInit(){
    this.transition = function(){ return d3.transition().duration(20); }
  }

  ngAfterViewInit() {
  this.create();
    if (this.datasetsConfigs) {
      this.update();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.update();
    }
  }

  create(){
    console.log('create()');
    //this.dataArrays = this.dataSets.map(d=>d.array);
    const element = this.chartContainer.nativeElement;
    const svg = d3.select(element).append('svg')
      .attr('width', this.config.boundWidth)
      .attr('height', this.config.boundHeight);
    
    this.width = this.config.boundWidth - this.margin.left - this.margin.right;
    this.height = this.config.boundHeight - this.margin.top - this.margin.bottom;
    
    console.log('svg.attr(width)', (svg.node as any).getBBox)
    console.log('width', this.width)
    console.log('height', this.height);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'line-chart')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    //!legend
    if(this.isLegended()){
      this.legendY = this.margin.top + this.height * 0.4;
      this.legendX = this.width;
      this.legend = svg.append("g")
        .attr("transform", "translate("+ this.legendX +","+ this.legendY + ")")
        .attr("width", this.width/5)
        .attr("height", this.height/5);

      this.legend.append("rect")
        .attr("width", "100px")
        .attr("height", this.datasetsConfigs.length *20+'px' )
        .attr("transform", "translate("+ -80 +","+ -5 + ")")
        .attr("fill", "white")
        .attr("opacity", 0.7);
    }

    
    
    // Scales
    this.xScale = this.config.xScale.range([0, this.width]);
    this.yScale= this.config.yScale.range([this.height, 0]);

    // Axis generators
    this.xAxisConfig = d3.axisBottom(this.xScale).ticks(7);
    this.yAxisConfig = d3.axisLeft(this.yScale);

    // Axis Elements
    this.xAxis =svg.append("g")
          .attr("class", "x axis")
          .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
    
    this.yAxis = svg.append("g")
          .attr("class", "y axis")
          .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
  
    // X-Axis lablabel
    if(this.config.labelX) svg.append("text")
        .attr("class", "x axisLabel")
        .attr("y", this.margin.top + this.height + 50)
        .attr("x", this.width / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(this.config.labelX);
    // Y-Axis label
    if(this.config.labelY) svg.append("text")
        .attr("class", "y axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", this.margin.left - 40)
        .attr("x", -(this.margin.top + this.height/2))
        .attr("font-size", "20px")
        .style("text-anchor", "middle")
        .text(this.config.labelY);
  }

  update(){
    if(this.isLegended()){this.printLegend()}
    this.xScale.domain(extendInMapsOfArrays(this.datasetsMap,this.config.getX));
    this.yScale.domain([0, maxInMapsOfArrays(this.datasetsMap, this.config.getY)]);
    this.xAxisConfig.scale(this.xScale);
    this.yAxisConfig.scale(this.yScale);
    if(this.config.xFormatter) this.config.xFormatter(this.xAxisConfig);
    if(this.config.yFormatter) this.config.yFormatter(this.yAxisConfig);
    this.xAxis.transition(this.transition()).call(this.xAxisConfig);
    this.yAxis.transition(this.transition()).call(this.yAxisConfig);

    this.lineConfig = d3.line()
        .x((d)=>{ return this.xScale(d[0]);    })
        .y((d)=>{ return this.yScale(d[1]);    });
    
    this.lines =this.chart.selectAll(".line")
        .data(this.datasetsConfigs, (d)=>{return d.dataKey;});
    console.log('this.lines ', this.lines);
    this.lines.exit().remove();
    /// enter() selection

    // this.chart.selectAll('.line').transition()
    //   .attr("stroke", (d)=>{return this.config.colorScale(d.dataKey);})
    //   .attr("d", (d)=>{return this.lineConfig(this.getXYArray(d))});
      
    let enter = this.lines
      .enter().append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", (d)=>{return this.config.colorScale(d.dataKey);})
        .attr("stroke-width", "3px")
      .merge(this.lines);

    enter
      .transition(this.transition)
      .attr("d", (d)=>{return this.lineConfig(this.getXYArray(d))});
    
    /// exit selection try after enter() and merge
    
  }

  getXYArray(datasetConfig: LineChartSetConfig): any[]
  {
      let ret = [];
      let getX, getY;
      getX = datasetConfig.getX? datasetConfig.getX : this.config.getX;
      getY = datasetConfig.getY? datasetConfig.getX : this.config.getY;
      let dataset = this.datasetsMap.get(datasetConfig.dataKey);
      for (let i = 0; i < dataset.length; i++) {
        const elem = dataset[i];
        ret.push([getX(elem,i),getY(elem,i)])
      }
      return ret;
  }

  printLegend(){
    console.log('printLegend');
    this.legend.selectAll("g").remove();

    this.datasetsConfigs.forEach((d, i)=>{
      let legendText = d.legend ? d.legend :
                    d.getLegend ? d.getLegend(this.datasetsMap.get(d.dataKey)) : 
                    this.config.getLegend(this.datasetsMap.get(d.dataKey));
      let color = this.config.colorScale(d.dataKey);

      
      let legendRow = this.legend.append("g")
        .attr("class", "legend-row")
        .attr("transform", "translate(0," + (i * 20) + ")")
        // .style("background-color", color) 

      legendRow.append("rect")
				.attr("width", 10)
				.attr("height", 10)
        .attr("fill", this.config.colorScale(d.dataKey));
        
      legendRow.append("text")
				.attr("x", -10)
				.attr("y", 10)
				.attr("text-anchor", "end")
            .text(legendText)
            .attr("fill", color);
    })
          
  }

  isLegended(): boolean{
    if(this.config.getLegend || this.datasetsConfigs.some(d=>d.legend || d.getLegend)) return true;
    return false;
  }

//   drawLegend(cols, dx = 10, dy = 10, padding = 12) {

//     let drag = d3.drag()
//         .on("drag", function() {
//             var svg = d3.select(this);
//             var x = parseInt(svg.style("left"));
//             var y = parseInt(svg.style("top"));
//             svg.style("left", x + d3.event.dx).style("top", y + d3.event.dy);
//         });

//     var svg = d3.select("html")
//         .append("svg")
//         .style("position", "relative")
//         .style("left", dx)
//         .style("top", dy)
//         .call(drag);

   
//     }
// }

  // setConfig(
  //   xScale,yScale,
  //   labelX?:string,
  //   labelY?:string,
  //   getLegend?: Function,
  //   getX?: Function,
  //   getY?: Function){
  //     this.config = {
  //       boundWidth: '100%',
  //       boundHeight: '400px',
  //       xScale: xScale,
  //       yScale: yScale,
  //       labelX: labelX,
  //       labelY:labelY,
  //       getLegend:getLegend,
  //       getX:getX,
  //       getY:getY 
  //     }
  // }
}

export interface LineChartSetConfig{
  //array: any[],
  dataKey: string,
  getLegend?: Function
  legend?: string
  getX?: Function,
  getY?: Function
}

export interface Config{
  boundWidth,
  boundHeight,
  xScale: any,
  yScale: any,
  labelX?:string,
  labelY?:string,
  xFormatter?: Function,
  yFormatter?: Function,
  getLegend?: Function,
  getX?: Function,
  getY?: Function,
  colorScale: any
}