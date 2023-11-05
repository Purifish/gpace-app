import s from "./style.module.css";

import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

// import logoImg from "../../assets/images/logo.png";
// import mathImg from "../../assets/images/math.png";
import { useHttpClient } from "../../hooks/http-hook";
import { CoursesContext } from "../../contexts/courses-context";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import TopicItem from "../../components/TopicItem/TopicItem";

function TopicsBrowse(props) {
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [coursesList, setCoursesList] = useState();
  const { courses, setCourses } = useContext(CoursesContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/`
        );

        const responseData = await response.json();

        if (response.ok) {
          setCoursesList(responseData.courses);
          const temp = {};
          for (const course of responseData.courses) {
            temp[course.courseCode] = course;
          }
          setCourses({ ...temp });
        }
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest, setCourses]);

  if (!courses || !coursesList) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  return (
    <div className={`row justify-content-center ${s.course_list_container}`}>
      {coursesList.map((courseItem, idx) => {
        return (
          <div
            key={`courseList${idx}`}
            className={`${s.card_container} col-sm-12 col-md-4 col-lg-3`}
          >
            <TopicItem
              topicName={courses[courseItem.courseCode].courseTitle}
              imgSrc={courseItem.image}
              description={courseItem.description}
              exploreTopic={() =>
                navigate(
                  `/resource/${encodeURIComponent(courseItem.courseCode)}/notes`
                )
              }
            />
          </div>
        );
      })}
    </div>
  );
}

export default TopicsBrowse;
