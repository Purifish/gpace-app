import { Link } from "react-router-dom";
import s from "./style.module.css";

function QuizResult(props) {
  const { userScore, maxScore, quizTopic } = props;

  return (
    <div className={`row justify-content-center`}>
      <div className={s.container}>
        <h2
          className={`${s.congrats_message}`}
        >{`Congratulations, you have completed the ${quizTopic} quiz!`}</h2>
        <p
          className={`${s.question}`}
        >{`You scored ${userScore}/${maxScore}`}</p>
        <span className={`${s.home_link}`}>
          <Link to={`./../..`}>Back to Resource page</Link>
        </span>
      </div>
    </div>
  );
}

export default QuizResult;
