import { Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/passport-local.guard';
import { Response } from 'express';
import { permission } from 'process';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() request, @Res({ passthrough: true }) response: Response){
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Logout successful' };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getUserInfo(@Request() request) {
    return request.user;
  }
}
