import { IsNotEmpty, IsString } from "class-validator";

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class JwtPayloadModel {
  sub: string;
  username: string;
  role?: string;
  permissions?: string[];
}

export class LoginDto{
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}