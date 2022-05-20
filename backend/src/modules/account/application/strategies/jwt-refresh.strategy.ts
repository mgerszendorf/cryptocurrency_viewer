import omit from "lodash.omit";
import { AccountService } from "../services/account.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    protected readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      secretOrKey: configService.get("refreshToken.secret"),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload) {
      throw new BadRequestException();
    }

    const account = await this.accountService.findByEmail(payload?.email);

    if (!account) {
      throw new UnauthorizedException();
    }

    return omit(account, [`password`]);
  }
}
