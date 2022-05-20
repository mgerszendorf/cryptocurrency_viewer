import { Model } from "mongoose";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class RefreshToken extends Model {
  @Prop({ type: String })
  token!: string;

  @Prop({ type: String, unique: true })
  email!: string;

  @Prop()
  expiration!: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
export const RefreshTokenModelDefinition: ModelDefinition = {
  name: RefreshToken.name,
  schema: RefreshTokenSchema,
};
