import { AccountController } from "./application/controllers/account.controller";
import { AccountModelDefinition } from "./infrastructure/models/account.model";
import { AccountRepository } from "./infrastructure/repositories/account.repository";
import { AccountService } from "./application/services/account.service";
import { Algorithm } from "jsonwebtoken";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshStrategy } from "./application/strategies/jwt-refresh.strategy";
import { JwtStrategy } from "./application/strategies/jwt.strategy";
import { LocalStrategy } from "./application/strategies/local.strategy";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { RefreshTokenModelDefinition } from "./infrastructure/models/refresh-token.model";
import { RefreshTokenRepository } from "./infrastructure/repositories/refresh-token.repository";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("accessToken.secret");
        const expiresInSec = config.get<number>("accessToken.ttl");
        const algorithm = config.get<Algorithm>("accessToken.algorithm");

        const signOptions = { expiresIn: expiresInSec, algorithm: algorithm };

        return { secret, signOptions };
      },
    }),
    MongooseModule.forFeature([AccountModelDefinition]),
    MongooseModule.forFeature([RefreshTokenModelDefinition]),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AccountRepository,
    RefreshTokenRepository,
  ],
  exports: [AccountService],
})
export class AccountModule {}
