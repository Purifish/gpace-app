import s from "./style.module.css";

function TopicItem(props) {
    const { 
        topicName, 
        img,
        startQuiz
    } = props;

    return (
        <div className={`card ${s.container}`}>
            <img src={img} className={`card-img-top ${s.img}`} alt={topicName} />
            <div className="card-body">
                <h5 className="card-title">{topicName}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <button
                    type="button" 
                    className={`btn btn-dark ${s.button}`}
                    onClick={startQuiz}
                > 
                     Start
                </button>
            </div>
        </div>    
    );
}

export default TopicItem;