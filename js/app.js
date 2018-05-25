$(document).ready(function () {

  let game = {
    $modal: $('.modal'),
    $play: $('.play'),
    $stars: $('.fa-star'),
    $starOne: $('.star-one'),
    $starTwo: $('.star-two'),
    $moves: $('.moves'),
    $pluralMoves: $('.plural-moves'),
    $stopwatch: $('.stopwatch'),
    $hours: $('.hours'),
    $minutes: $('.minutes'),
    $seconds: $('.seconds'),
    $restart: $('.restart'),
    $deck: $('.deck'),
    $card: $('.card'),
    $cardIcon: $('.card').find('.fa'),

    // calculate total moves to start stopwatch
    movesCounter: 0,

    //added the inteval value as an object property (to be asseced by all methods)
    // to stop interval (clearInterval())
    interval: '',

    // creates a temporary array the holds the two cards and compare between them
    tempArr: [],

    /*
     * Create a list that holds all of your cards
     */
    cardsArray: [
      'fa-diamond', 'fa-diamond',
      'fa-paper-plane-o', 'fa-paper-plane-o',
      'fa-anchor', 'fa-anchor',
      'fa-bolt', 'fa-bolt',
      'fa-cube', 'fa-cube',
      'fa-leaf', 'fa-leaf',
      'fa-bicycle', 'fa-bicycle',
      'fa-bomb', 'fa-bomb'
    ],

    //@description init function to start app
    init: function () {
      game.shuffle(this.cardsArray);
      game.assignCards();
      game.eventListners();

    },

    eventListners: function () {

      game.$card.on('click', function () {
        game.movesCounter++;
        if (game.movesCounter === 1) {
          game.startTimer();
        }

        console.log(game);

        // @description if card was clicked before, ignore it.
        if ($(this).hasClass('open')) {
          return;
        }

        //@description check if the temporary array (tempArr) has less than two values:
        // 1. push to tempArr
        // 2. Add '.open' & '.show' classes
        if (game.tempArr.length < 2) {
          game.tempArr.push(this);
          $(this).addClass('open show');

          // console.log(game.tempArr[0].children[0].className);

          //@description if tempArr has two values
          // 1. compare if they has same classes
          // 2. else if they have different classes
          if (game.tempArr.length == 2) {

            // [1.]
            if (game.tempArr[0].children[0].className === game.tempArr[1].children[0].className) {
              game.tempArr[0].classList.add('match', 'animated', 'bounce');
              game.tempArr[1].classList.add('match', 'animated', 'bounce');
              setTimeout(function () {
                game.tempArr[0].classList.remove('animated', 'bounce');
                game.tempArr[1].classList.remove('animated', 'bounce');
                game.tempArr = [];
              }, 1000);

              // [2.]
              //@description if two cards doesn't match
              // 1. show how many wrong moves the user has done
              // 2. check if moves are plural or single to add the move('s')
              // 3. add animation classes and then remove them with timeout
            } else {
              // [1.]
              var value = parseInt(game.$moves.text(), 10) + 1;
              game.$moves.text(value);

              // [2.]
              if (value === 1) {
                game.$pluralMoves.text('');
              }else {
                game.$pluralMoves.text('s');
              }

              // [3.]
              game.tempArr[0].classList.add('animated', 'shake');
              game.tempArr[1].classList.add('animated', 'shake');
              setTimeout(function () {
                game.tempArr[0].classList.remove('animated', 'shake');
                game.tempArr[1].classList.remove('animated', 'shake');
                game.tempArr[0].classList.remove('open', 'show');
                game.tempArr[1].classList.remove('open', 'show');
                game.tempArr = [];
              }, 750);
            }
          }
        }

        //@description if wrong moves more than seven collapse 1 star
        if (game.$moves.text() > 7) {
          game.$starOne.css('color', '#212529');
        }

        //@description if wrong moves more than twelve collapse the other star
        if (game.$moves.text() > 12) {
          game.$starTwo.css('color', '#212529');
        }

        game.gameEnded();
      });

      game.$restart.on('click', game.restart);

      game.$play.on('click', game.restart);

    },

    restart: function () {
              game.tempArr = [];
              game.movesCounter = 0;
              game.$moves.text(0);
              game.$pluralMoves.text('');
              game.shuffle(game.cardsArray);

              game.$card.each(function (i) {
                game.$card.removeClass();
                game.$card.addClass('card');
              });

              game.$cardIcon.each(function (i) {
                game.$cardIcon.removeClass();
                game.$cardIcon.addClass('fa');
              });

              game.$stars.each(function (i) {
                game.$stars[i].style.color = '#fd7e14';
              });

              game.assignCards();

              // clearInterval(game.interval);
              // TODO: like 5 hours trying to figure out how this worked..
              // I tried clearInterval(game.interval);
              // TODO: I figured it out now.. I started another setInterval on every user click on a card
              // this changed the returned key value of setInterval method thats why I couldn't stop it.
              game.stopTimer();

              // console.log('hiiii');
            },

    // Shuffle function from http://stackoverflow.com/a/2450976
    //@param array
    //@return shuffledarray
    shuffle: function (array) {

      // TODO: I don't understand the multiple var declaration
      var currentIndex = array.length,
        temporaryValue, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },

    //@description assign the shuffled array to each card
    assignCards: function () {
      game.$cardIcon.each(function (i) {
        $(this).addClass(game.cardsArray[i]);
      });
    },

    //@description a function that starts the timer
    startTimer: function () {
      var seconds = parseInt(game.$seconds.text(), 10);
      var minutes = parseInt(game.$minutes.text(), 10);
      var hours = parseInt(game.$hours.text(), 10);

      // game.interval();
      game.interval = setInterval(function () {
        seconds++;
        if (seconds == 60) {
          minutes++;
          seconds = 0;
        }

        if (minutes == 60) {
          hours++;
          minutes = 0;
        }

        game.$seconds.text(seconds <= 9 ? '0' + seconds : seconds);
        game.$minutes.text(minutes <= 9 ? '0' + minutes : minutes);
        game.$hours.text(hours <= 9 ? '0' + hours : hours);
      }, 1000);
    },

    //@description function to clearInterval
    stopTimer: function () {
      clearInterval(game.interval);
      game.interval = '';
      game.$seconds.text('00');
      game.$minutes.text('00');
      game.$hours.text('00');
    },

    //@description function to show modal after winning
    gameEnded: function () {
      var matchCounter = 0;
      game.$card.each(function (i) {
        // console.log(game.$card[i].classList.contains('match'));
        if (game.$card[i].classList.contains('match')) {
          ++matchCounter;
        }
      });

      if (matchCounter === 16) {
        clearInterval(game.interval);
        game.$modal.modal('show');
      }

      // console.log(matchCounter);
    }
  };
  game.init();
});
