
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