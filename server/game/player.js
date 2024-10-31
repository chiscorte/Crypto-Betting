module.exports = Player;

var debug = true;
function logd(message) {
  if (debug) {
    console.log(message);
  }
}

function Player(options) {
  this.id = options.id;
  this.name = options.name;
  this.chips = options.chips;
  this.game = null;

  this.firstCard = {};
  this.secondCard = {};
  this.bet = 0;

  this.lastAction = "";
  this.hasActed = false; // acted for one round (call/check/raise)
  this.hasDone = false; // finish acted for one game (fold/allin)
}

/**
 * Folds the game
 */
Player.prototype.fold = function () {
  logd("Player " + this.name + " FOLD");

  this.lastAction = "fold";
  this.hasDone = true;

  this.game.incrementPlayerTurn();
  this.game.checkForNextRound();
};

/**
 * Puts all your chips to your bet
 */
Player.prototype.allin = function () {
  logd("Player " + this.name + " ALL-IN : " + this.chips);

  this.lastAction = "allin";
  this.hasDone = true;

  this.addBet(this.chips);
  this.game.incrementPlayerTurn();
  this.game.checkForNextRound();
};

/**
 * Adds some chips to your bet
 * So that your bet is equal
 * With the highest bet in the table
 * If highest bet is 0, will do nothing
 */
Player.prototype.callOrCheck = function () {
  this.hasActed = true;

  var diff = this.game.getHighestBet() - this.bet;
  this.addBet(diff);

  if (diff > 0) {
    this.lastAction = "call";
    logd("Player " + this.name + " CALL : " + diff);
  } else {
    this.lastAction = "check";
    logd("Player " + this.name + " CHECK");
  }
  this.game.incrementPlayerTurn();
  this.game.checkForNextRound();
};

Player.prototype.shouldCheck = function () {
  var diff = this.game.getHighestBet() - this.bet;

  if (diff > 0) return false;
  else return true;
}

/**
 * Raise your bet
 * If your bet is not the same with highest bet
 * Add to your bet altogether with difference
 * @param amount
 */
Player.prototype.raise = function (amount) {
  this.lastAction = "raise";

  var diff = this.game.getHighestBet() - this.bet;
  this.addBet(diff + amount);

  logd("Player " + this.name + " Raises : " + (diff + amount));

  this.game.requestPlayerAction(); // other players must act
  this.hasActed = true;
  this.game.incrementPlayerTurn();
  this.game.checkForNextRound();
};

/**
 * Resets the player state
 */
Player.prototype.reset = function () {
  this.firstCard = {};
  this.secondCard = {};
  this.bet = 0;

  this.lastAction = "";
  this.hasActed = false;
  this.hasDone = false;
};

/**
 * Removes player's chip
 * Adds them to player's bet
 * @param amount
 */
Player.prototype.addBet = function (amount) {
  logd('this.chips'+ this.chips+ 'amount'+ amount)
  if (this.chips < amount) {
    return "error - not enough chips";
  }
  this.chips -= amount;
  this.bet += amount;
};
