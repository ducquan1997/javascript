'use strict';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const displayMessage = function (message) {
  $('.message').textContent = message;
};
const displayScore = function (score) {
  $('.score').textContent = score;
};

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

$('.check').addEventListener('click', function () {
  const guess = Number($('.guess').value);
  console.log(guess);

  // No Input
  if (!guess) {
    displayMessage('⛔ No Number!');

    // Winner
  } else if (guess === secretNumber) {
    $('.number').textContent = secretNumber;
    displayMessage('🎉 Correct Number!');
    $('body').style.backgroundColor = '#60b347';
    $('.number').style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      $('.highscore').textContent = highscore;
    }

    // Wrong Number
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? '📈 Too High!' : '📉 Too Low!');
      score--;
      displayScore(score);
    } else {
      displayMessage('😑 You lose!');
      displayScore(0);
    }
  }
});

$('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  displayMessage('Start guessing...');
  displayScore(score);
  $('.number').textContent = '?';
  $('.guess').value = '';
  $('body').style.backgroundColor = '#222';
  $('.number').style.width = '15rem';
});
