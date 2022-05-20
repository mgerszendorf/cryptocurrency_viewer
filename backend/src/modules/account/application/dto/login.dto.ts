import { AccountConstraints } from "../../domain/enums/account-constraints.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDTO {
  @IsEmail()
  @MaxLength(AccountConstraints.EmailMaxLength)
  @ApiProperty({ example: `john.doe@mail.com` })
  public email!: string;

  @IsString()
  @MaxLength(AccountConstraints.PasswordMaxLength)
  @MinLength(AccountConstraints.PasswordMinLength)
  @ApiProperty({ example: `kigrHXCxAJ2azFhyXPFy` })
  public password!: string;
}
