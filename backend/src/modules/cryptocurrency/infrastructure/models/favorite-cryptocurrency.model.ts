import { Cryptocurrency } from "../../domain/entities/cryptocurrency.entity";
import { Model } from "mongoose";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class FavoriteCryptocurrency extends Model {
  @Prop({ type: String })
  userId!: string;

  @Prop({ type: Cryptocurrency })
  cryptocurrency!: Cryptocurrency;

  @Prop({ type: Boolean })
  isFavorite!: boolean;
}

export const FavoriteCryptocurrencySchema = SchemaFactory.createForClass(FavoriteCryptocurrency);
export const FavoriteCryptocurrencyModelDefinition: ModelDefinition = {
  name: FavoriteCryptocurrency.name,
  schema: FavoriteCryptocurrencySchema,
};
