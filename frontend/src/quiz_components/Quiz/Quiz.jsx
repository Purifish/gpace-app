import s from "./style.module.css";

import QuizQuestion from "../QuizQuestion/QuizQuestion";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";

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
  // console.log(topicName);
  const [userScore, setUserScore] = useState(0);
  const maxScore = useMemo(() => {
    return calculateMaxScore(quizData.questions);
  }, []);
  const [finished, setFinished] = useState(false);
  const [isSelected, setIsSelected] = useState();

  // TODO: Fetch quiz data from backend using topicName

  const finishedComponent = (
    <div>
      <h3>
        You Scored {userScore}/{maxScore}
      </h3>
    </div>
  );

  useEffect(() => {
    let temp = [];
    for (let question of quizData.questions) {
      temp.push(Array(question.options.length).fill(false));
    }
    setIsSelected(temp);
  }, []);

  const updateSelected = (rowIndex, colIndex, newValue) => {
    // Create a shallow copy of the grid
    const temp = [...isSelected];

    // Create a shallow copy of the row
    const newRow = [...temp[rowIndex]];

    // Update the value at the specified index
    newRow[colIndex] = newValue;

    // Update the grid with the modified row
    temp[rowIndex] = newRow;

    // Update the state with the new grid
    setIsSelected(temp);
  };

  console.log(isSelected);
  return (
    <>
      {!finished ? (
        <>
          {quizData.questions.map((curQn, idx) => {
            return (
              <QuizQuestion
                key={`qn-${idx}`}
                qnNumber={idx + 1}
                question={curQn.title}
                options={curQn.options}
                solution={curQn.solution}
                score={curQn.score}
                setUserScore={setUserScore}
                isSelected={isSelected}
                updateSelected={updateSelected}
                // setSelectedChoices={setSelectedChoices}
              />
            );
          })}
          <Button
            variant="success"
            className={`${s.button}`}
            onClick={() => {
              // console.log(
              //   `Question ${qnNumber}: ${selectedOption}, correct ans: ${solution}`
              // );
              console.log(`Selected option(s): ${isSelected}`);
              // if (selectedOption === solution) {
              //   setUserScore((prev) => prev + score); // update current score of user
              // }
            }}
          >
            Next
          </Button>
        </>
      ) : (
        finishedComponent
      )}
    </>
  );
}

export default Quiz;
