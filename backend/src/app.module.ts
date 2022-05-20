import { AccountModule } from "./modules/account/account.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CryptocurrencyModule } from "./modules/cryptocurrency/cryptocurrency.module";
import { HealthModule } from "./modules/health/health.module";
import { LoggerModule } from "nestjs-pino";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { configuration } from "./configuration";

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get("mongo.global"),
      }),
    }),
    AccountModule,
    CryptocurrencyModule,
    HealthModule,
  ],
})
export class AppModule {}
