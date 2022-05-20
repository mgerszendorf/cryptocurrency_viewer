import { Account } from "../entities/account.entity";
import { Repository } from "../../../common/domain/repositories/base.repository";

export interface IAccountRepository extends Repository<Account> {
  findByEmail: (email: string) => Promise<Account | null>;
}
