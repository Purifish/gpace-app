import { useParams } from "react-router-dom";

import s from "./style.module.css";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";

/* Example resource data for Data Structures & Algorithms */
const data = {
  notes: [
    {
      title: "Summary Notes",
      description: "Brief notes covering all topics",
      link: "...",
      file: "",
    },
    {
      description: "First Half notes",
      link: "...",
      file: "",
    },
  ],
  videos: [
    { description: "Quick sort tutorial", link: "..." },
    { description: "Heap sort tutorial", link: "..." },
  ],
  tutors: [],
};

function ResourcePage(props) {
  const topic = decodeURI(useParams().topicName);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [resourceData, setResourceData] = useState({});

  useEffect(() => {
    // const fetchResources = async () => {
    //   try {
    //     const responseData = await sendRequest(
    //       `${process.env.REACT_APP_BACKEND_URL}/???/${topic}`
    //     );
    //     setResourceData(responseData);
    //   } catch (err) {}
    // };
    // fetchResources();
    setResourceData(data);
  }, []);

  return (
    <>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Notes</h4>
        </div>
      </div>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Videos</h4>
        </div>
      </div>
      <div className={`row justify-content-center`}>
        <div className={s.container}>
          <h4 className={s.section_title}>Quiz</h4>
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
