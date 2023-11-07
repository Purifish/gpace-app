import { useParams, Link, useNavigate } from "react-router-dom";

import s from "./style.module.css";
import { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { useCapitalizer } from "../../hooks/capitalize-hook";

import EmptyResource from "../EmptyResource/EmptyResource";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NotesResource from "../NotesResource/NotesResource";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";
import SideBar from "../../components/SideBar/SideBar";
import VideoResource from "../VideoResource/VideoResource";
import ExamResourse from "../ExamResource/ExamResource";
import FaqResource from "../FaqResource/FaqResource";

import { CoursesContext } from "../../contexts/courses-context";

function ResourcePage() {
  const navigate = useNavigate();
  const { courses, setCourses } = useContext(CoursesContext);
  const courseCode = decodeURI(useParams().courseCode);
  const [capitalizedCourseTitle, setCapitalizedCourseTitle] = useState();
  const [courseId, setCourseId] = useState();
  const resourceType = decodeURI(useParams().resourceType);

  const { sendRequest } = useHttpClient();
  const { capitalizeWords } = useCapitalizer();
  const [resourceData, setResourceData] = useState();

  useEffect(() => {
    // TODO: throttle
    const fetchCourses = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/courses/`
        );

        const responseData = await response.json();

        if (response.ok) {
          const temp = {};
          for (const course of responseData.courses) {
            temp[course.courseCode] = course;
          }
          setCourses(temp);
        }
      } catch (err) {}
    };
    if (!courses) {
      fetchCourses();
    } else if (courses[courseCode]) {
      setCourseId(courses[courseCode]._id);
      setCapitalizedCourseTitle(
        capitalizeWords(courses[courseCode].courseTitle)
      );
    } else {
      setCourseId("INVALID");
    }
  }, [courses, setCourses, courseCode, sendRequest, capitalizeWords]);

  /* Re-direct to notes route if invalid resource path */
  useEffect(() => {
    const validResourceNames = [
      "notes",
      "quizzes",
      "videos",
      "tutors",
      "exams",
      "faq",
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
        console.log(err.message);
      }
    };
    courseId && courseId !== "INVALID" && fetchResources();
  }, [sendRequest, courseId]);

  if (courseId === "INVALID") {
    return <PageNotFound />;
  }

  if (!resourceData) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  function foo(resourceType) {
    if (resourceType === "notes") {
      return (
        <div>
          {!resourceData.notes || resourceData.notes.length === 0 ? (
            <EmptyResource resourceType="notes" />
          ) : (
            resourceData.notes.map((note, idx) => {
              return (
                <NotesResource
                  key={`${capitalizedCourseTitle}-note-${idx}`}
                  title={note.title}
                  description={note.description}
                  notesLink={note.link}
                  notesFile={note.file}
                />
              );
            })
          )}
        </div>
      );
    } else if (resourceType === "faq") {
      return (
        <div>
          {!resourceData.faqs || resourceData.faqs.length === 0 ? (
            <EmptyResource resourceType="FAQs" />
          ) : (
            resourceData.faqs.map((faq, idx) => {
              return (
                <FaqResource
                  key={`${capitalizedCourseTitle}-faq-${idx}`}
                  question={faq.question}
                  answer={faq.answer}
                />
              );
            })
          )}
        </div>
      );
    } else if (resourceType === "videos") {
      return (
        <div>
          {!resourceData.videos || resourceData.videos.length === 0 ? (
            <EmptyResource resourceType="videos" />
          ) : (
            resourceData.videos.map((video, idx) => {
              return (
                <VideoResource
                  key={`${capitalizedCourseTitle}-vid-${idx}`}
                  title={video.title}
                  description={video.description}
                  videoLink={video.link}
                />
              );
            })
          )}
        </div>
      );
    } else if (resourceType === "quizzes") {
      return (
        <div>
          {!resourceData.quizzes || resourceData.quizzes.length === 0 ? (
            <EmptyResource resourceType="quizzes" />
          ) : (
            resourceData.quizzes.map((quiz, idx) => {
              return (
                <div
                  key={`${capitalizedCourseTitle}-quiz-${idx}`}
                  style={{ marginBottom: "30px" }}
                >
                  <span className={`${s.quiz_link}`}>
                    <b>{`Quiz ${idx + 1}: `}</b>
                    <Link
                      to={`quiz/${idx + 1}`}
                    >{`Try the ${quiz.title} quiz!`}</Link>
                  </span>
                </div>
              );
            })
          )}
        </div>
      );
    } else if (resourceType === "tutors") {
      return <EmptyResource resourceType="tutors" />;
    } else if (resourceType === "examPapers") {
      return (
        <div>
          {!resourceData.examPapers || resourceData.examPapers.length === 0 ? (
            <EmptyResource resourceType="exam papers" />
          ) : (
            resourceData.examPapers.map((examPaper, idx) => {
              return (
                <ExamResourse
                  key={`${capitalizedCourseTitle}-exampaper-${idx}`}
                  title={examPaper.title}
                  examLink={examPaper.link}
                  examFile={examPaper.file}
                />
              );
            })
          )}
        </div>
      );
    } else if (resourceType === "examSolutions") {
      return (
        <div>
          {!resourceData.examSolutions ||
          resourceData.examSolutions.length === 0 ? (
            <EmptyResource resourceType="exam solutions" />
          ) : (
            resourceData.examSolutions.map((examSolution, idx) => {
              return (
                <ExamResourse
                  key={`${capitalizedCourseTitle}-examsol-${idx}`}
                  title={examSolution.title}
                  examLink={examSolution.link}
                  examFile={examSolution.file}
                />
              );
            })
          )}
        </div>
      );
    }
  }

  return (
    <div>
      <SideBar />
      <div className={`row justify-content-center`}>
        <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
          <h4 className={s.section_title}>{`${capitalizedCourseTitle} ${
            resourceType === "exams"
              ? "Exam Papers"
              : capitalizeWords(resourceType)
          }`}</h4>
          {foo(resourceType === "exams" ? "examPapers" : resourceType)}
        </div>
        {resourceType === "exams" && (
          <div className={`${s.container} col-sm-12 col-md-8 col-lg-6`}>
            <h4
              className={s.section_title}
            >{`${capitalizedCourseTitle} Exam Solutions`}</h4>
            {foo("examSolutions")}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourcePage;
