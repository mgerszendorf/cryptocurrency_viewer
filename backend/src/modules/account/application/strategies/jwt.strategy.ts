import omit from "lodash.omit";
import { AccountService } from "../services/account.service";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";
import { PassportStrategy } from "@nestjs/passport";
import { PasswordlessAccount } from "../../domain/types/passwordless-account.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    protected readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("accessToken.secret"),
    });
  }

  async validate(payload: JwtPayload): Promise<PasswordlessAccount> {
    const account = await this.accountService.findByEmail(payload?.email);

    if (!account) {
      throw new UnauthorizedException();
    }

    return omit(account, [`password`]);
  }
}
