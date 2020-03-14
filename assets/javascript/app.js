// VARIABLES

var arrQuestions = [{
        questionText: "Who created Javascript?",
        answers: {
            a: {answerText: "Microsoft",
                correct: false},
            b: {answerText: "Sun Microsystems",
                correct: false},
            c: {answerText: "Oracle",
                correct: false},
            d: {answerText: "Netscape",
                correct: true}
        }
    },
    {
        questionText: "JavaScript wasn’t always called that. What other names has it been released under?",
        answers: {
            a: {answerText: "Latte",
                correct: false},
            b: {answerText: "Mocha",
                correct: true},
            c: {answerText: "LiveScript",
                correct: true},
            d: {answerText: "BScript",
                correct: false},
            e: {answerText: "Spidermonkey",
                correct: false}
        }
    },
    {
        questionText: "JavaScript and Java are basically the same.",
        answers: {
            a: {
                answerText: "Yes",
                correct: false
            },
            b: {
                answerText: "No",
                correct: true
            },
        }
    },
    {
        questionText: "Which of the following is not a reserved word in JavaScript?",
        answers: {
            a: {
                answerText: "default",
                correct: false
            },
            b: {
                answerText: "finally",
                correct: false
            },
            c: {
                answerText: "throw",
                correct: false
            },
            d: {
                answerText: "undefined",
                correct: true
            }
        }
    }
];



const allowedTime = 10;
const defaultDelay = 3000;
var gamePaused = true;
var quesitonsCorrect;
var timeCounter;
var questionTimer;
var curQuestion = {};
var arrHelper = [];
var $divQuestion = $("#question-container");
var $divAnswers = $("#answer-container");
var $pTimerOrStatus = $("#timer-status");
var $divGameMessage = $("#game-message");
$startButton = $("<button>").attr({
    "id": "start-button",
    "class": "h1 btn btn-lg btn-success ml-3 mb-5 font-weight-bold"
});



// FUNCTIONS ----------------------------------------------------------------

function startGame() {
    // initialize helper (question tracking) array
    arrHelper.length = arrQuestions.length;
    arrHelper = arrHelper.fill(0, 0, arrQuestions.length);
    
    // clear timer text, reset questionsCorrect counter, and display question
    $pTimerOrStatus.attr("class", "h2 p-3 text-black").text("");
    quesitonsCorrect = 0;
    displayNextQuestion();
}

function displayNextQuestion(choseWisely) {
    // pause the game (disable some click events)
    gamePaused = false;
    // clear the game message container; clear the question timer
    $divGameMessage.empty();
    clearInterval(questionTimer);
    // check if there are still questions to play...
    if (arrHelper.indexOf(0) >= 0) {
        // still more questions, select next question:
        for (var i = 0; arrHelper.length; i++) {
            if (arrHelper[i] == 1) {
                // skip this question, it's already been played.
                continue; // <-- move to the next iteration.
            } else {
                // render multiple-choice answers:
                arrHelper[i] = 1; // <- tag the questions as played in question tracking array
                curQuestion = arrQuestions[i]; // <- set global current question object
                $divQuestion.empty(); // <- clear the question container
                $divQuestion.append($("<h3>").text(curQuestion.questionText));
                $("h3").attr("class", "h3 p-3");
                $divAnswers.empty();
                // foreach to loop through questions answers,
                //  style and append to DOM:
                Object.entries(curQuestion.answers).forEach(([key, prop]) => {
                    $divAnswers.append($("<h5>").attr({
                        "id": key,
                        "class": "choice h5 p-3 d-table"
                    }).text("○ " + prop.answerText));
                });
                // start the timer:
                startTimer(allowedTime);
                break;
            }
        }
    } else {
        // ...no more questions to play, game over
        gameOver();
    }
}

function displayCorrectAnswer() {
    // loop through answers and display if the correct answer(s) 
    //      trying for..in method of looping through objects
    let correctAnswerCount = 0;
    let correctAnswerText = "";
    for (var key in curQuestion.answers) {
        if (curQuestion.answers.hasOwnProperty(key)) {
            if (curQuestion.answers[key].correct) {
                $("#" + key + ".choice").addClass("bg-success");
                correctAnswerCount++;
                if (correctAnswerCount > 1) {
                    correctAnswerText = correctAnswerText + ", "
                };
                correctAnswerText = correctAnswerText + curQuestion.answers[key].answerText;
            } else {
                $("#" + key + ".choice").addClass("bg-danger");
            }
            if (correctAnswerCount > 1) {
                $("#game-message").text("Correct answers are: \"" + correctAnswerText + "\"")
            } else {
                $("#game-message").text("Correct answer is: \"" + correctAnswerText + "\"")
            };
        }
    }
}

