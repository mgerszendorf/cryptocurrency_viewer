import { Entity } from "../../../common/domain/entities/base.entity";

interface IRefreshToken {
  token: string;
  email: string;
  expiration: number;
}

export class RefreshToken extends Entity {
  public token: string;
  public email: string;
  public expiration: number;

  private constructor(props: IRefreshToken, uuid?: string) {
    super(uuid);

    this.token = props.token;
    this.email = props.email;
    this.expiration = props.expiration;
  }

  public static create(props: IRefreshToken, uuid?: string) {
    return new RefreshToken(props, uuid);
  }
}
