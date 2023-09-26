import { Link } from "react-router-dom";
import s from "./style.module.css";

function QuizResult(props) {
  const { userScore, maxScore, quizTopic } = props;

  return (
    <div className={`row justify-content-center`}>
      <div className={s.container}>
        <h3>{`Congratulations, you have completed the ${quizTopic} quiz!`}</h3>
        <br></br>
        <p className={s.question}>{`You scored ${userScore}/${maxScore}`}</p>
        <br></br>
        <span>
          <Link to={`/resources/${encodeURIComponent(quizTopic)}`}>
            Back to Resource page
          </Link>
        </span>
      </div>
    </div>
  );
}

export default QuizResult;
