import { Controller, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/passport-local.guard';
import { Response } from 'express';
import { permission } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() request, @Res() response: Response){
    const tokens = await this.service.signIn(request.user);
    response.cookie('accessToken', tokens.accessToken, {
      sameSite: 'strict'
    });
    return {
      message: 'Login Success',
      userId: request.user?.id || null,
      username: request.user?.username || null,
      role: request.user?.role || null,
      permissions: request.user?.permissions || [],
    }
  }
}
