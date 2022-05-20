import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository";
import { InjectModel } from "@nestjs/mongoose";
import { RefreshToken } from "../../domain/entities/refresh-token.entity";
import { RefreshTokenMapper } from "../../application/mappers/refresh-token.mapper";
import { RefreshToken as RefreshTokenModel } from "../models/refresh-token.model";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenModel.name) private readonly refreshTokenModel: RefreshTokenModel,
  ) {}

  async get(email: string): Promise<RefreshToken | null> {
    const persistedRefreshToken = await this.refreshTokenModel.findOne({ email });

    return persistedRefreshToken ? RefreshTokenMapper.toDomain(persistedRefreshToken) : null;
  }

  async upsert(refreshToken: RefreshToken): Promise<RefreshToken> {
    const persistenceRefreshToken = RefreshTokenMapper.toPersistence(refreshToken);

    const filter = {
      email: persistenceRefreshToken.email,
    };

    const params = {
      new: true,
      upsert: true,
    };

    const upsertedRefreshToken = await this.refreshTokenModel.findOneAndUpdate(
      filter,
      persistenceRefreshToken,
      params,
    );

    return RefreshTokenMapper.toDomain(upsertedRefreshToken);
  }

  async delete(email: string): Promise<void> {
    await this.refreshTokenModel.deleteOne({ email });
  }
}
