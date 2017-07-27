const express = require('express');
const mongoose = require('mongoose');
const Game = require('../models/game-model.js');
const Chat = require('../models/chat-model.js');
const Escrow = require('../models/escrow-model.js');
const User = require('../models/user-model.js');

const gameRoutes = express.Router();

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

authRoutes.post('/match', ensureLoggedIn, (req, res, next) => {

  const theEscrow = new Escrow({
    total_funds: req.body.bet
  });
  theEscrow.save((matchEscrow, err) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong.' });
      return;
    }

    const theGame  = new Game({
      console: req.body.console,
      half_lenght: req.body.halflength,
      teams: req.body.teams,
      teams_level: req.body.teamlevel,
      bet: req.body.bet,
      owner: req.user._id,
      escrow: matchEscrow._id
    });

    theGame.save((err) => {
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

router.get('/games', ensureLoggedIn, (req, res, next) => {
  Game.
  find()
  .exec((err, theGames) => {
    if(err) {
      next(err);
      return;
    }
    console.log('--------------->');
    console.log(theGames);

    res.status(200).json(theGames);
  });
});




module.exports = gameRoutes;
