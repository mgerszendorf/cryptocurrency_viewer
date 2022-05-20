import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { RefreshJwtAuthGuard } from "../guards/jwt-refresh.guard";

export const RequestRefreshToken = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const refreshToken = ctx.switchToHttp().getRequest()?.body?.refreshToken;

  if (!refreshToken) {
    throw new TypeError(
      `Refresh token could not be found on request object. Did you add the ${RefreshJwtAuthGuard.name} to the controller method?`,
    );
  }

  return refreshToken;
});
