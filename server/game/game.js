module.exports = Game;

var Player = require("./player.js");
var Deck = require("./deck.js");
var PokerEvaluator = require("poker-evaluator");
var { Hand } = require("pokersolver");

var debug = true;
function logd(message) {
  if (debug) {
    console.log(message);
  }
}

function Game() {
  // Game attributes
  this.BET = 2000;

  this.players = []; // array of Player object, represents all players in this game
  this.lastPlayer = {}
  this.round = "idle"; // current round in a game
  this.dealerPos = 0; // to determine the dealer position for each game, incremented by 1 for each end game
  this.turnPos = 0; // to determine whose turn it is in a playing game
  this.pot = 0; // accumulated chips in center of the table
  this.communityCards = []; // array of Card object, five cards in center of the table
  this.deck = new Deck(); // deck of playing cards
  this.gameoverInfo = {
    gameover: false,
    winner: "",
    gets: 0,
    matchingCards: "",
    description: "",
    amount: 0,
  };
}

/**
 * Adds new player to the game
 * @param attr
 */
Game.prototype.addPlayer = function (attr) {
  var newPlayer = new Player(attr);
  logd("Player " + newPlayer.name + " added to the game");
  newPlayer.game = this;
  this.players.push(newPlayer);
};

/**
 * remove a  player to the game
 * @param attr
 */
Game.prototype.removePlayer = function (name) {
  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].name == name) {
      this.players.splice(i, 1);

      logd("Player " + name + " removed from the game");

      return;
    }
  }
};

/**
 * Resets game to the default state
 */
Game.prototype.reset = function () {
  logd("Game reset");
  this.round = "idle";
  this.smallReset();
};

Game.prototype.smallReset = function () {
  logd("Small reset");

  for (var i = 0; i < this.players.length; i++) {
    this.players[i].reset();
  }
  
  this.lastPlayer = {}
  this.communityCards = []; // clear cards on board
  this.pot = 0; // clear pots on board
  this.deck = new Deck(); // use new deck of cards
  this.gameoverInfo = {
    gameover: false,
    winner: "",
    gets: 0,
    matchingCards: "",
    description: "",
    amount: 0,
  };
};

/**
 * Starts the 'deal' Round
 */
Game.prototype.start = function () {
  if (this.round === "idle") this.reset();
  else this.smallReset();
  logd("========== STARTING GAME ==========");

  // deal two cards to each players
  for (var i = 0; i < this.players.length; i++) {
    var c1 = this.deck.drawCard();
    var c2 = this.deck.drawCard();
    logd("Player " + this.players[i].name + " gets card : " + c1 + " & " + c2);
    this.players[i].firstCard = c1;
    this.players[i].secondCard = c2;
  }

  // determine dealer, small blind, big blind
  // modulus with total number of players
  // numbers will back to 0 if exceeds the number of players
  this.dealerPos = (this.dealerPos + 1) % this.players.length;

  logd("Player " + this.players[this.dealerPos].name + " is the dealer");
  var smallBlindPos = (this.dealerPos + 1) % this.players.length;
  var bigBlindPos = (this.dealerPos + 2) % this.players.length;

  // small and big pays blind
  this.players[smallBlindPos].addBet((1 / 2) * this.BET);
  this.players[bigBlindPos].addBet(this.BET);

  logd("Player " + this.players[smallBlindPos].name + " pays small blind : " + (1 / 2) * this.BET);
  logd("Player " + this.players[bigBlindPos].name + " pays big blind : " + this.BET);

  // determine whose turn it is
  this.turnPos = (bigBlindPos + 1) % this.players.length;
  logd("Now its player " + this.players[this.turnPos].name + "'s turn");

  // begin game, start 'deal' Round
  logd("========== Round DEAL ==========");
  this.round = "deal";
};

Game.prototype.incrementPlayerTurn = function () {
  this.lastPlayer = this.players[this.turnPos]

  do {
    this.turnPos = (this.turnPos + 1) % this.players.length;
  } while (this.players[this.turnPos].hasDone);
};

/**
 * Check if ready to begin new round
 * Round ends when all players' bet are equal,
 * With exception Fold and All-in players
 * @returns {boolean}
 */
Game.prototype.isEndRound = function () {
  var endOfRound = true;
  //For each player, check
  for (var i = 0; i < this.players.length; i++) {
    var plyr = this.players[i];
    if (!plyr.hasActed && !plyr.hasDone) {
      endOfRound = false;
    }
  }

  var doneCount = 0;

  for (var i = 0; i < this.players.length; i++) {
    var plyr = this.players[i];

    if (plyr.hasDone) {
      doneCount++;
    }
  }

  if (doneCount == this.players.length - 1) return true;

  return endOfRound;
};

Game.prototype.isEndGame = function () {
  let donePlayers = 0;

  for (const player of this.players) {
    if (player.chips === 0) donePlayers++;
  }

  if (donePlayers === this.players.length - 1) return true;
  else return false;
};

Game.prototype.foldedPlayers = function () {
  let count = 0

  for (const player of this.players) {
    if (player.hasDone) count++
  }

  return count
}

Game.prototype.isEndSmall = function () {
  if (this.round === "showdown" && this.gameoverInfo.winner) {
    return true;
  } else if (this.foldedPlayers() === this.players.length - 1) {
    return true
  } else return false;
};

/**
 * Play the next round
 */
