import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'trszhq!@$#%^*&()weqzaq',
    });
  }

  async validate(payload) {
    return {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}

