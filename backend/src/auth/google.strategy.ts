import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // http://localhost:4000/api/auth/google/callback
      scope: ['profile', 'email'],
    });
  }

  async validate(_a: string, _r: string, profile: any, done: VerifyCallback) {
    // aquí buscas/creas al usuario; devuelve lo mínimo que necesites
    const user = {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    };
    return done(null, user);
  }
}
