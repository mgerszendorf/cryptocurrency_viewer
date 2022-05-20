import { Account } from "../entities/account.entity";

export type PasswordlessAccount = Omit<Account, "password">;
