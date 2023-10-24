import { useParams, Link } from "react-router-dom";

import s from "./style.module.css";
import { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NotesResource from "../NotesResource/NotesResource";
import VideoResource from "../VideoResource/VideoResource";
import { CurrentCourseContext } from "../../contexts/CurrentCourseContext";

function ResourcePage(props) {
  const courseTitle = decodeURI(useParams().courseTitle);
  const courseId = useParams().courseId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [resourceData, setResourceData] = useState({});
  const { currentCourse, setCurrentCourse } = useContext(CurrentCourseContext);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // get relevant data for the current course
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/id/${courseId}`
        );
        setResourceData(responseData);
      } catch (err) {
        // TODO: handle error when fetching from backend
      }
    };
    fetchResources();
    setCurrentCourse({
      courseTitle: courseTitle,
      courseId: courseId,
    });
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
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
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
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
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
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
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
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
          <h4 className={s.section_title}>Tutors</h4>
        </div>
      </div>
    </>
  );
}

export default ResourcePage;
