import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @ViewChild('canvasimg') imageElementRef: ElementRef;
  @ViewChild('can') canvasRef: ElementRef;
  canvas;
  ctx;
  flag = false;
  prevX = 0;
  currX= 0;
  prevY = 0;
  currY = 0;
  dot_flag = false;

  x = "black";
  y = 2;
  w: number; h: number;
    
  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext("2d");
    this.w = this.canvas.width;
    // this.y = 100;
    this.h = this.canvas.height;
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

  drawSquare() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.x;
    this.ctx.lineWidth = this.y;
    this.ctx.stroke();
    this.ctx.closePath();
  }
    
  erase() {
    let m = confirm("Want to clear");
    if (m) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.imageElementRef.nativeElement.style.display = "none";
    }
  }
    
  saveInDataSet() {
      this.imageElementRef.nativeElement.style.border = "2px solid";
      var dataURL = this.canvas.toDataURL();
      this.imageElementRef.nativeElement.src = dataURL;
      this.imageElementRef.nativeElement.style.display = "inline";
  }
    
  findxy(e, res) {
    console.log('res ', res);
    if (res == 'down') {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.offsetLeft;
        this.currY = e.clientY - this.canvas.offsetTop;

      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
          this.ctx.beginPath();
          this.ctx.fillStyle = this.x;
          this.ctx.fillRect(this.currX, this.currY, 2, 2);
          this.ctx.closePath();
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
          this.currX = e.clientX - this.canvas.offsetLeft;
          this.currY = e.clientY - this.canvas.offsetTop;
          this.draw();
      }
    }
  }

}
