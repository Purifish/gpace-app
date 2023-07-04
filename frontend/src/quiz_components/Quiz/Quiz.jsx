import s from "./style.module.css";

import QuizQuestion from "../QuizQuestion/QuizQuestion";
import { useMemo, useState } from "react";

function calculateMaxScore(scores) {
    let total = 0;
    for (let questionScore of scores) {
        total += questionScore;
    }
    
    return total;
}

function Quiz(props) {
    const { quizData } = props;
    const [curQuestion, setCurQuestion] = useState(0);
    // const [selectedChoices, setSelectedChoices] = useState([]); // holds the answers selected by the quiz taker
    const [userScore, setUserScore] = useState(0);
    const maxScore = useMemo(() => {
        return calculateMaxScore(quizData.scores);
    }, []);

    const finishedComponent = <div>
        <h3>You Scored {userScore}/{maxScore}</h3>
    </div>;

    return (
        <>
            {
                curQuestion < quizData.questions.length ? <QuizQuestion 
                    qnNumber={curQuestion + 1}
                    question={quizData.questions[curQuestion]}
                    options={quizData.options[curQuestion]}
                    solution={quizData.solution[curQuestion]}
                    score={quizData.scores[curQuestion]}
                    setCurQuestion={setCurQuestion}
                    setUserScore={setUserScore}
                    // setSelectedChoices={setSelectedChoices}
                /> : finishedComponent
            }
        </>
    );
}

export default Quiz;