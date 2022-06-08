'use strict';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Selecting Element
const diceEl = $('.dice');
const btnNew = $('.btn--new');
const btnRoll = $('.btn--roll');
const btnHold = $('.btn--hold');
const player0 = $('.player--0');
const player1 = $('.player--1');

let scores, currentScore, activePlayer, playing;

// Start
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  $('#score--0').textContent = 0;
  $('#score--1').textContent = 0;
  $('#current--0').textContent = 0;
  $('#current--1').textContent = 0;

  diceEl.classList.add('hidden');
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
  $(`.player--${activePlayer}`).classList.add('player--active');
};

init();

// Switch Player
const switchPlayer = function () {
  currentScore = 0;
  $(`#current--${activePlayer}`).textContent = currentScore;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

// Roll dice
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. Roll dice random
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // 3. Check dice 1
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      $(`#current--${activePlayer}`).textContent = currentScore;
    } else {
      // Switch to next player
      switchPlayer();
    }
  }
});

// Hold dice
btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. Add current score to active player's score
    scores[activePlayer] += currentScore;
    $(`#score--${activePlayer}`).textContent = scores[activePlayer];

    // 2. Check if player's score get 100.
    if (scores[activePlayer] >= 100) {
      playing = false;
      $(`.player--${activePlayer}`).classList.add('player--winner');
      $(`.player--${activePlayer}`).classList.remove('player--active');
      diceEl.classList.add('hidden');
    } else {
      // Switch player
      switchPlayer();
    }
  }
});

// Reset
btnNew.addEventListener('click', init);
