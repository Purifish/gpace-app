import { Button } from "@mui/material";
import s from "./style.module.css";
import logoImg from "../../assets/images/logo.png";
import { useHttpClient } from "../../hooks/http-hook";
import { useState, useEffect } from "react";

function TopicItem(props) {
  const { topicName, imgSrc, description, exploreTopic } = props;
  const capitalizedTopic = topicName
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");

  // let imagePath;

  const { sendRequest } = useHttpClient();
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const createTempUrl = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_ASSET_URL}/${imgSrc}`
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setImageUrl(url);
        }
      } catch (err) {}
    };
    if (imgSrc) {
      createTempUrl();
    }
  }, [imgSrc, sendRequest, setImageUrl]);

  // imagePath = imgSrc ? `${process.env.REACT_APP_ASSET_URL}/${imgSrc}` : logoImg;

  return (
    <div className={`card ${s.container}`}>
      <img
        src={imageUrl || logoImg}
        // src={imagePath}
        className={`card-img-top ${s.img}`}
        alt={topicName}
      />
      <div className="card-body">
        <h2 className={`card-title ${s.module_name}`}>{capitalizedTopic}</h2>
        <p className={`card-text ${s.module_description}`}>
          {`${
            description
              ? description.length > 140
                ? `${description.substring(0, 140)}...`
                : description
              : "No description found for this course."
          }`}
        </p>
        <Button variant="outlined" onClick={exploreTopic}>
          Explore
        </Button>
      </div>
    </div>
  );
}

export default TopicItem;
