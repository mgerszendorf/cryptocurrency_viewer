import bcrypt from "bcrypt";
import omit from "lodash.omit";
import { AccountService } from "../services/account.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { PasswordlessAccount } from "../../domain/types/passwordless-account.type";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly accountService: AccountService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string): Promise<PasswordlessAccount> {
    const account = await this.accountService.findByEmail(email);

    if (!account) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await bcrypt.compare(password, account.password);

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return omit(account, [`password`]);
  }
}
