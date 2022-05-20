import omit from "lodash.omit";
import { AccountService } from "../services/account.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { LocalAuthGuard } from "../guards/local.guard";
import { LoginDTO } from "../dto/login.dto";
import { PasswordlessAccount } from "../../domain/types/passwordless-account.type";
import { PasswordlessAccountWithTokens } from "../../domain/types/passwordless-account-with-tokens.type";
import { Public } from "../../../common/application/decorators/public-route.decorator";
import { RefreshJwtAuthGuard } from "../guards/jwt-refresh.guard";
import { RegisterDTO } from "../dto/register.dto";
import { RequestAccount } from "../decorators/request-account.decorator";
import { RequestRefreshToken } from "../decorators/request-refresh-token.decorator";
import { TimeoutInterceptor } from "../../../common/application/interceptors/timeout.interceptor";
import { Tokens } from "../../domain/types/tokens.type";
import { TransformInterceptor } from "../../../common/application/interceptors/transform.interceptor";

@Controller("accounts")
@ApiTags(AccountController.name)
@UseInterceptors(TimeoutInterceptor, TransformInterceptor)
export class AccountController {
  public constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    description: `Currently logged account retrieved`,
  })
  @ApiBearerAuth()
  async currentAccount(
    @RequestAccount() account: PasswordlessAccount,
  ): Promise<PasswordlessAccount | null> {
    const existingAccount = await this.accountService.findByEmail(account.email);

    return omit(existingAccount, [`password`]);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `Logged in` })
  async login(
    @Body() _loginDTO: LoginDTO,
    @RequestAccount() account: PasswordlessAccount,
  ): Promise<PasswordlessAccountWithTokens> {
    const tokens = await this.accountService.authenticateWithCredentials(account);

    return {
      account,
      tokens,
    };
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: `Account created` })
  async register(@Body() registerDTO: RegisterDTO): Promise<void> {
    return this.accountService.register(registerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `Logged out` })
  @ApiBearerAuth()
  async logout(@RequestAccount() account: PasswordlessAccount): Promise<void> {
    return this.accountService.logout(account);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `Access token refreshed` })
  async refreshToken(
    @RequestAccount() account: PasswordlessAccount,
    @RequestRefreshToken() token: string,
  ): Promise<Tokens> {
    return this.accountService.authenticateWithRefreshToken(account, token);
  }
}
