import { AccountModelDefinition } from "../account/infrastructure/models/account.model";
import { CryptocurrencyController } from "./application/controllers/cryptocurrency.controller";
import { CryptocurrencyService } from "./application/services/cryptocurrency.service";
import { FavoriteCryptocurrencyModelDefinition } from "./infrastructure/models/favorite-cryptocurrency.model";
import { FavoriteCryptocurrencyRepository } from "./infrastructure/repositories/favorite-cryptocurrency.repository";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([AccountModelDefinition]),
    MongooseModule.forFeature([FavoriteCryptocurrencyModelDefinition]),
  ],
  controllers: [CryptocurrencyController],
  providers: [CryptocurrencyService, FavoriteCryptocurrencyRepository],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
