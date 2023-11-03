import s from "./style.module.css";

function NotesResource(props) {
  const { title, description, notesFile, notesLink } = props;

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h5 className={`card-title ${s.notes_title}`}>{title}</h5>
        <a
          type="button"
          target="_blank"
          rel="noreferrer"
          href={
            notesFile
              ? `${process.env.REACT_APP_ASSET_URL}/${notesFile}`
              : notesLink
          }
        >
          {`${title} Notes`}
        </a>
        <p className={`card-text ${s.notes_description}`}>{description}</p>
      </div>
    </div>
  );
}

export default NotesResource;
