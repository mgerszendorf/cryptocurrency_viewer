import { CryptocurrencyMapper } from "../mappers/cryptocurrency.mapper";
import { FavoriteCryptocurrency } from "../../domain/entities/favorite-cryptocurrency.entity";
import { FavoriteCryptocurrencyDTO } from "../dto/favorite-cryptocurrency.dto";
import { FavoriteCryptocurrencyMapper } from "../mappers/favorite-cryptocurrency.mapper";
import { FavoriteCryptocurrencyRepository } from "../../infrastructure/repositories/favorite-cryptocurrency.repository";
import { Injectable } from "@nestjs/common";
import { PasswordlessAccount } from "../../../account/domain/types/passwordless-account.type";

@Injectable()
export class CryptocurrencyService {
  constructor(
    private readonly favoriteCryptocurrencyRepository: FavoriteCryptocurrencyRepository,
  ) {}

  async upsertFavoriteCryptocurrencies(
    account: PasswordlessAccount,
    favoriteCryptocurrencyDTO: FavoriteCryptocurrencyDTO,
  ): Promise<FavoriteCryptocurrency> {
    const { isFavorite } = favoriteCryptocurrencyDTO;

    const cryptocurrency = CryptocurrencyMapper.toDomain(favoriteCryptocurrencyDTO.cryptocurrency);
    const favoriteCryptocurrency = FavoriteCryptocurrencyMapper.toDomain({
      userId: account.uuid,
      cryptocurrency,
      isFavorite,
    });

    const persistedFavoriteCryptocurrency = await this.favoriteCryptocurrencyRepository.upsert(
      account.uuid,
      favoriteCryptocurrency,
    );

    return persistedFavoriteCryptocurrency;
  }

  async getFavoriteCryptocurrencies(
    account: PasswordlessAccount,
  ): Promise<FavoriteCryptocurrency[]> {
    const favoriteCryptocurrencies = await this.favoriteCryptocurrencyRepository.findAllByUserId(
      account.uuid,
    );

    return favoriteCryptocurrencies;
  }
}
