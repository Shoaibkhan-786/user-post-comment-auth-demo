const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const userModel = require('../model/usermodel')

passport.use("login", new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        try {

            let user = await userModel.findOne({ email, isDeleted: false });

            if (!user) {
                return done(null, false, { message: "user not exist" });
            }
            const validate = await user.checkPassword(password);
            if (!validate)
                return done(null, false, { message: 'Incorrect password' });


            return done(null, user, { message: "Logged In Successfull" });
        } catch (error) {
            console.log(error)
            done(error);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(async function (id, done) {
    try {
        const user = await userModel.findOne({ _id: id, isDeleted: false });
        done(null, user)

    } catch (err) {
        done(err);
    }
});
