export interface ICryptoHistoryResponse {
  status?: string;
  data?: IData;
  type?: string;
  message?: string;
}

export interface IData {
  change: string;
  history: IHistory[];
}

export interface IHistory {
  price: string;
  timestamp: number;
}
