import { useParams, Link } from "react-router-dom";

import s from "./style.module.css";
import { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NotesResource from "../NotesResource/NotesResource";
import VideoResource from "../VideoResource/VideoResource";
import { CurrentCourseContext } from "../../contexts/CurrentCourseContext";

/* Example resource data for Data Structures & Algorithms */
// const data = {
//   notes: [
//     {
//       title: "Summary Notes",
//       description: "Brief notes covering all topics",
//       link: "https://www.youtube.com/",
//       file: "",
//     },
//     {
//       title: "First Half Notes",
//       description: "Comprehensive notes covering the first half",
//       link: "https://www.youtube.com/",
//       file: "",
//     },
//   ],
//   videos: [
//     {
//       title: "Quick Sort",
//       description: "Quick sort tutorial",
//       link: "https://www.google.com/",
//     },
//     {
//       title: "Heap Sort",
//       description: "Heap sort tutorial",
//       link: "https://www.youtube.com/",
//     },
//   ],
//   tutors: [],
// };

function ResourcePage(props) {
  const courseTitle = decodeURI(useParams().courseTitle);
  const courseId = useParams().courseId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [resourceData, setResourceData] = useState({});
  const { currentCourse, setCurrentCourse } = useContext(CurrentCourseContext);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/id/${courseId}`
        );
        setResourceData(responseData);
      } catch (err) {}
    };
    fetchResources();
    setCurrentCourse({
      courseTitle: courseTitle,
      courseId: courseId,
    });
    // setResourceData(data);
  }, [sendRequest, courseId, courseTitle, setCurrentCourse]);

  if (!resourceData || !resourceData.notes || !resourceData.videos) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  return (
    <>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Notes</h4>
          <div>
            {resourceData.notes.map((note, idx) => {
              return (
                <NotesResource
                  key={`${courseTitle}-note-${idx}`}
                  title={note.title}
                  description={note.description}
                  notesLink={note.link}
                  notesFile={note.file}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Videos</h4>
          <div>
            {resourceData.videos.map((video, idx) => {
              return (
                <VideoResource
                  key={`${courseTitle}-note-${idx}`}
                  title={video.title}
                  description={video.description}
                  videoLink={video.link}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Quiz</h4>
          <br></br>
          {resourceData.quizzes.map((quiz, idx) => {
            return (
              <span key={`${courseTitle}-quiz-${idx}`}>
                <Link
                  to={`/quiz/${quiz.id}`}
                >{`Try the ${quiz.title} quiz!`}</Link>
              </span>
            );
          })}
        </div>
      </div>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Tutors</h4>
        </div>
      </div>
    </>
  );
}

export default ResourcePage;
