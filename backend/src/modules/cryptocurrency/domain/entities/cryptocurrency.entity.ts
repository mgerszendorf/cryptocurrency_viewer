import { Entity } from "../../../common/domain/entities/base.entity";

interface ICryptocurrency {
  change: string;
  iconUrl: string;
  name: string;
  price: string;
  rank: number;
  symbol: string;
}

export class Cryptocurrency extends Entity {
  public change!: string;
  public iconUrl!: string;
  public name!: string;
  public price!: string;
  public rank!: number;
  public symbol!: string;

  private constructor(props: ICryptocurrency, uuid: string) {
    super(uuid);

    this.change = props.change;
    this.iconUrl = props.iconUrl;
    this.name = props.name;
    this.price = props.price;
    this.rank = props.rank;
    this.symbol = props.symbol;
  }

  public static create(props: ICryptocurrency, uuid: string) {
    return new Cryptocurrency(props, uuid);
  }
}
