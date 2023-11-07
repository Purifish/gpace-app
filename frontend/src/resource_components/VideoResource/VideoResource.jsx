import s from "./style.module.css";

function VideoResource(props) {
  const { title, description, videoLink } = props;

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h5 className={`card-title ${s.video_title}`}>{title}</h5>
        <a type="button" target="_blank" rel="noreferrer" href={videoLink}>
          Link
        </a>
        <p className={`card-text ${s.video_desc}`}>{description}</p>
      </div>
    </div>
  );
}

export default VideoResource;
