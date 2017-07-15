const express  = require('express');
const passport = require('passport');
const bcrypt   = require('bcrypt');

const User     = require('../models/user-model');

const authRoutes = express.Router();

//function to make sure you are not log in
function ensureNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.status(403).json({
      Emesssage: 'Unauthorized'
    });
    return;
  }
  next();
  return;
}

//function to make sure you are logged in
function ensureLoggedIn(req, res, next) {

  if (!req.isAuthenticated()) {
    console.log(req.isAuthenticated());
    return res.status(403).json({
      Emessage: 'Unauthorized'
    });
  }
  next();

  return;
}


authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password.' });
    return;
  }

  User.findOne({ username }, '_id', (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong.' });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'The username already exists.' });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser  = new User({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      age: req.body.age,
      xbox_gamertag: req.body.xboxgamertag,
      psn_id: req.body.psnid,
      email: req.body.email,
      username,
      encryptedPassword: hashPass,
    });

    theUser.save((err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }
      console.log('--------------------USER SAVED-------------');
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong.' });
          return;
        }

        res.status(200).json(req.user);
      });
    });
  });
});




// ------------ LOGIN ROUTE ------------
authRoutes.post('/login', ensureNotLoggedIn, (req, res, next) => {
  const passportFunction = passport.authenticate('local',
    (err, theUser, failureDetails) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

      if (!theUser) {
        res.status(401).json(failureDetails);
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong.' });
          return;
        }

        res.status(200).json(req.user);
      });
    }
  );

  passportFunction(req, res, next);
});

//--------------Logout Route-------------
authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({ message: 'Success.' });
});

authRoutes.get('/loggedin', ensureLoggedIn, (req, res, next) => {
  console.log('-----------PASSING INFO--------');
  console.log(req.user);
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }else{
    return res.status(401).json({ message: 'Unauthorized.' });

  }

});

// ---------FACEBOOK LOGIN ROUTES-------
authRoutes.get('/auth/facebook', passport.authenticate('facebook'));
authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook',
  (err, theUser, failureDetails) => {
  if (err) {
    res.status(500).json({ message: 'Something went wrong.' });
    return;
  }

  if (!theUser) {
    res.status(401).json(failureDetails);
    return;
  }

  req.login(theUser, (err) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong.' });
      return;
    }

    res.status(200).json(req.user);
  });
  }
));

// -----NOT LOGGEDIN OPTION B---------
// function notLoggedIn (req, res, next) {
//   if (!req.isAuthenticated()) {
//     res.status(403).json({ message: 'FORBIDDEN.' });
//     return;
//   }
//
//   next();
// }

authRoutes.get('/private', ensureLoggedIn, (req, res, next) => {
  res.json({ message: 'Todays lucky number is 7677' });
});


module.exports = authRoutes;
