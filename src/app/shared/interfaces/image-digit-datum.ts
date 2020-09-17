export interface ImgCharDatum{
  id:string,
  char?: string
  // data: ImageData,
  h: number;
  w: number;
  inVector: (1|-1)[],
  targetVector?: (1|-1)[]
}

export interface ImgCharDatumToGuess 
  extends Omit<ImgCharDatum, ''>{

}

export interface Datum{
  id: string|number;
  inVector: number[];
  targetVector: number[];
}


// TODO fazer guess no back (calcular a saída e dizer o dígito)