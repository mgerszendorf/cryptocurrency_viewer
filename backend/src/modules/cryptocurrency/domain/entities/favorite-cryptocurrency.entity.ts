import { Cryptocurrency } from "./cryptocurrency.entity";

interface IFavoriteCryptocurrency {
  cryptocurrency: Cryptocurrency;
  isFavorite: boolean;
}

export class FavoriteCryptocurrency {
  public cryptocurrency!: Cryptocurrency;
  public isFavorite!: boolean;

  private constructor(props: IFavoriteCryptocurrency) {
    this.cryptocurrency = props.cryptocurrency;
    this.isFavorite = props.isFavorite;
  }

  public static create(props: IFavoriteCryptocurrency) {
    return new FavoriteCryptocurrency(props);
  }
}
