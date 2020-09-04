import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { getBinaryBipolarData } from '../canvas';
import { ImgCharDatum } from '../../interfaces/image-digit-datum';

@Component({
  selector: 'app-drawing-square-show',
  templateUrl: './drawing-square.component.html',
  styleUrls: ['./drawing-square.component.css']
})
export class DrawingSquareComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @ViewChild('canvasimg') imageElementRef: ElementRef;
  @ViewChild('can') canvasRef: ElementRef;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  flag = false;
  prevX = 0;
  currX= 0;
  prevY = 0;
  currY = 0;
  dot_flag = false;

  x = "black";
  y = 2;
  w: number; h: number;
  wSquare = 40;
  nCols;
  nLines;
  maxXY: number[];
    
  ngAfterViewInit() {
    this.canvas = <HTMLCanvasElement>this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext("2d");
    // this.y = 100;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this.nCols = Math.floor(this.w/this.wSquare);
    this.nLines = Math.floor(this.h/this.wSquare);
    this.maxXY = [this.nCols, this.nLines]
    console.log('nCols ', this.nCols);
    console.log('nLines ', this.nLines);
  }

  draw() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(this.currX, this.currY);
      this.ctx.strokeStyle = this.x;
      this.ctx.lineWidth = this.y;
      this.ctx.stroke();
      this.ctx.closePath();
  }

  xyToSquare(x: number, y: number){
    const iXY = [Math.floor(x/this.wSquare), Math.floor(y/this.wSquare)];
    for (let i = 0; i < iXY.length; i++) {
      if(iXY[i]<0){
        iXY[i] = 0;
      }else if(iXY[i]>=this.maxXY[i]){
        iXY[i] = iXY[i] - 1;
      }
    }
    return iXY;
  }

  xy2SquareBegin(x: number, y: number){
    return this.xyToSquare(x, y).map(d=>d*this.wSquare);;
  }



  drawSquare() {
    const squareCoord = this.xy2SquareBegin(this.currX, this.currY);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(squareCoord[0], squareCoord[1], this.wSquare, this.wSquare);
    this.ctx.closePath();
  }
    
  erase(m = confirm("Want to clear")) {
    if (m) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.imageElementRef.nativeElement.style.display = "none";
    }
  }

  idDatum;
  digitDatum;
  getDigitDatum() {
    if(this.idDatum && this.digitDatum){
      // this.imageElementRef.nativeElement.style.border = "2px solid";
      // var dataURL = this.canvas.toDataURL();
      // this.imageElementRef.nativeElement.src = dataURL;
      // this.imageElementRef.nativeElement.style.display = "inline";
      const vecIndexes = [];
      for (let i = 0; i < this.nLines; i++) {
        for (let j = 0; j < this.nCols; j++) {
          vecIndexes.push(j*this.wSquare + (i*this.w*this.wSquare)) 
        }
        
      }
      console.log('vecIndexes ', vecIndexes);
      const rawData = this.ctx.getImageData(0, 0, this.w, this.h);
      // const imageBiData = getBinaryData(this.ctx, this.w, this.h);
      const imageBiData = getBinaryBipolarData(this.ctx, this.w, this.h);
      const simpData = vecIndexes.map((d)=>imageBiData[d])
      console.log('image data', simpData  );
      
      const datum: ImgCharDatum = 
      {     
        id: this.idDatum, 
        char: this.digitDatum, 
        // data: rawData, 
        h: this.h,
        w: this.w,
        inVector: simpData,
      }
      return datum;
    }
  }


  @Output() returnDatum$ = new EventEmitter()
  addToDataset() {
    const datum = this.getDigitDatum();
    this.idDatum='';
    this.digitDatum='';
    this.returnDatum$.emit(datum);
    this.erase(true);
  }
    
  findxy(e, res) {
    //console.log('res ', res);
    //console.log('xy ', [this.currX,this.currY]);
    //console.log('square ', this.xyToSquare(this.currX, this.currY));
    if (res == 'down') {
        this.prevX = this.currX;
        this.prevY = this.currY;
        // this.currX = e.clientX - this.canvas.offsetLeft;
        this.currX = e.clientX - this.canvas.getBoundingClientRect().left;
        this.currY = e.clientY - this.canvas.getBoundingClientRect().top;

      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        this.drawSquare();
        this.dot_flag = false;
      }
  }
  if (res == 'up' || res == "out") {
      this.flag = false;
  }
  if (res == 'move') {
      if (this.flag) {
          this.prevX = this.currX;
          this.prevY = this.currY;
          // this.currX = e.clientX - this.canvas.offsetLeft;
          this.currX = e.clientX - this.canvas.getBoundingClientRect().left;
          this.currY = e.clientY - this.canvas.getBoundingClientRect().top;
          this.drawSquare();
      }
    }
  }

}
