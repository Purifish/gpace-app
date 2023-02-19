import s from "./style.module.css";

import QuizQuestion from "../QuizQuestion/QuizQuestion";
import { useState } from "react";

function Quiz(props) {
    const { quizData } = props;
    const [curQuestion, setCurQuestion] = useState(0);

    return (
        <>
            {
                curQuestion < quizData.questions.length ? <QuizQuestion 
                    qnNumber={curQuestion + 1}
                    question={quizData.questions[curQuestion]}
                    options={quizData.options[curQuestion]}
                    handleClick={setCurQuestion}
                /> : <h3>Done</h3>
            }
        </>
    );
}

export default Quiz;