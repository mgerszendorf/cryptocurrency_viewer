export interface INewsResponse {
  _type: string;
  readLink: string;
  queryContext: IQueryContext;
  totalEstimatedMatches: number;
  sort: ISort[];
  value: IValue[];
  errors: any;
}

export interface IQueryContext {
  originalQuery: string;
  adultIntent: boolean;
}

export interface ISort {
  name: string;
  id: string;
  isSelected: boolean;
  url: string;
}

export interface IValue {
  name: string;
  url: string;
  image?: IValueImage;
  description: string;
  provider: IProvider[];
  datePublished: string;
  category?: CategoryEnum;
}

export enum CategoryEnum {
  Business = "Business",
  Entertainment = "Entertainment",
}

export interface IValueImage {
  thumbnail: IPurpleThumbnail;
}

export interface IPurpleThumbnail {
  contentUrl: string;
  width: number;
  height: number;
}

export interface IProvider {
  _type: TypeEnum;
  name: string;
  image?: IProviderImage;
}

export enum TypeEnum {
  Organization = "Organization",
}

export interface IProviderImage {
  thumbnail: IFluffyThumbnail;
}

export interface IFluffyThumbnail {
  contentUrl: string;
}
