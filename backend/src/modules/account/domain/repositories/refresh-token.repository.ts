import { RefreshToken } from "../entities/refresh-token.entity";

export interface IRefreshTokenRepository {
  upsert(refreshToken: RefreshToken): Promise<RefreshToken>;
  get(key: string): Promise<RefreshToken | null>;
  delete(key: string): Promise<void>;
}
