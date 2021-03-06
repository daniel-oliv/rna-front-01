
export function getImageData(ctx: CanvasRenderingContext2D, w: number, h:number): ImageData{
  const imgData = ctx.getImageData(0, 0, w, h);
  return imgData;
}

export function getBlackWhiteData(ctx: CanvasRenderingContext2D, w: number, h:number){
  const imgData = getImageData(ctx, w, h);
  const ret = imgData.data.filter((d,i)=>i%4===3)
  return ret;
}

export function getBinaryData(ctx: CanvasRenderingContext2D, w: number, h:number){
  const data = getBlackWhiteData(ctx, w, h).map(d=>
      d>128 ? 1 : 0
    );
  return data as unknown as (1|0)[];
}

export function getBinaryBipolarData(ctx: CanvasRenderingContext2D, w: number, h:number){
  const data : number[] = [];
  const bin =getBlackWhiteData(ctx, w, h);
  for (let i = 0; i < bin.length; i++) {
    const b = bin[i];
    if(b<128) data.push(-1);
    else data.push(1);
  }
  return data as unknown as (1|-1)[];
}