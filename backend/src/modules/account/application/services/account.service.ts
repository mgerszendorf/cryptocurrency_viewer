import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { Account } from "../../domain/entities/account.entity";
import { AccountMapper } from "../mappers/account.mapper";
import { AccountRepository } from "../../infrastructure/repositories/account.repository";
import { ConfigService } from "@nestjs/config";
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PasswordlessAccount } from "../../domain/types/passwordless-account.type";
import { RefreshToken } from "../../domain/entities/refresh-token.entity";
import { RefreshTokenMapper } from "../mappers/refresh-token.mapper";
import { RefreshTokenRepository } from "../../infrastructure/repositories/refresh-token.repository";
import { RegisterDTO } from "../dto/register.dto";
import { Tokens } from "../../domain/types/tokens.type";

@Injectable()
export class AccountService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accountRepository: AccountRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  private async createTokensPair(account: PasswordlessAccount): Promise<Tokens> {
    const accessTokenSecret = this.configService.get<string>("accessToken.secret");
    const accessTokenTTL = this.configService.get<number>("accessToken.ttl");
    const refreshTokenSecret = this.configService.get<string>("refreshToken.secret");
    const refreshTokenTTL = this.configService.get<number>("refreshToken.ttl");

    const accessToken = await this.jwtService.signAsync(account, {
      secret: accessTokenSecret,
      expiresIn: accessTokenTTL,
    });

    const refreshToken = await this.jwtService.signAsync(account, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenTTL,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(email: string, token: string): Promise<RefreshToken> {
    const hashedRefreshToken = await bcrypt.hash(token, 10);
    const refreshTokenTTL = this.configService.get("refreshToken.ttl");

    const refreshToken = RefreshTokenMapper.toDomain({
      token: hashedRefreshToken,
      email,
      expiration: dayjs().add(refreshTokenTTL, "s").unix(),
    });

    return refreshToken;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const persistedAccount = await this.accountRepository.findByEmail(email);

    return persistedAccount ? AccountMapper.toDomain(persistedAccount) : null;
  }

  async authenticateWithCredentials(account: PasswordlessAccount): Promise<Tokens> {
    const { accessToken: accessTokenStr, refreshToken: refreshTokenStr } =
      await this.createTokensPair(account);

    const refreshToken = await this.getRefreshToken(account.email, refreshTokenStr);

    await this.refreshTokenRepository.upsert(refreshToken);

    return {
      accessToken: accessTokenStr,
      refreshToken: refreshTokenStr,
    };
  }

  async authenticateWithRefreshToken(account: PasswordlessAccount, token: string): Promise<Tokens> {
    const persistedRefreshTokenData = await this.refreshTokenRepository.get(account.email);

    if (!persistedRefreshTokenData) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenMatching = await bcrypt.compare(token, persistedRefreshTokenData.token);

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException();
    }

    const { accessToken: accessTokenStr, refreshToken: refreshTokenStr } =
      await this.createTokensPair(account);

    const refreshToken = await this.getRefreshToken(account.email, refreshTokenStr);

    await this.refreshTokenRepository.upsert(refreshToken);

    return {
      accessToken: accessTokenStr,
      refreshToken: refreshTokenStr,
    };
  }

  async register(data: RegisterDTO): Promise<void> {
    const accountExists = await this.accountRepository.exists(data.email);

    if (accountExists) {
      throw new ConflictException("Account already exists");
    }

    if (data.password !== data.confirmPassword) {
      throw new UnprocessableEntityException("Passwords not match");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const account = AccountMapper.toDomain({ ...data, password: hashedPassword });

    await this.accountRepository.save(account);
  }

  async logout(account: PasswordlessAccount): Promise<void> {
    await this.refreshTokenRepository.delete(account.email);
  }
}
