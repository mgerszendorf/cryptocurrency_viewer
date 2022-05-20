import { FavoriteCryptocurrency } from "../entities/favorite-cryptocurrency.entity";

export interface IFavoriteCryptocurrencyRepository {
  findAllByUserId: (userId: string) => Promise<FavoriteCryptocurrency[]>;
  upsert: (
    userId: string,
    favoriteCryptocurrency: FavoriteCryptocurrency,
  ) => Promise<FavoriteCryptocurrency>;
}
