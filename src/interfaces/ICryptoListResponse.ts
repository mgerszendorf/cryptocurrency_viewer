export interface ICryptoListResponse {
  status?: string;
  data?: IData;
  type?: string;
  message?: string;
}

export interface IData {
  stats: IStats;
  coins: ICoin[];
}

export interface ICoin {
  uuid: string;
  symbol: string;
  name: string;
  color: null | string;
  iconUrl: string;
  marketCap: string;
  price: string;
  listedAt: number;
  tier: number;
  change: string;
  rank: number;
  sparkline: string[];
  lowVolume: boolean;
  coinrankingUrl: string;
  "24hVolume": string;
  btcPrice: string;
}

export interface IStats {
  total: number;
  referenceCurrencyRate: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: string;
  total24hVolume: string;
  btcDominance: number;
  bestCoins: IEstCoin[];
  newestCoins: IEstCoin[];
}

export interface IEstCoin {
  uuid: string;
  symbol: string;
  name: string;
  iconUrl: string;
  coinrankingUrl: string;
}
