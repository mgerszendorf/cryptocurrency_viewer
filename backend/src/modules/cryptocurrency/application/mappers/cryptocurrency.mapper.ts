import { Cryptocurrency } from "../../domain/entities/cryptocurrency.entity";
import { Cryptocurrency as CryptocurrencyModel } from "../../infrastructure/models/cryptocurrency.model";

export class CryptocurrencyMapper {
  static toDomain(raw: any): Cryptocurrency {
    return Cryptocurrency.create(raw, raw.uuid);
  }

  static toPersistence(cryptocurrency: Cryptocurrency): CryptocurrencyModel {
    const cryptocurrencyData = {
      uuid: cryptocurrency.uuid,
      change: cryptocurrency.change,
      iconUrl: cryptocurrency.iconUrl,
      name: cryptocurrency.name,
      price: cryptocurrency.price,
      rank: cryptocurrency.rank,
      symbol: cryptocurrency.symbol,
    };

    return cryptocurrencyData;
  }
}
