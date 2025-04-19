import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadModel } from '../auth.dto';
import { Request } from 'express';
import config from 'src/config/config';
import { UserDto } from 'src/core/user/dtos/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies?.accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config().jwt.secret,
        });
    }

    async validate(payload: JwtPayloadModel) {
        var user = new UserDto()
        user.id = payload.sub;
        user.username = payload.username
        return user;
    }
}