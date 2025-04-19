import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './auth.dto';
import config from 'src/config/config';
import { UserDto } from '../user/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ){}

  async signIn(user: UserDto): Promise<AuthResponseDto>{
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken: accessToken,
      refreshToken: "refreshToken"
    };
  }

  async signOut(): Promise<void> {
    return;
  }
}
