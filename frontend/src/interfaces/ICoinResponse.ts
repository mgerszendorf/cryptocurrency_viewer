export interface ICoinResponse {
    status: string;
    data:   IData;
}

export interface IData {
    coin: ICoin;
}

export interface ICoin {
    uuid:              string;
    symbol:            string;
    name:              string;
    description:       string;
    color:             string;
    iconUrl:           string;
    websiteUrl:        string;
    links:             ILink[];
    supply:            ISupply;
    numberOfMarkets:   number;
    numberOfExchanges: number;
    "24hVolume":       string;
    marketCap:         string;
    price:             string;
    btcPrice:          string;
    priceAt:           number;
    change:            string;
    rank:              number;
    sparkline:         string[];
    allTimeHigh:       IAllTimeHigh;
    coinrankingUrl:    string;
    tier:              number;
    lowVolume:         boolean;
    listedAt:          number;
}

export interface IAllTimeHigh {
    price:     string;
    timestamp: number;
}

export interface ILink {
    name: string;
    type: string;
    url:  string;
}

export interface ISupply {
    confirmed:   boolean;
    total:       string;
    circulating: string;
}
