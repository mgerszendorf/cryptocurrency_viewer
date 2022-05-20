import { RefreshToken } from "../../domain/entities/refresh-token.entity";
import { RefreshToken as RefreshTokenModel } from "../../infrastructure/models/refresh-token.model";

export class RefreshTokenMapper {
  static toDomain(raw: any): RefreshToken {
    return RefreshToken.create(raw, raw.uuid);
  }

  static toPersistence(refreshToken: RefreshToken): RefreshTokenModel {
    const refreshTokenData = {
      token: refreshToken.token,
      email: refreshToken.email,
      expiration: refreshToken.expiration,
    };

    return refreshTokenData;
  }
}
