import s from "./style.module.css";
import TopicItem from "../../components/TopicItem/TopicItem";

import { useNavigate } from "react-router-dom";

// import logoImg from "../../assets/images/logo.png";
// import mathImg from "../../assets/images/math.png";
import { useHttpClient } from "../../hooks/http-hook";
import { useEffect, useState } from "react";

function TopicsBrowse(props) {
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [coursesList, setCoursesList] = useState();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/`
        );

        const responseData = await response.json();

        if (response.ok) {
          setCoursesList(responseData.courses);
        }
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest]);

  return (
    coursesList && (
      <div className={`row justify-content-center ${s.course_list_container}`}>
        {coursesList.map((courseItem, idx) => {
          return (
            <div
              key={`courseList${idx}`}
              className={`${s.card_container} col-sm-12 col-md-4 col-lg-3`}
            >
              <TopicItem
                topicName={courseItem.courseTitle}
                imgSrc={courseItem.image}
                description={courseItem.description}
                exploreTopic={() =>
                  navigate(
                    `/resource/${encodeURIComponent(courseItem.courseTitle)}/${
                      courseItem.id
                    }/notes`
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
