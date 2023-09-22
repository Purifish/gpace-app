import s from "./style.module.css";

function VideoResource(props) {
  const { title, description, videoLink } = props;
  return (
    <div className={`${s.container}`}>
      <h2>Testing</h2>
    </div>
  );
}

export default VideoResource;
