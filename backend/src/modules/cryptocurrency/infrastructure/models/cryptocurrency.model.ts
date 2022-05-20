import { Model } from "mongoose";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Cryptocurrency extends Model {
  @Prop()
  change!: string;

  @Prop()
  iconUrl!: string;

  @Prop()
  name!: string;

  @Prop()
  price!: string;

  @Prop()
  rank!: number;

  @Prop()
  symbol!: string;
}
