// VARIABLES

var $divQuestion = $("#question-container");
var $divAnswers = $("#answer-container");

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
    }

];

var curQuestion = {};
var arrHelper = [arrQuestions.length];
arrHelper = arrHelper.fill(0, 0, arrQuestions.length);


// FUNCTIONS

//      timer function?
//          if timer expired, then

function displayNextQuestion() {
    console.log(arrHelper[0]);
    if (arrHelper.indexOf(0) >= 0) {
        console.log("still some questions left...")
        for (var i = 0; arrHelper.length; i++) {
            if (arrHelper[i] == 1) {
                console.log("skipped");
                continue;
            } else {
                console.log("rending answers...");
                arrHelper[i] = 1;
                curQuestion = arrQuestions[i];
                $divQuestion.append($("<h3>").text(curQuestion.questionText));
                console.log("current question: ", curQuestion.questionText);
                Object.entries(curQuestion.answers).forEach(([key, prop]) => {
                    $divAnswers.append($("<h5>").attr("id", key).text(prop.answerText));
                });
                break;
            }
        }
    } else {
        console.log("no more questions")
    }
}









// INITIALIZE

arrHelper = arrHelper.fill(0, 0, arrQuestions.length);
displayNextQuestion();






// TODO click on answer function

//      start timer

//      check if answer is correct

//      if correct then
//          update stuff, move to next question
//      else
//          update other stuff, move to next question?