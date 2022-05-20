import { Gender } from "../../domain/enums/gender.enum";
import { Model } from "mongoose";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Account extends Model {
  @Prop({ type: String, unique: true })
  uuid!: string;

  @Prop({ type: String, unique: true })
  email!: string;

  @Prop({ type: String })
  username!: string;

  @Prop({ type: String })
  password!: string;

  @Prop({ type: String, enum: Gender })
  gender!: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export const AccountModelDefinition: ModelDefinition = {
  name: Account.name,
  schema: AccountSchema,
};
