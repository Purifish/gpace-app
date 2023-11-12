import { useEffect, useState } from "react";

import s from "./style.module.css";
import { useHttpClient } from "../../hooks/http-hook";

function NotesResource(props) {
  const { title, description, notesFile, notesLink } = props;

  const { sendRequest } = useHttpClient();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const createTempUrl = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_ASSET_URL}/${notesFile}`
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setFileUrl(url);
        }
      } catch (err) {}
    };
    if (notesFile) {
      createTempUrl();
    }
  }, [notesFile, sendRequest, setFileUrl]);

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h5 className={`card-title ${s.notes_title}`}>{title}</h5>
        <a
          type="button"
          target="_blank"
          rel="noreferrer"
          href={fileUrl || notesLink}
          download={fileUrl && `${title}.pdf`}
          // href={
          //   notesFile
          //     ? `${process.env.REACT_APP_ASSET_URL}/${notesFile}`
          //     : notesLink
          // }
        >
          {`${title} Notes`}
        </a>
        <p className={`card-text ${s.notes_description}`}>{description}</p>
      </div>
    </div>
  );
}

export default NotesResource;
