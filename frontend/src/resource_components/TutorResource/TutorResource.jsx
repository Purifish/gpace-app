import s from "./style.module.css";

function TutorResource(props) {
  const { title, description, contactDetails } = props;
  return (
    <div className={`${s.container}`}>
      <h2>Testing</h2>
    </div>
  );
}

export default TutorResource;
