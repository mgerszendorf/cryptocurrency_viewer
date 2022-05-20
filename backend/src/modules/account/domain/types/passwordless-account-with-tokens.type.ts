import { PasswordlessAccount } from "./passwordless-account.type";
import { Tokens } from "./tokens.type";

export type PasswordlessAccountWithTokens = {
  account: PasswordlessAccount;
  tokens: Tokens;
};
