import s from "./style.module.css";
import TopicItem from "../../components/TopicItem/TopicItem";

import { useNavigate } from "react-router-dom";

// import logoImg from "../../assets/images/logo.png";
// import mathImg from "../../assets/images/math.png";
import { useHttpClient } from "../../hooks/http-hook";
import { useContext, useEffect, useState } from "react";
import { CurrentCourseContext } from "../../contexts/CurrentCourseContext";

// const topicList = [
//   {
//     name: "Geography",
//     img: logoImg,
//     pathName: "geography",
//   },
//   {
//     name: "C++",
//     img: logoImg,
//     pathName: "c++",
//   },
//   {
//     name: "Maths",
//     img: mathImg,
//     pathName: "math",
//   },
// ];

function TopicsBrowse(props) {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [coursesList, setCoursesList] = useState();
  const { currentCourse, setCurrentCourse } = useContext(CurrentCourseContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/`
        );
        setCoursesList(responseData.courses);
      } catch (err) {}
    };
    fetchCourses();
    setCurrentCourse({
      courseTitle: "",
      courseId: "",
    });
  }, [sendRequest, setCurrentCourse]);

  return (
    coursesList && (
      <div className={`row justify-content-center`}>
        {coursesList.map((courseItem, idx) => {
          return (
            <div
              key={`courseList${idx}`}
              className={`${s.card_container} col-sm-12 col-md-4 col-lg-3`}
            >
              <TopicItem
                topicName={courseItem.courseTitle}
                imgSrc={courseItem.image}
                startQuiz={() =>
                  navigate(
                    `/resources/${encodeURIComponent(courseItem.courseTitle)}/${
                      courseItem.id
                    }`
                  )
                }
              />
            </div>
          );
        })}
      </div>
    )
  );
}

export default TopicsBrowse;
