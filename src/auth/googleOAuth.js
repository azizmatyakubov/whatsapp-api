import GoogleStrategy from 'passport-google-oauth20';
import User from '../api/users/model.js';
import { generateAccessToken } from './tool.js';

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
    },
    
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            const user = {
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
            };
         
    
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                const newUser = new User(user);
                await newUser.save();
                const accessToken = await generateAccessToken({ _id: newUser._id });
                done(null, {accessToken});
            } else { 
                const accessToken = await generateAccessToken({ _id: existingUser._id });
                done(null, {accessToken});
            }

        } catch (error) {
            console.log(error)
        }

       

        
    }
);

export default googleStrategy;