import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CryptocurrencyService } from "../services/cryptocurrency.service";
import { FavoriteCryptocurrency } from "../../domain/entities/favorite-cryptocurrency.entity";
import { FavoriteCryptocurrencyDTO } from "../dto/favorite-cryptocurrency.dto";
import { JwtAuthGuard } from "../../../account/application/guards/jwt.guard";
import { PasswordlessAccount } from "../../../account/domain/types/passwordless-account.type";
import { RequestAccount } from "../../../account/application/decorators/request-account.decorator";
import { TimeoutInterceptor } from "../../../common/application/interceptors/timeout.interceptor";
import { TransformInterceptor } from "../../../common/application/interceptors/transform.interceptor";

@Controller("cryptocurrency")
@ApiTags(CryptocurrencyController.name)
@UseInterceptors(TimeoutInterceptor, TransformInterceptor)
export class CryptocurrencyController {
  public constructor(private readonly cryptocurrencyService: CryptocurrencyService) {}

  @UseGuards(JwtAuthGuard)
  @Put("favorite")
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `` })
  @ApiBearerAuth()
  async updateFavoriteCryptocurrency(
    @RequestAccount() account: PasswordlessAccount,
    @Body() favoriteCryptocurrencyDTO: FavoriteCryptocurrencyDTO,
  ): Promise<FavoriteCryptocurrency> {
    return this.cryptocurrencyService.upsertFavoriteCryptocurrencies(
      account,
      favoriteCryptocurrencyDTO,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("favorite")
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `` })
  @ApiBearerAuth()
  async getFavoriteCryptocurrencies(
    @RequestAccount() account: PasswordlessAccount,
  ): Promise<FavoriteCryptocurrency[]> {
    return this.cryptocurrencyService.getFavoriteCryptocurrencies(account);
  }
}
