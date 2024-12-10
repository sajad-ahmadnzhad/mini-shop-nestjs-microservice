import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { DoneCallback, Profile } from "passport";
import { Strategy } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
            scope: ['email', 'profile']
        })
    }

    validate(_accessToken: string, _refreshToken: string, profile: Profile, done: DoneCallback) {
        if (!profile.emails?.length) return done(null)

        const user = {
            full_name: profile.displayName,
            email: profile.emails[0].value,
            avatarURL: profile.photos[0].value,
            username: profile.username || profile.emails[0].value.split('@')[0],
            is_verify_email: true
        }


        return done(null, user)
    }
}