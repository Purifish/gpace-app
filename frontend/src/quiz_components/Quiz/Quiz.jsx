import s from "./style.module.css";

import QuizQuestion from "../QuizQuestion/QuizQuestion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import Button from "react-bootstrap/Button";
import Button from "@mui/material/Button";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import QuizResult from "../QuizResult/QuizResult";
import { useHttpClient } from "../../hooks/http-hook";

// const data = {
//   title: "Geography",
//   questions: [
//     {
//       title: "What is the capital of China?",
//       options: ["Shanghai", "Beijing", "Peking"],
//       solution: [1], // must be in ascending order
//       score: 2,
//       type: "radio",
//     },
//     {
//       title: "Which continent is the largest?",
//       options: ["North America", "South America", "Asia", "Africa"],
//       solution: [2],
//       score: 2,
//       type: "radio",
//     },
//     {
//       title: "Which of these countries can be found in Asia?",
//       options: ["Japan", "Germany", "Sudan", "Oman", "Laos"],
//       solution: [0, 3, 4],
//       score: 2,
//       type: "checkbox",
//     },
//   ],
// };

function calculateMaxScore(questions) {
  let total = 0;
  for (let question of questions) {
    total += question.score;
  }

  return total;
}

function Quiz(props) {
  const { isLoading, sendRequest } = useHttpClient();
  // const topic = decodeURI(useParams().topicName);
  const quizId = useParams().quizId;
  const [userScore, setUserScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isSelected, setIsSelected] = useState();
  const [quizData, setQuizData] = useState([]);
  const [maxScore, setMaxScore] = useState(-1);

  useEffect(() => {
    // fetch quiz data from backend first
    const fetchQuestions = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/questions/${quizId}`
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        if (!responseData.questions || responseData.questions.length === 0) {
          setMaxScore(0);
          return;
        }

        setQuizData(responseData);
        let temp = [];
        // for (let i = 0; i < responseData.questions.length; i++) {
        //   temp[i] = Array(responseData.questions[i].options.length).fill(false);
        // }
        for (let question of responseData.questions) {
          temp.push(Array(question.options.length).fill(false));
        }
        setIsSelected(temp);
        // setQuizData(data);
        setMaxScore(calculateMaxScore(responseData.questions));
      } catch (err) {}
    };
    fetchQuestions();
  }, [sendRequest, quizId]);

  if (maxScore === -1) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  const updateSelected = (qnIndex, optionIndex, newValue, isRadio) => {
    // Create a shallow copy of the grid
    const temp = [...isSelected];

    // Create a shallow copy of the row
    const newRow = isRadio
      ? Array(temp[qnIndex].length).fill(false)
      : [...temp[qnIndex]];

    // If new value equals old value, ignore
    if (newRow[optionIndex] === newValue) {
      return;
    }

    // Update the value at the specified index
    newRow[optionIndex] = newValue;

    // Update the grid with the modified row
    temp[qnIndex] = newRow;

    // Update the state with the new grid
    setIsSelected(temp);
  };

  function calculateUserScore() {
    let score = 0;

    for (let r = 0; r < quizData.questions.length; r++) {
      const solution = quizData.questions[r].solution; // retrieve solution for this qn
      let j = 0;
      let c;
      for (c = 0; c < isSelected[r].length; c++) {
        if (isSelected[r][c] === true) {
          if (j >= solution.length || c !== solution[j]) {
            break; // wrong answer
          }
          j++;
        }
      }

      // correct answer
      if (c === isSelected[r].length && j === solution.length) {
        score += quizData.questions[r].score;
      }
    }

    console.log(score);
    setUserScore(score);
  }

  // console.log(isSelected);
  return (
    <>
      {!finished ? (
        <>
          {quizData &&
            quizData.questions &&
            quizData.questions.map((curQn, idx) => {
              return (
                <QuizQuestion
                  key={`qn-${idx}`}
                  qnNumber={idx + 1}
                  question={curQn.title}
                  options={curQn.options}
                  updateSelected={updateSelected}
                  type={curQn.type}
                  imageSrc={curQn.image}
                />
              );
            })}
          {quizData && quizData.questions && quizData.questions.length > 0 ? (
            <div className={`${s.button_container}`}>
              <Button
                size="large"
                className={`${s.button}`}
                variant="contained"
                onClick={() => {
                  calculateUserScore();
                  setFinished(true);
                }}
              >
                SUBMIT
              </Button>
            </div>
          ) : (
            <h2> No Questions For This Quiz! </h2>
          )}
        </>
      ) : (
        <QuizResult
          userScore={userScore}
          maxScore={maxScore}
          quizTopic={`topic`}
        />
      )}
    </>
  );
}

export default Quiz;