function displayResult(){
    let resultText =
        "You got " + quesitonsCorrect.toString() +
        " of " + arrQuestions.length.toString() + " questions correct.";
    $("#game-message").text(resultText);
}

function startTimer(startTime) {
    // start the question time count down
    timeCounter = startTime;
    $pTimerOrStatus.attr("class", "h2 p-3 text-black").text("Time Left: " + timeConverter(timeCounter));
    questionTimer = setInterval(timerInterval, 1000)
}

function timerInterval() {
    // update and display countdown timer
    timeCounter--;
    $pTimerOrStatus.text("Time Left: " + timeConverter(timeCounter));
    // check if times up....
    if (timeCounter <= 0) {
        // ...time is up
        clearInterval(questionTimer);
        timesUp();
    }
}

function timesUp() {
    gamePaused = true; // pause game while 'times up' text is displayed
    // display 'times up' text and call the next question function after a few seconds
    $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Time's Up!");
    displayCorrectAnswer()
    setTimeout(displayNextQuestion, defaultDelay);
}

function gameOver() {
    gamePaused = true; // pause game until user selects Reset or reloads
    
    // display "game over" text
    $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Game Over");
    // show quiz results
    displayResult();
    // display start over button
    $("#question-container").prepend($startButton.text("Start Over?"));
    //
}

function timeConverter(t) {
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes === 0) {
        minutes = "00";
    } else if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return minutes + ":" + seconds;
}

function moveOut(element){
    $element = $(element);
    $element.animate({
        left: "150%"
    }, 600);
}

// credit goes to Davy8 on stackoverflow for this moveAnimate function
function moveAnimate(element, newParent) {
    //Allow passing in either a jQuery object or selector
    element = $(element);
    newParent = $(newParent);
  
    var oldOffset = element.offset();
    element.appendTo(newParent);
    var newOffset = element.offset();
  
    var temp = element.clone().appendTo("body");
    temp.css({
      position: "absolute",
      left: oldOffset.left,
      top: oldOffset.top,
      "z-index": 1000
    });
    element.hide();
    temp.animate({
        top: newOffset.top,
        left: newOffset.left
      },
      "slow",
      function () {
        element.show();
        temp.remove();
      }
    );
  }

// INITIALIZE
gamePaused = true;
$("#game-message").append($startButton.text("Begin"));

// EVENT HANDLERS

$("#main-container").on("click", "#start-button", function (e) {
    e.preventDefault();
    console.log("start button clicked");
    startGame();
});

$("#main-container").on("click", ".choice", function () {
    // do nothing if game is paused
    if (gamePaused == false) {
        let selectedAnswerId = $(this).attr("id");
        let $selectedAnswer = $(this);
        // var checkChoice = function (answerSelected) {
        if (curQuestion.answers[selectedAnswerId].correct) {
            // correct answer:
            // pause game (click do nothing), increment score, update page, clear timer,
            // call function to display next question
            gamePaused = true;
            quesitonsCorrect++; 
            $selectedAnswer.addClass("bg-success");
            $(".choice").addClass("question-answered");
            $pTimerOrStatus.attr("class", "h2 p-3 text-success").text("Correct!");
            clearInterval(questionTimer);
            setTimeout(function () {
                displayNextQuestion(true);
            }, defaultDelay);
        } else {
            //  incorrect answer:
            //  similar to correct answer block but don't increment questionsCorrect
            gamePaused = true;
            $selectedAnswer.addClass("bg-danger");
            $(".choice").addClass("question-answered");
            $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Wrong!");
            clearInterval(questionTimer);
            setTimeout(function () {
                displayNextQuestion(false);
            }, defaultDelay);
        }
    }
});

// style answer choice elements on mouse over...
$("#main-container").on({
    mouseenter: function () {
        // ...when mouse over
        if (gamePaused){return;}
        $(this).removeClass("border border-0");
        $(this).addClass("border border-top-0 border-bottom-0 border-dark rounded");
    },
    mouseleave: function () {
        // ...when mouse leaves
        if (gamePaused){return;}
        $(this).removeClass("border border-0 border-dark rounded");
        $(this).addClass("border border-0");
    }
}, ".choice");

