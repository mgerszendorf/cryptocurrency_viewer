import { FavoriteCryptocurrency } from "../../domain/entities/favorite-cryptocurrency.entity";
import { FavoriteCryptocurrency as FavoriteCryptocurrencyModel } from "../../infrastructure/models/favorite-cryptocurrency.model";

export class FavoriteCryptocurrencyMapper {
  static toDomain(raw: any): FavoriteCryptocurrency {
    return FavoriteCryptocurrency.create(raw);
  }

  static toPersistence(
    userId: string,
    favoriteCryptocurrency: FavoriteCryptocurrency,
  ): FavoriteCryptocurrencyModel {
    const favoriteCryptocurrencyData = {
      userId,
      cryptocurrency: favoriteCryptocurrency.cryptocurrency,
      isFavorite: favoriteCryptocurrency.isFavorite,
    };

    return favoriteCryptocurrencyData;
  }
}
