import s from "./style.module.css";

function ExamResourse(props) {
  const { title, examFile, examLink } = props;

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h1 className={`card-title ${s.exam_title}`}>{title}</h1>
        <a
          type="button"
          target="_blank"
          rel="noreferrer"
          href={
            examFile
              ? `${process.env.REACT_APP_ASSET_URL}/${examFile}`
              : examLink
          }
        >
          {`Download`}
        </a>
      </div>
    </div>
  );
}

export default ExamResourse;