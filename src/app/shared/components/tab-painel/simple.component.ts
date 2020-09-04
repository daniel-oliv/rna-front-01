import { Input, Component } from '@angular/core';

@Component({
  selector: 'pai-tabs',
  template: `
  <div class="container">
    <ul class="nav nav-tabs" >
      <li
      class="nav-item nav-link" 
        *ngFor="let tab of tabs" (click)="selectTab(tab)">
        {{tab.tabTitle}}
      </li>
    </ul>
    <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./simple.component.css']
})
export class Tabs {
  tabs: Tab[] = [];

  selectTab(tab: Tab) {
    this.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
  }

  addTab(tab: Tab) {
    if (this.tabs.length === 0) {
      tab.active = true;
    }
    this.tabs.push(tab);
  }
}

@Component({
  selector: 'pai-tab',
  template: `
    <div [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab {

  @Input() tabTitle: string;
  active: boolean;

  constructor(tabs:Tabs) {
    tabs.addTab(this);
  }
}