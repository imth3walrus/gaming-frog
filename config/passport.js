const passport = require('passport');
const User          = require('../models/user-model');
const bcrypt        = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const FbStrategy = require('passport-facebook').Strategy;

module.exports = function (passport) {

//   passport.serializeUser((user, cb) => {
//   cb(null, user._id);
// });
//
//
//
// passport.deserializeUser((userId, cb) => {
//   User.findById(userId, (err, theUser) => {
//     if (err) {
//       cb(err);
//       return;
//     }
//
//     cb(null, theUser);
//   });
// });

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, userDocument);
  });
});

  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: 'Incorrect username' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.encryptedPassword)) {
        next(null, false, { message: 'Incorrect password' });
        return;
      }

      next(null, foundUser);
    });
  }));

  passport.use(new FbStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: "api/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  console.log(`---------------FACEBOOK PROFILE ----------------`);
  console.log(profile);

  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id,
      first_name: profile.displayName,
      pic_path: `http://graph.facebook.com/{ profile.id }/picture?type=square`
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));



};
