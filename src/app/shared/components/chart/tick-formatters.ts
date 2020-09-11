import {scaleTime, timeHour, Axis} from 'd3'
import * as d3 from 'd3'

export function hourTick(axisConfig: any){
  // axisConfig.ticks(d3.timeHour)
  axisConfig.ticks(12).tickFormat(x => `${x%24} h`);
}

export function roughNumberOfTicks(axisConfig: any, nTicks){
  axisConfig.ticks(nTicks)
}

export function fixedNumOfTicks(nTicks){
  return (axisConfig: any)=>{
    axisConfig.ticks(nTicks);
  }
}