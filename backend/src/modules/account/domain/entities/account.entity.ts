import { Entity } from "../../../common/domain/entities/base.entity";
import { Gender } from "../enums/gender.enum";

interface IAccount {
  uuid?: string;
  email: string;
  username: string;
  password: string;
  gender: Gender;
}

export class Account extends Entity {
  public email!: string;
  public username!: string;
  public password!: string;
  public gender!: Gender;

  private constructor(props: IAccount, uuid?: string) {
    super(uuid);

    this.email = props.email;
    this.username = props.username;
    this.password = props.password;
    this.gender = props.gender;
  }

  public static create(props: IAccount, uuid?: string) {
    return new Account(
      {
        email: props.email,
        username: props.username,
        password: props.password,
        gender: Gender[props.gender],
      },
      uuid,
    );
  }
}
