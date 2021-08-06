var questionElement = document.getElementById("question");
var answersContainer = document.getElementById("answersContainer");
var retry = document.getElementById("retry");
var exit = document.getElementById("exit");
var numberOfQuestions = 10;
var score = 0;

retry.addEventListener("click", () => {
  score = 0;
  main();
});

exit.addEventListener("click", () => {
  questionElement.innerHTML = "Thank you for playing!";
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.lastChild);
  }
});
//  https://opentdb.com/api.php?amount=10
const getTrivia = async () => {
  const response = await fetch("https://opentdb.com/api.php?amount=10");
  // const response = await fetch("data.json");
  const data = await response.json();
  return data.results;
};

// A questionGenerator to generate questions one at a time.
function* questionGenerator(arr) {
  for (question of arr) {
    yield question;
  }
}

// Renders the question to the DOM
const setQuestion = (question) => {
  questionElement.innerHTML = question;
};

const setAnswers = (options, status, generateQuestion) => {
  let correctAnswer = options[options.length - 1];
  for (answer of options) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = answer;
    answersContainer.appendChild(button);
    button.addEventListener("click", () => {
      score += markQuestion(event.target.innerHTML, correctAnswer);
      nextQuestion(status, generateQuestion);
    });
  }
};
// Clears the question and the answers options from the DOM
const clearQuestionAnswer = () => {
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.lastChild);
  }
  questionElement.innerHTML = "";
};

// Marks the current question
const markQuestion = (answerGiven, correctAnswer) => {
  if (answerGiven === correctAnswer) {
    return 1;
  } else {
    return 0;
  }
};
// Loads the next question
const nextQuestion = (status, generateQuestion) => {
  if (!status) {
    trivia(generateQuestion);
  }
};

const loadResults = (numberOfQuestions, score) => {
  questionElement.innerHTML = "Results";
  answersContainer.innerHTML = `${score}/${numberOfQuestions}`;
};
// The trivia trivia function
const trivia = (generateQuestion) => {
  let triviaData = generateQuestion.next();
  let data = triviaData.value;
  let status = triviaData.done;

  // When all the questions have been answered, return the final score
  if (data === undefined) {
    loadResults(numberOfQuestions, score);
    return 0; // exit
  }
  clearQuestionAnswer();
  setQuestion(data.question);
  setAnswers(
    [...data.incorrect_answers, data.correct_answer],
    status,
    generateQuestion
  );
};

// Entry point
function main() {
  getTrivia()
    .then((questionsData) => {
      trivia(questionGenerator(questionsData));
    })
    .catch((error) => {
      console.log(error);
    });
}
main();
