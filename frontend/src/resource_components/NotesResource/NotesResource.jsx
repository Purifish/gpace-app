import s from "./style.module.css";

function NotesResource(props) {
  const { title, description, notesFile, notesLink } = props;
  return (
    <div className={`${s.container}`}>
      <h2>Testing</h2>
    </div>
  );
}

export default NotesResource;
