import s from "./style.module.css";
import TopicItem from "../../components/TopicItem/TopicItem";

import { useNavigate } from "react-router-dom";

import logoImg from "../../assets/images/logo.png";
import mathImg from "../../assets/images/math.png";
import { useHttpClient } from "../../hooks/http-hook";
import { useEffect, useState } from "react";

// const topicList = [
//   {
//     name: "Geography",
//     img: logoImg,
//     pathName: "geography",
//   },
//   {
//     name: "C++",
//     img: logoImg,
//     pathName: "c++",
//   },
//   {
//     name: "Maths",
//     img: mathImg,
//     pathName: "math",
//   },
// ];

function TopicsBrowse(props) {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [topicList, setTopicList] = useState();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/quizzes/`
        );
        setTopicList(responseData.topics);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequest]);

  return (
    topicList && (
      <div className={`row justify-content-center`}>
        {topicList.map((topicItem, idx) => {
          return (
            <div
              key={`topicList${idx}`}
              className={`${s.card_container} col-xs-12 col-sm-6 col-md-4 col-lg-3`}
            >
              <TopicItem
                topicName={topicItem.topic}
                imgSrc={topicItem.image}
                startQuiz={() =>
                  navigate(`/quiz/${encodeURIComponent(topicItem.topic)}`)
                }
              />
            </div>
          );
        })}
      </div>
    )
  );
}

export default TopicsBrowse;
