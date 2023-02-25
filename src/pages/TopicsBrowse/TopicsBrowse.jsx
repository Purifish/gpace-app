import TopicItem from "../../components/TopicItem/TopicItem";
import s from "./style.module.css";
import logoImg from "../../assets/images/logo.png";
import mathImg from "../../assets/images/math.png";
import { useNavigate } from "react-router-dom";

function TopicsBrowse(props) {
    const topicList = [
        {
            name: "Geography",
            img: logoImg,
            pathName: "geography"
        },
        {
            name: "C++",
            img: logoImg,
            pathName: "cpp"
        },
        {
            name: "Maths",
            img: mathImg,
            pathName: "maths"
        }
    ];

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