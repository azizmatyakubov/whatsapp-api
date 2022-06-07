import GoogleStrategy from 'passport-google-oauth20';

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
        const user = {
            _id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
        };
        done(null, user);
    }
);

export default googleStrategy;