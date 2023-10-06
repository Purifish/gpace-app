import { Link } from "react-router-dom";
import s from "./style.module.css";
import { useContext } from "react";
import { CurrentCourseContext } from "../../contexts/CurrentCourseContext";

function QuizResult(props) {
  const { userScore, maxScore, quizTopic } = props;
  const { currentCourse } = useContext(CurrentCourseContext);

  return (
    <div className={`row justify-content-center`}>
      <div className={s.container}>
        <h3>{`Congratulations, you have completed the ${quizTopic} quiz!`}</h3>
        <br></br>
        <p className={s.question}>{`You scored ${userScore}/${maxScore}`}</p>
        <br></br>
        <span>
          <Link
            to={`/resources/${encodeURIComponent(currentCourse.courseTitle)}/${
              currentCourse.courseId
            }`}
          >
            Back to Resource page
          </Link>
        </span>
      </div>
    </div>
  );
}

export default QuizResult;
