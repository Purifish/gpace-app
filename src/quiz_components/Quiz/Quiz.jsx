import s from "./style.module.css";

import QuizQuestion from "../QuizQuestion/QuizQuestion";

function Quiz() {

    return (
        <>
            <QuizQuestion 
                qnNumber={1}
                question={"What is the capital of China?"}
                options={[
                    "Shanghai",
                    "Beijing",
                    "Peking"
                ]}
            />
        </>
    );
}

export default Quiz;