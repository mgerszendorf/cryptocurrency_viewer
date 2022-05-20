import { FavoriteCryptocurrency } from "../../domain/entities/favorite-cryptocurrency.entity";
import { FavoriteCryptocurrencyMapper } from "../../application/mappers/favorite-cryptocurrency.mapper";
import { FavoriteCryptocurrency as FavoriteCryptocurrencyModel } from "../models/favorite-cryptocurrency.model";
import { IFavoriteCryptocurrencyRepository } from "../../domain/repositories/favorite-cryptocurrency.repository";
import { InjectModel } from "@nestjs/mongoose";

export class FavoriteCryptocurrencyRepository implements IFavoriteCryptocurrencyRepository {
  constructor(
    @InjectModel(FavoriteCryptocurrencyModel.name)
    private readonly favoriteCryptocurrencyModel: FavoriteCryptocurrencyModel,
  ) {}

  async findAllByUserId(userId: string): Promise<FavoriteCryptocurrency[]> {
    const persistedFavoriteCryptocurrencies = await this.favoriteCryptocurrencyModel.find({
      userId,
    });

    const favoriteCryptocurrencies = persistedFavoriteCryptocurrencies.map(
      (persistedFavoriteCryptocurrency: FavoriteCryptocurrencyModel) =>
        FavoriteCryptocurrencyMapper.toDomain(persistedFavoriteCryptocurrency),
    );

    return favoriteCryptocurrencies;
  }

  async upsert(
    userId: string,
    favoriteCryptocurrency: FavoriteCryptocurrency,
  ): Promise<FavoriteCryptocurrency> {
    const persistenceFavoriteCryptocurrency = FavoriteCryptocurrencyMapper.toPersistence(
      userId,
      favoriteCryptocurrency,
    );

    const filter = {
      userId,
      "cryptocurrency.uuid": persistenceFavoriteCryptocurrency.cryptocurrency.uuid,
    };

    const params = {
      new: true,
      upsert: true,
    };

    const persistedFavoriteCryptocurrency = await this.favoriteCryptocurrencyModel.findOneAndUpdate(
      filter,
      persistenceFavoriteCryptocurrency,
      params,
    );

    return FavoriteCryptocurrencyMapper.toDomain(persistedFavoriteCryptocurrency);
  }
}
