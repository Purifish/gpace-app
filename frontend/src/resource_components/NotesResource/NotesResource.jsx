import s from "./style.module.css";

function NotesResource(props) {
  const { title, description, notesFile, notesLink } = props;

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <a type="button" target="_blank" rel="noopener" href={notesLink}>
          Link
        </a>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
}

export default NotesResource;
