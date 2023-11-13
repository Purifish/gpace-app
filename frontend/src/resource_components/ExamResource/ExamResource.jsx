import { useEffect, useState } from "react";

import s from "./style.module.css";
import { useHttpClient } from "../../hooks/http-hook";

function ExamResourse(props) {
  const { title, examFile, examLink } = props;

  const { sendRequest } = useHttpClient();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const createTempUrl = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_ASSET_URL}/${examFile}`
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setFileUrl(url);
        }
      } catch (err) {}
    };
    if (examFile) {
      createTempUrl();
    }
  }, [examFile, sendRequest, setFileUrl]);

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h1 className={`card-title ${s.exam_title}`}>{title}</h1>
        <a
          type="button"
          target="_blank"
          rel="noreferrer"
          href={fileUrl || examLink}
          download={fileUrl && `${title}.pdf`}
          // href={
          //   examFile
          //     ? `${process.env.REACT_APP_ASSET_URL}/${examFile}`
          //     : examLink
          // }
        >
          {`Download`}
        </a>
      </div>
    </div>
  );
}

export default ExamResourse;
