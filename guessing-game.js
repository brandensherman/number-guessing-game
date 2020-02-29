const previousGuess = document.querySelectorAll('.prev-guess');
const guessText = document.querySelector('.guess-text');
const textInput = document.querySelector('.text-input');
const submitBtn = document.querySelector('.btn-submit');
const resetBtn = document.querySelector('.btn-reset');
const hintBtn = document.querySelector('.btn-hint');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(arr) {
  let length = arr.length;

  while (length) {
    let i = Math.floor(Math.random() * length--);
    let temp = arr[length];
    arr[length] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

class Game {
  constructor(playersGuess) {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.count = 0;
    this.hint = this.provideHint();
    this.gameWon = false;
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  playersGuessSubmission(num) {
    let numbers = '123456789';

    if (numbers.includes(num[0])) {
      num = +num;
    }

    if (this.gameWon === true) {
      return;
    } else if (typeof num !== 'number') {
      guessText.innerText = 'That is an invalid guess.';
      textInput.value = '';
      throw 'That is an invalid guess.';
    } else if (num < 1 || num > 100) {
      guessText.innerText = 'That is an invalid guess.';
      textInput.value = '';
      throw 'That is an invalid guess.';
    } else {
      this.playersGuess = num;

      // Set text to indicate hot or cold
      guessText.innerText = this.checkGuess(this.playersGuess);
      return this.checkGuess(this.playersGuess);
    }
  }

  checkGuess(guess) {
    if (guess === this.winningNumber) {
      this.gameWon = true;
      return 'You Win!';
    } else if (this.pastGuesses.includes(guess)) {
      return 'You have already guessed that number.';
    } else if (
      this.playersGuess !== this.winningNumber &&
      !this.pastGuesses.includes(guess)
    ) {
      // Set previous guess text for player to see
      if (this.count < 4) {
        previousGuess[this.count].innerText = guess;
      }

      this.count++;
      this.pastGuesses.push(guess);

      if (this.count === 5) {
        return 'You Lose.';
      }
    }

    let difference = this.difference();

    if (difference < 10) {
      return "You're burning up!";
    } else if (difference < 25 && difference >= 10) {
      return "You're lukewarm.";
    } else if (difference < 50 && difference >= 25) {
      return "You're a bit chilly.";
    } else if (difference < 100 && difference >= 50) {
      return "You're ice cold!";
    }
  }

  provideHint() {
    let hint = [
      this.winningNumber,
      generateWinningNumber(),
      generateWinningNumber()
    ];

    return shuffle(hint);
  }
}

function newGame() {
  return new Game();
}

function playGame() {
  const game = newGame();
  let hintCount = 0;

  // Event Listeners
  submitBtn.addEventListener('click', e => {
    e.preventDefault();

    game.playersGuessSubmission(textInput.value);
    textInput.value = '';
  });

  resetBtn.addEventListener('click', () => {
    return newGame();
  });

  hintBtn.addEventListener('click', e => {
    e.preventDefault();

    if (hintCount < 1) {
      hintCount++;
      guessText.innerText = game.hint.join(' ');
    }
  });
}

playGame();

// Rules Menu
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
