import { useParams, Link, useNavigate } from "react-router-dom";

import s from "./style.module.css";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NotesResource from "../NotesResource/NotesResource";
import SideBar from "../../components/SideBar/SideBar";
import VideoResource from "../VideoResource/VideoResource";
import ExamResourse from "../ExamResource/ExamResource";

function ResourcePage(props) {
  const navigate = useNavigate();
  const courseTitle = decodeURI(useParams().courseTitle);
  const capitalizedCourseTitle = courseTitle
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
  const resourceType = decodeURI(useParams().resourceType);
  const courseId = useParams().courseId;
  const { sendRequest } = useHttpClient();
  const [resourceData, setResourceData] = useState({});

  /* Re-direct to notes route if invalid resource path */
  useEffect(() => {
    const validResourceNames = [
      "notes",
      "quizzes",
      "videos",
      "tutors",
      "exams",
    ];
    if (validResourceNames.indexOf(resourceType) === -1) {
      navigate("./../notes");
    }
  }, [navigate, resourceType]);

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

  if (
    !resourceData ||
    !resourceData.notes ||
    !resourceData.videos ||
    !resourceData.examPapers ||
    !resourceData.examSolutions
  ) {
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
          <h1
            className={s.section_title}
          >{`${capitalizedCourseTitle} Notes`}</h1>
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
          <h4
            className={s.section_title}
          >{`${capitalizedCourseTitle} Videos`}</h4>
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
          <h4
            className={s.section_title}
          >{`${capitalizedCourseTitle} Quizzes`}</h4>
          <br></br>
          {resourceData.quizzes.map((quiz, idx) => {
            return (
              <div
                key={`${courseTitle}-quiz-${idx}`}
                style={{ marginBottom: "30px" }}
              >
                <span>
                  {`Quiz ${idx + 1}: `}
                  <Link
                    to={`quiz/${quiz.id}`}
                  >{`Try the ${quiz.title} quiz!`}</Link>
                </span>
              </div>
            );
          })}
        </div>
      );
    } else if (resourceType === "tutors") {
      return (
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
          <h4
            className={s.section_title}
          >{`${capitalizedCourseTitle} Tutors`}</h4>
        </div>
      );
    } else if (resourceType === "exams") {
      return (
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
          <h4
            className={s.section_title}
          >{`${capitalizedCourseTitle} Exam Papers`}</h4>
          <div>
            {resourceData.examPapers.map((examPaper, idx) => {
              return (
                <ExamResourse
                  key={`${courseTitle}-exampaper-${idx}`}
                  title={examPaper.title}
                  examLink={examPaper.link}
                  examFile={examPaper.file}
                />
              );
            })}
          </div>
          <br></br>
          <h4
            className={s.section_title}
          >{`${capitalizedCourseTitle} Exam Solutions`}</h4>
          <div>
            {resourceData.examSolutions.map((examSolution, idx) => {
              return (
                <ExamResourse
                  key={`${courseTitle}-examsol-${idx}`}
                  title={examSolution.title}
                  examLink={examSolution.link}
                  examFile={examSolution.file}
                />
              );
            })}
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <SideBar />
      <div className={`row justify-content-center`}>
        {getAppropriateResource(resourceType)}
      </div>
    </div>
  );
}

export default ResourcePage;
