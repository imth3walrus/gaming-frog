const express  = require('express');
const passport = require('passport');
const bcrypt   = require('bcrypt');

const User     = require('../models/user-model');

const authRoutes = express.Router();

/*-------------Start |---------------------------*/
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
/*--------------End|--------------------------*/


/*-------------Start |---------------------------*/
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
/*--------------End|--------------------------*/


authRoutes.post('/signup', (req, res, next) => {
  console.log('---------------------HI-------------');
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password.' });
    return;
  }

  console.log('---------------------PASSED FIRST-------------');

  User.findOne({ username }, '_id', (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong.' });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'The username already exists.' });
      return;
    }

    console.log('---------------------PASSED REQS-------------');

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
    console.log('------------------------------USER-------------');
    console.log(theUser);

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




// ------------ LOGIN OPTION A ------------
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

// ------------ LOGIN OPTION B ------------
// authRoutes.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, theUser, failureDetails) => {
//     if (err) {
//       res.status(500).json({ message: 'Something went wrong.' });
//       return;
//     }
//
//     if (!theUser) {
//       res.status(401).json(failureDetails);
//       return;
//     }
//
//     req.login(theUser, (err) => {
//       if (err) {
//         res.status(500).json({ message: 'Something went wrong.' });
//         return;
//       }
//
//       res.status(200).json(req.user);
//     });
//   })(req, res, next);
// });

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success.' });
});

// authRoutes.get('/loggedin', (req, res, next) => {
//   console.log('-----------PASSING INFO--------');
//   console.log(req.user);
//   if (req.isAuthenticated()) {
//     res.status(200).json(req.user);
//     return;
//   }
//
//   res.status(401).json({ message: 'Unauthorized.' });
// });

authRoutes.get('/loggedin', ensureLoggedIn, (req, res, next) => {
  console.log('-----------PASSING INFO--------');
  console.log(req.user);
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);

  }else{
    return res.status(401).json({ message: 'Unauthorized.' });

  }

});


function notLoggedIn (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'FORBIDDEN.' });
    return;
  }

  next();
}

authRoutes.get('/private', notLoggedIn, (req, res, next) => {
  res.json({ message: 'Todays lucky number is 7677' });
});


module.exports = authRoutes;
