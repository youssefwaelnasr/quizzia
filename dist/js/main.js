Array.prototype.shuffle = function () {
    let currentIndex = this.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
    return this;
};

const form = document.getElementById("options-form"),
    amount = document.getElementById("amount"),
    category = document.getElementById("category"),
    difficulty = document.getElementById("difficulty"),
    home = document.getElementById("home"),
    quiz = document.getElementById("quiz"),
    next = document.getElementById("next");

const categories = {
    "General Knowledge": 9,
    Film: 11,
    Music: 12,
    "Video Games": 15,
    "Science & Nature": 17,
    Computers: 18,
    Geography: 22,
    History: 23,
};

let api, questions;

form.addEventListener("submit", getAPI);

function getAPI(e) {
    e.preventDefault();
    let goodInput = true;
    if (amount.value == 0 || amount.value == "") {
        amount.classList.add("border", "border-danger");
        setTimeout(() => {
            amount.classList.remove("border", "border-danger");
        }, 3000);
        goodInput = false;
    }
    if (category.value == "Select Category") {
        category.classList.add("border", "border-danger");
        setTimeout(() => {
            category.classList.remove("border", "border-danger");
        }, 3000);
        goodInput = false;
    }
    if (difficulty.value == "Select Difficulty") {
        difficulty.classList.add("border", "border-danger");
        setTimeout(() => {
            difficulty.classList.remove("border", "border-danger");
        }, 3000);
        goodInput = false;
    }
    if (!goodInput) {
        setTimeout(() => {
            alert("Please fill out all the inputs correctly.");
        }, 100);
    } else {
        api = `https://opentdb.com/api.php?amount=${amount.value}&category=${
            categories[category.value]
        }&difficulty=${difficulty.value.toLowerCase()}&type=multiple`;
        fetchQuiz();
    }
}

function fetchQuiz() {
    home.classList.remove("show");
    quiz.classList.add("show");
    fetch(api)
        .then((response) => response.json())
        .then((data) => startQuiz(data.results))
        .catch((err) => {
            alert(err);
            console.error(err);
        });
}

const quizCategorySpan = document.getElementById("quiz-category"),
    currentQuestionSpan = document.getElementById("current-question"),
    totalQuestionsSpan = document.getElementById("total-questions"),
    correctAnswersSpan = document.getElementById("correct"),
    passedQuestionsSpan = document.getElementById("passed-questions"),
    currentQuestionNumber = document.getElementById("question-number"),
    questionSpan = document.getElementById("question"),
    choiceButtons = Array.from(document.getElementsByClassName("choice")),
    finishedDiv = document.getElementById("finished"),
    finishedAmount = document.getElementById("finished-amount"),
    finishedDifficulty = document.getElementById("finished-difficulty"),
    finishedCategory = document.getElementById("finished-category"),
    finishedCorrect = document.getElementById("finished-correct"),
    finishedTotal = document.getElementById("finished-total"),
    correctModal = document.getElementById("correct-modal"),
    wrongModal = document.getElementById("wrong-modal"),
    flashModal = (modal) => {
        modal.style.display = "initial";
        setTimeout(() => {
            modal.style.display = "none";
        }, 1000);
    },
    adjustBtnWidth = (btns) => {
        let maxWidth = 0;
        btns.forEach((btn) => {
            btn.style.width = "initial";
            if (btn.offsetWidth > maxWidth) {
                maxWidth = btn.offsetWidth;
            }
        });
        btns.forEach((btn) => (btn.style.width = `${maxWidth}px`));
    };

let questionIndex = 1,
    correctAnswers = 0,
    totalQuestions,
    question,
    choices,
    i = questionIndex - 1;

function startQuiz(arr) {
    questions = arr;
    totalQuestions = arr.length;
    question = arr[i].question;
    choices = [arr[i].correct_answer, ...arr[i].incorrect_answers].shuffle();
    choices.forEach((val) => val.replaceAll("&#039;", "'"));
    quizCategorySpan.innerHTML = arr[i].category;
    currentQuestionSpan.innerHTML = questionIndex;
    totalQuestionsSpan.innerHTML = totalQuestions;
    correctAnswersSpan.innerHTML = correctAnswers;
    passedQuestionsSpan.innerHTML = i;
    currentQuestionNumber.innerHTML = questionIndex;
    questionSpan.innerHTML = question;
    for (let j in choiceButtons) {
        choiceButtons[j].innerHTML = choices[j];
    }
    adjustBtnWidth(choiceButtons);
}

choiceButtons.forEach((btn) => btn.addEventListener("click", checkAnswer));

function checkAnswer(e) {
    const answer = e.target.innerHTML;
    const correctAns = questions[i].correct_answer.replaceAll("&#039;", "'");
    if (answer == correctAns) {
        e.target.classList.add("correct");
        flashModal(correctModal);
        correctAnswers++;
    } else {
        e.target.classList.add("wrong");
        flashModal(wrongModal);
        choiceButtons[choices.indexOf(correctAns)].classList.add("correct");
    }
    questionIndex++;
    i++;
    correctAnswersSpan.innerHTML = correctAnswers;
    passedQuestionsSpan.innerHTML = i;
    next.removeAttribute("disabled");
    choiceButtons.forEach((btn) => btn.setAttribute("disabled", true));
}

next.addEventListener("click", nextQuestion);

function nextQuestion() {
    if (questions.length == i) {
        quiz.classList.remove("show");
        finishedDiv.classList.add("show");
        finishedAmount.innerHTML = i;
        finishedDifficulty.innerHTML = difficulty.value;
        finishedCategory.innerHTML = quizCategorySpan.innerHTML;
        finishedCorrect.innerHTML = correctAnswers;
        finishedTotal.innerHTML = i;
    } else {
        question = questions[i].question;
        choices = [
            questions[i].correct_answer,
            ...questions[i].incorrect_answers,
        ].shuffle();
        currentQuestionSpan.innerHTML = questionIndex;
        currentQuestionNumber.innerHTML = questionIndex;
        questionSpan.innerHTML = question;
        next.setAttribute("disabled", true);
        for (let j = 0; j < choiceButtons.length; j++) {
            choiceButtons[j].innerHTML = choices[j];
            choiceButtons[j].removeAttribute("disabled");
            choiceButtons[j].classList.remove("correct");
            choiceButtons[j].classList.remove("wrong");
        }
        adjustBtnWidth(choiceButtons);
    }
}
