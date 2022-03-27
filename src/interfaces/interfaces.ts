export interface ICryptoList {
  data: {
    coins: object[];
    stats: object;
  };
  status: string;
}

export interface INewsData {
  queryContext: object;
  readLink: string;
  sort: object[];
  totalEstimatedMatches: number;
  value: object[];
  _type: string;
}

export interface IPriceHistory {
  data: {
    change: string;
    history: object[]
  };
  status: string;
}