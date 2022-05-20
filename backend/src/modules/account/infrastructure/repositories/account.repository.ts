import { Account } from "../../domain/entities/account.entity";
import { AccountMapper } from "../../application/mappers/account.mapper";
import { Account as AccountModel } from "../models/account.model";
import { IAccountRepository } from "../../domain/repositories/account.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class AccountRepository implements IAccountRepository {
  constructor(@InjectModel(AccountModel.name) private readonly accountModel: Model<AccountModel>) {}

  async findByEmail(email: string): Promise<Account | null> {
    const persistedAccount = await this.accountModel.findOne({ email });

    return persistedAccount ? AccountMapper.toDomain(persistedAccount) : null;
  }

  async findById(uuid: string): Promise<Account | null> {
    const persistedAccount = await this.accountModel.findOne({ uuid });

    return persistedAccount ? AccountMapper.toDomain(persistedAccount) : null;
  }

  async exists(email: string): Promise<boolean> {
    const persistedAccount = await this.accountModel.findOne({ email });

    return !!persistedAccount;
  }

  async save(account: Account): Promise<Account> {
    const persistenceAccount = AccountMapper.toPersistence(account);

    const accountModel = new this.accountModel(persistenceAccount);
    const persistedAccount = await accountModel.save();

    return AccountMapper.toDomain(persistedAccount);
  }

  async update(account: Account): Promise<Account | null> {
    const persistenceAccount = AccountMapper.toPersistence(account);

    const updatedAccount = await this.accountModel.findOneAndUpdate(
      { email: persistenceAccount.email },
      persistenceAccount,
    );

    return updatedAccount ? AccountMapper.toDomain(updatedAccount) : null;
  }

  async delete(email: string): Promise<void> {
    await this.accountModel.deleteOne({ email });
  }
}
