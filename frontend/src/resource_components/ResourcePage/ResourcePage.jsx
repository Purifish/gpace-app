import { useParams, Link } from "react-router-dom";

import s from "./style.module.css";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NotesResource from "../NotesResource/NotesResource";
import SideBar from "../../components/SideBar/SideBar";
import VideoResource from "../VideoResource/VideoResource";

function ResourcePage(props) {
  const courseTitle = decodeURI(useParams().courseTitle);
  const resourceType = decodeURI(useParams().resourceType);
  const courseId = useParams().courseId;
  const { sendRequest } = useHttpClient();
  const [resourceData, setResourceData] = useState({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // get relevant data for the current course
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/id/${courseId}`
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setResourceData(responseData);
      } catch (err) {
        // TODO: handle error when fetching from backend
      }
    };
    fetchResources();
  }, [sendRequest, courseId, courseTitle]);

  if (!resourceData || !resourceData.notes || !resourceData.videos) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  function getAppropriateResource(resourceType) {
    if (resourceType === "notes") {
      return (
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
      );
    } else if (resourceType === "videos") {
      return (
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
      );
    } else if (resourceType === "quizzes") {
      return (
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
          <h4 className={s.section_title}>Quizzes</h4>
          <br></br>
          {resourceData.quizzes.map((quiz, idx) => {
            return (
              <span key={`${courseTitle}-quiz-${idx}`}>
                <Link
                  to={`quiz/${quiz.id}`}
                >{`Try the ${quiz.title} quiz!`}</Link>
              </span>
            );
          })}
        </div>
      );
    } else if (resourceType === "tutors") {
      return (
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
          <h4 className={s.section_title}>Tutors</h4>
        </div>
      );
    }
  }

  return (
    <>
      <SideBar />
      <div className={`row justify-content-center`}>
        {getAppropriateResource(resourceType)}
      </div>
    </>
  );
}

export default ResourcePage;
