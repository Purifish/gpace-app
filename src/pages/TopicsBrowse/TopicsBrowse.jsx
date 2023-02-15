import TopicItem from "../../components/TopicItem/TopicItem";
import s from "./style.module.css";
import logoImg from "../../assets/images/logo.png";
import mathImg from "../../assets/images/math.png";

function TopicsBrowse(props) {
    const topicList = [
        {
            name: "Geography",
            img: logoImg
        },
        {
            name: "C++",
            img: logoImg
        },
        {
            name: "Maths",
            img: mathImg
        }
    ];

    return (
        <div className={`row justify-content-center`}>
            {topicList.map((topic, idx) => {
                return (
                    <div key={`topicList${idx}`} className={s.card_container}>
                        <TopicItem
                            topicName={topic.name}
                            img={topic.img}
                        />
                    </div>
                );             
            })}

        </div>
    );
}

export default TopicsBrowse;