// VARIABLES

var $divQuestion = $("#question-container");
var $divAnswers = $("#answer-container");
var $pTimerOrStatus = $("#timer-status");
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

const allowedTime = 5;
var gamePaused = false;
var timeCounter;
var questionTimer;
var curQuestion = {};
var arrHelper = [];
arrHelper.length = arrQuestions.length;
arrHelper.fill(0);
console.log(arrHelper.length, arrQuestions.length);


// FUNCTIONS ----------------------------------------------------------------

function displayNextQuestion(choseWisely) {
    console.log(arrHelper, arrHelper[0], arrHelper.length)
    gamePause = false;
    clearInterval(questionTimer);
    if (arrHelper.indexOf(0) >= 0) {
        console.log("still some questions left...")
        for (var i = 0; arrHelper.length; i++) {
            if (arrHelper[i] == 1) {
                console.log("skipping because question was already played...");
                continue;
            } else {
                console.log("render answers...");
                arrHelper[i] = 1;
                curQuestion = arrQuestions[i];
                $divQuestion.empty();
                $divQuestion.append($("<h3>").text(curQuestion.questionText));
                $("h3").attr("class", "h3 p-3");
                console.log("current question: ", curQuestion.questionText);
                $divAnswers.empty();
                Object.entries(curQuestion.answers).forEach(([key, prop]) => {
                    $divAnswers.append($("<h5>").attr("id", key).text(prop.answerText));
                    $("h5").attr("class", "choice h5 p-3");
                });

                // start the timer
                startTimer(allowedTime);
                break;
            }
        }
    } else {
        console.log("no more questions")
        gameOver();
    }



}

function startTimer(startTime) {
    // start the question time count down
    timeCounter = startTime;
    $pTimerOrStatus.attr("class", "h2 p-3 text-black").text("Time Left: " + timeConverter(timeCounter));
    questionTimer = setInterval(timerInterval, 1000)
}

function timerInterval() {
    // update countdown and display
    console.log("time: ", timeCounter);
    timeCounter--;
    $pTimerOrStatus.text("Time Left: " + timeConverter(timeCounter));
    // check if times up
    if (timeCounter <= 0) {
        // times up
        clearInterval(questionTimer);
        timesUp();
    }
}

function timesUp() {
    gamePause = true;
    console.log("times up");
    // do stuff when time has ran out
    $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Time's Up!");
    setTimeout(displayNextQuestion, 3000);
}

function gameOver() {
    $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Game Over");
    $("#reset-button").attr("hidden", false);
    // $("#reset-button").show();
}

function resetGame() {
    gamePaused = false;
    $pTimerOrStatus.attr("class", "h2 p-3 text-black").text("");
    $("#reset-button").attr("hidden", true);
    // $("#reset-button").hide();
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

// INITIALIZE ----------------------------------------------------------------
arrHelper = arrHelper.fill(0, 0, arrQuestions.length);
displayNextQuestion();

$("#main-container").on("click", ".choice", function () {

    if (gamePaused == false) {
        let answerSelected = $(this).attr("id");

        console.log("use selected answer: ", curQuestion.answers[answerSelected].correct);

        // var checkChoice = function (answerSelected) {
        if (curQuestion.answers[answerSelected].correct) {
            //  user selected correct answer. yay
            console.log("correct answer");
            gamePaused = true;
            $pTimerOrStatus.attr("class", "h2 p-3 text-success").text("Correct!");
            clearInterval(questionTimer);
            setTimeout(function () {
                displayNextQuestion(true);
            }, 3000);
        } else {
            //  incorrect! do something else?
            console.log("incorrect answer");
            gamePaused = true;
            $pTimerOrStatus.attr("class", "h2 p-3 text-danger").text("Wrong!");
            clearInterval(questionTimer);
            setTimeout(function () {
                displayNextQuestion(false);
            }, 3000);
        }
    }
});


$("#reset-button").on("click", function () {
    resetGame();
});