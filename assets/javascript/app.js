// VARIABLES

var $divQuestion = $("#question-container");
var $divAnswers = $("#answer-container");
var $pTimerOrStatus = $("#timer-status");
var $divGameMessage = $("#game-message");
var arrQuestions = [{
        questionText: "Who created Javascript?",
        answers: {
            a: {
                answerText: "Microsoft",
                correct: false
            },
            b: {
                answerText: "Sun Microsystems",
                correct: false
            },
            c: {
                answerText: "Oracle",
                correct: false
            },
            d: {
                answerText: "Netscape",
                correct: true
            }
        }
    },
    {
        questionText: "JavaScript wasn’t always called that. What other names has it been released under?",
        answers: {
            a: {
                answerText: "Latte",
                correct: false
            },
            b: {
                answerText: "Mocha",
                correct: true
            },
            c: {
                answerText: "LiveScript",
                correct: true
            },
            d: {
                answerText: "BScript",
                correct: false
            },
            e: {
                answerText: "Spidermonkey",
                correct: false
            }
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
const defaultDelay = 3500;
var gamePaused = false;
var timeCounter;
var questionTimer;
var curQuestion = {};
var arrHelper = [];
arrHelper.length = arrQuestions.length;
arrHelper.fill(0);

// FUNCTIONS ----------------------------------------------------------------


function displayNextQuestion(choseWisely) {
    gamePaused = false;
    $divGameMessage.empty();
    clearInterval(questionTimer);
    // check if there are still questions to play...
    if (arrHelper.indexOf(0) >= 0) {
        // ...select next question
        for (var i = 0; arrHelper.length; i++) {
            if (arrHelper[i] == 1) {
                // skip this question becuase it's already been played
                continue;
            } else {
                // render multiple-choice answers
                arrHelper[i] = 1; // tag the questions as played in question tracking array
                curQuestion = arrQuestions[i]; // set global current question object
                $divQuestion.empty();
                $divQuestion.append($("<h3>").text(curQuestion.questionText));
                $("h3").attr("class", "h3 p-3");
                $divAnswers.empty();
                // foreach to loop through questions answers,
                //  style and append to DOM
                Object.entries(curQuestion.answers).forEach(([key, prop]) => {
                    $divAnswers.append($("<h5>").attr({
                        "id": key,
                        "class": "choice border border-0 border-dark rounded-20 h5 p-3 d-table"
                    }).text("○ " + prop.answerText));
                });
                // start the timer
                startTimer(allowedTime);
                break;
            }
        }
    } else {
        // no more questions; game over
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
    // display "game over" text and Reset button
    $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Game Over");
    $("#reset-button").addClass("d-inline-block");
    $("#reset-button").show();


}

function resetGame() {
    gamePaused = false;
    $pTimerOrStatus.attr("class", "h2 p-3 text-black").text("");
    $("#reset-button").removeClass("d-inline-block");
    $("#reset-button").hide();
    arrHelper.fill(0);
    displayNextQuestion();
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

// INITIALIZE
$("#reset-button").hide();
arrHelper = arrHelper.fill(0, 0, arrQuestions.length);
displayNextQuestion();


// EVENT HANDLERS

$("#main-container").on("click", ".choice", function () {
    // do nothing if game is paused
    if (gamePaused == false) {
        let selectedAnswerId = $(this).attr("id");
        let $selectedAnswer = $(this);
        // var checkChoice = function (answerSelected) {
        if (curQuestion.answers[selectedAnswerId].correct) {
            //  correct answer
            gamePaused = true;
            $selectedAnswer.addClass("bg-success");
            $pTimerOrStatus.attr("class", "h2 p-3 text-success").text("Correct!");
            clearInterval(questionTimer);
            setTimeout(function () {
                displayNextQuestion(true);
            }, defaultDelay);
        } else {
            //  incorrect answer
            gamePaused = true;
            $selectedAnswer.addClass("bg-danger");
            $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Wrong!");
            clearInterval(questionTimer);
            setTimeout(function () {
                displayNextQuestion(false);
            }, defaultDelay);
        }
    }
});

// stylize when mouse is over an answer choice
$("#main-container").on("mouseenter", ".choice", function () {
    // do when mouse enter
    $(this).removeClass("border border-0");
    $(this).addClass("border border-top-0 border-bottom-0 border-dark rounded");
});
$("#main-container").on("mouseleave", ".choice", function () {
    // do when mouse leave
    $(this).removeClass("border border-0 border-dark rounded");
    $(this).addClass("border border-0");
});

$("#reset-button").on("click", function () {
    resetGame();
});