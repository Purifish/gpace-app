import { Button } from "@mui/material";
import s from "./style.module.css";
import logoImg from "../../assets/images/logo.png";

function TopicItem(props) {
  const { topicName, imgSrc, description, exploreTopic } = props;
  const capitalizedTopic = topicName
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");

  let imagePath;

  imagePath = imgSrc ? `${process.env.REACT_APP_ASSET_URL}/${imgSrc}` : logoImg;

  return (
    <div className={`card ${s.container}`}>
      <img
        src={imagePath}
        className={`card-img-top ${s.img}`}
        alt={topicName}
      />
      <div className="card-body">
        <h2 className={`card-title ${s.module_name}`}>{capitalizedTopic}</h2>
        <p className={`card-text ${s.module_description}`}>
          {`${description || "No description found for this course."}`}
        </p>
        <Button variant="outlined" onClick={exploreTopic}>
          Explore
        </Button>
      </div>
    </div>
  );
}

export default TopicItem;