Game.prototype.nextRound = function () {
  if (this.round === "idle") {
    this.start();
  } else if (this.round === "deal") {
    this.gatherBets();
    this.flop();
  } else if (this.round === "flop") {
    this.gatherBets();
    this.turn();
  } else if (this.round === "turn") {
    this.gatherBets();
    this.river();
  } else if (this.round === "river") {
    this.gatherBets();
    this.showdown();
  } else {
    this.start();
  }
};

/**
 * Checks if ready to next round
 * If yes, starts the next round
 */
Game.prototype.checkForNextRound = function () {
  if (this.isEndRound()) {
    logd("begin next round");
    this.nextRound();
  } else {
    logd("cannot begin next round");
  }
};

/**
 * Starts the 'flop' Round
 */
Game.prototype.flop = function () {
  logd("========== Round FLOP ==========");
  this.round = "flop";
  // deal three cards in board
  this.communityCards[0] = this.deck.drawCard();
  this.communityCards[1] = this.deck.drawCard();
  this.communityCards[2] = this.deck.drawCard();
  // begin betting
  logd("Community cards : " + this.communityCards[0] + ", " + this.communityCards[1] + ", " + this.communityCards[2]);
  // other players must act
  this.requestPlayerAction();
};

/**
 * Starts the 'turn' Round
 */
Game.prototype.turn = function () {
  logd("========== Round TURN ==========");
  this.round = "turn";
  // deal fourth card
  this.communityCards[3] = this.deck.drawCard();
  // begin betting
  logd(
    "Community cards : " +
      this.communityCards[0] +
      ", " +
      this.communityCards[1] +
      ", " +
      this.communityCards[2] +
      ", " +
      this.communityCards[3]
  );
  // other players must act
  this.requestPlayerAction();
};

/**
 * Starts the 'river' Round
 */
Game.prototype.river = function () {
  logd("========== Round RIVER ==========");
  this.round = "river";
  // deal fifth card
  this.communityCards[4] = this.deck.drawCard();
  // begin betting
  logd(
    "Community cards : " +
      this.communityCards[0] +
      ", " +
      this.communityCards[1] +
      ", " +
      this.communityCards[2] +
      ", " +
      this.communityCards[3] +
      ", " +
      this.communityCards[4]
  );
  // other players must act
  this.requestPlayerAction();
};

/**
 * Starts the 'showdown' Round
 */
Game.prototype.showdown = function () {
  logd("========== SHOWDOWN ==========");
  this.round = "showdown";
  // gather all hands
  var hands = [];
  for (var i = 0; i < this.players.length; i++) {
    hands.push([
      this.players[i].firstCard,
      this.players[i].secondCard,
      this.communityCards[0],
      this.communityCards[1],
      this.communityCards[2],
      this.communityCards[3],
      this.communityCards[4],
    ]);
  }
  // evaluate all cards
  var evalHands = [];
  for (i = 0; i < hands.length; i++) {
    evalHands.push(PokerEvaluator.evalHand(hands[i]));
  }
  logd(
    "Community cards : " +
      this.communityCards[0] +
      ", " +
      this.communityCards[1] +
      ", " +
      this.communityCards[2] +
      ", " +
      this.communityCards[3] +
      ", " +
      this.communityCards[4]
  );
  // get highest value
  var highestVal = -9999;
  var highestIndex = -1;
  for (i = 0; i < evalHands.length; i++) {
    logd(
      "Player " +
        this.players[i].name +
        " : " +
        this.players[i].firstCard +
        ", " +
        this.players[i].secondCard +
        " | strength : " +
        evalHands[i].value +
        " | " +
        evalHands[i].handName
    );
    if (highestVal < evalHands[i].value) {
      highestVal = evalHands[i].value;
      highestIndex = i;
    }
  }
  logd("Player " + this.players[highestIndex].name + " wins with " + evalHands[highestIndex].handName);
  // set gameover info
  var hand = Hand.solve(hands[highestIndex]);

  this.gameoverInfo = {
    gameover: this.isEndGame(),
    winner: this.players[highestIndex].name,
    gets: evalHands[highestIndex].handName,
    matchingCards: hand.toString(),
    description: hand.descr,
    amount: this.pot,
  };

  this.givePotToWinner();
};

/**
 * Get the highest bet from all players
 * @returns {number} highestBet
 */
Game.prototype.getHighestBet = function () {
  var highestBet = -999;
  for (var i = 0; i < this.players.length; i++) {
    if (highestBet < this.players[i].bet) {
      highestBet = this.players[i].bet;
    }
  }
  return highestBet;
};

/**
 * Collect all bets from players to the board's pot
 */
Game.prototype.gatherBets = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.pot += this.players[i].bet;
    this.players[i].bet = 0;
  }
  logd("Total Pot : " + this.pot);
};

Game.prototype.givePotToWinner = function () {
  for (const player of this.players) {
    if (player.name === this.gameoverInfo.winner) {
      player.chips += this.pot;
      this.pot = 0;
      return;
    }
  }
};

/**
 * returns the player whose current turn it is
 * @returns {Player}
 */
Game.prototype.getCurrentPlayer = function () {
  return this.players[this.turnPos];
};

/**
 * Sets all players' hasActed to false
 */
Game.prototype.requestPlayerAction = function () {
  for (var i = 0; i < this.players.length; i++) {
    if (!this.players[i].hasDone) {
      this.players[i].hasActed = false;
    }
  }
};
