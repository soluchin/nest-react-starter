import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/core/user/dtos/user.dto';
import { UserService } from 'src/core/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<UserDto> {
    const user = await this.userService.findByUsername(username);
    if(!user){
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      username,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    var userResult = new UserDto()
    userResult.id = user.id;
    userResult.username = user.username
    userResult.role = user.role.name
    userResult.permissions = user.role.permissions.map(p => p.name)

    return userResult;
  }
}
