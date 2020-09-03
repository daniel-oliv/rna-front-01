import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawingSquareComponent } from 'src/app/shared/components/drawing-square/drawing-square.component'
import { Tab, Tabs } from './shared/components/tab-painel/simple';

@NgModule({
  declarations: [
    AppComponent,
    DrawingSquareComponent,
    Tab, Tabs
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
