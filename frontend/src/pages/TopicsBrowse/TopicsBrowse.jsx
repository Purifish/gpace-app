import s from "./style.module.css";
import TopicItem from "../../components/TopicItem/TopicItem";
import topicList from "./topics";

import { useNavigate } from "react-router-dom";

function TopicsBrowse(props) {
    const navigate = useNavigate();

    return (
        <div className={`row justify-content-center`}>
            {topicList.map((topic, idx) => {
                return (
                    <div key={`topicList${idx}`} className={`${s.card_container} col-xs-12 col-sm-6 col-md-4 col-lg-3`}>
                        <TopicItem
                            topicName={topic.name}
                            img={topic.img}
                            startQuiz={() => navigate(`/quiz/${topic.pathName}`)}
                        />
                    </div>
                );             
            })}

        </div>
    );
}

export default TopicsBrowse;