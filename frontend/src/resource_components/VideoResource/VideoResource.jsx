import s from "./style.module.css";

function VideoResource(props) {
  const { title, description, videoLink } = props;

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <a type="button" target="_blank" rel="noreferrer" href={videoLink}>
          Link
        </a>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
}

export default VideoResource;
