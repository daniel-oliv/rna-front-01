import { Datum, ImgCharDatum } from './image-digit-datum';

export interface ImgCharDataset{
  id: string,
  data: ImgCharDatum[]
}

export interface SonarDataset{
  id: string,
  data: Datum[]
}

export interface Dataset{
  id: string,
  data: Datum[]
}

