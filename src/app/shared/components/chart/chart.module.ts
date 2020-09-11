import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TreeChartComponent } from './tree-chart/tree-chart.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LineChartComponent, BarChartComponent, TreeChartComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LineChartComponent,
    BarChartComponent,
    TreeChartComponent
  ]
})
export class ChartModule { }
