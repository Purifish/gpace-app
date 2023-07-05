import s from "./style.module.css";

import QuizQuestion from "../QuizQuestion/QuizQuestion";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const quizData = {
  title: "Geography",
  questions: [
    {
      title: "What is the capital of China?",
      options: ["Shanghai", "Beijing", "Peking"],
      solution: 1,
      score: 2,
    },
    {
      title: "Which continent is the largest?",
      options: ["North America", "South America", "Asia", "Africa"],
      solution: 2,
      score: 2,
    },
  ],
};

function calculateMaxScore(questions) {
  let total = 0;
  for (let question of questions) {
    total += question.score;
  }

  return total;
}

function Quiz(props) {
  const { topicName } = useParams();
  console.log(topicName);
  const [curQuestion, setCurQuestion] = useState(0);
  // const [selectedChoices, setSelectedChoices] = useState([]); // holds the answers selected by the quiz taker
  const [userScore, setUserScore] = useState(0);
  const maxScore = useMemo(() => {
    return calculateMaxScore(quizData.questions);
  }, []);

  // TODO: Fetch quiz data from backend using topicName

  const finishedComponent = (
    <div>
      <h3>
        You Scored {userScore}/{maxScore}
      </h3>
    </div>
  );

  return (
    <>
      {curQuestion < quizData.questions.length ? (
        <QuizQuestion
          qnNumber={curQuestion + 1}
          question={quizData.questions[curQuestion].title}
          options={quizData.questions[curQuestion].options}
          solution={quizData.questions[curQuestion].solution}
          score={quizData.questions[curQuestion].score}
          setCurQuestion={setCurQuestion}
          setUserScore={setUserScore}
          // setSelectedChoices={setSelectedChoices}
        />
      ) : (
        finishedComponent
      )}
    </>
  );
}

export default Quiz;
