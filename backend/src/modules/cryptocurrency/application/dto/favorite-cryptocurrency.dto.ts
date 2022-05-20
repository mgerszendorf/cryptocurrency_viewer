import { ApiProperty } from "@nestjs/swagger";
import { CryptocurrencyConstraints } from "../../domain/enums/cryptocurrency-constraints.enum";
import { IsBoolean, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class CryptocurrencyDTO {
  @IsString()
  @ApiProperty({ example: `ac90e6d9-8c1e-4d80-a77f-f00fe1f2765b` })
  public uuid!: string;

  @IsString()
  @ApiProperty({ example: `-0.52` })
  public change!: string;

  @IsString()
  @ApiProperty({ example: `https://example.com/image.webp` })
  public iconUrl!: string;

  @IsString()
  @ApiProperty({ example: `Bitcoin` })
  public name!: string;

  @IsString()
  @ApiProperty({ example: `3600.0000` })
  public price!: string;

  @IsNumber()
  @Min(CryptocurrencyConstraints.RankMinValue)
  @Max(CryptocurrencyConstraints.RankMaxValue)
  @ApiProperty({ example: `2` })
  public rank!: number;

  @IsString()
  @ApiProperty({ example: `BTC` })
  public symbol!: string;
}

export class FavoriteCryptocurrencyDTO {
  @Type(() => CryptocurrencyDTO)
  @ValidateNested()
  @ApiProperty({ type: CryptocurrencyDTO })
  public cryptocurrency!: CryptocurrencyDTO;

  @IsBoolean()
  @ApiProperty({ example: true })
  public isFavorite!: boolean;
}
