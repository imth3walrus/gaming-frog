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

// create a new match
gameRoutes.post('/match', ensureLoggedIn, (req, res, next) => {

  const theEscrow = new Escrow({
    total_funds: req.body.bet
  });
  theEscrow.save((err, matchEscrow) => {
    console.log(matchEscrow);
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

    theGame.save((err, newMatch) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

        res.status(200).json(newMatch);
      });
    });
});

// get all matches
gameRoutes.get('/matches', ensureLoggedIn, (req, res, next) => {
  Game.
  find()
  .sort({"createdAt": -1})
  .exec((err, theGames) => {
    if(err) {
      next(err);
      return;
    }

    res.status(200).json(theGames);
  });
});

// get match details
gameRoutes.get('/match/:id', (req, res, next) => {
    //                         |
  const gameId = req.params.id;

  Game.
  findOne({ _id: gameId})
  .exec((err, theGame) => {
    if(err) {
      next(err);
      return;
    }
    res.status(200).json(theGame);
  });
});

// get user matches
gameRoutes.get('/my-matches', (req, res, next) => {

  const userId = req.user._id;

  Game.
  // find({ owner: userId})
  find({ $or: [ { owner: userId }, { opponent: userId } ] })
  .exec((err, theGame) => {
    if(err) {
      next(err);
      return;
    }
    res.status(200).json(theGame);
  });
});

// join open match
gameRoutes.post('/match/join/:id', ensureLoggedIn, (req, res, next) => {
  const gameId = req.params.id;

  Game.
  findOne({ _id: gameId})
  .sort({"createdAt": -1})
  .exec((err, theGame) => {
    if(err) {
      next(err);
      return;
    }
    // control to prevent users from joining their own match
    if (theGame.owner._id.equals(req.user._id)) {
      res.status(500).json({ message: 'You cant join your own match.' });
      return;
    }
    // control to prevent multiple users from joining the same match
    if (typeof theGame.opponent != 'undefined') {
      res.status(500).json({ message: 'Match is already joined by another user.' });
      return;
    }

    theGame.opponent = req.user._id;
    theGame.match_status = "joined";

    theGame.save((err) => {
      if (err) {
          next(err);
          return;
      }
      res.status(200).json({message: 'Joined Match Successfully'});

    });
  });
});

// post match results
gameRoutes.post('/match/result/:id', ensureLoggedIn, (req, res, next) => {
  const gameId = req.params.id;

  Game.
  findOne({ _id: gameId})
  .exec((err, theGame) => {
    if(err) {
      next(err);
      return;
    }
    // control to prevent users from submiting empty results
    if (req.body.ownerResult === null || typeof req.body.opponentResult === null) {
      res.status(500).json({ message: 'Please enter the result for both the owner and your opponent.' });
      return;
    }
    // control to prevent users from submitting results with no opponent
    if (typeof theGame.opponent === 'undefined') {
      res.status(500).json({ message: 'Cant enter results without an opponent!' });
      return;
    }

    theGame.score_owner = req.body.ownerResult;
    theGame.score_opponent = req.body.opponentResult;
    theGame.match_status = "completed";

    theGame.save((err) => {
      if (err) {
          next(err);
          return;
      }
      res.status(200).json({message: 'Results entered Successfully'});

    });
  });
});




module.exports = gameRoutes;
