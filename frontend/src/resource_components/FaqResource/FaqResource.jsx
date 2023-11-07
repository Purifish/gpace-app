import s from "./style.module.css";

function FaqResource(props) {
  const { question, answer } = props;

  return (
    <div className={`card ${s.container}`}>
      <div className="card-body">
        <h5 className={`card-title ${s.question}`}>{question}</h5>
        <p className={`card-text ${s.answer}`}>{answer}</p>
      </div>
    </div>
  );
}

export default FaqResource;
