import s from "./style.module.css";
import Button from 'react-bootstrap/Button';

function QuizQuestion(props) {
    const {
        qnNumber,
        question,
        options,
        handleClick,
        type, // radio or checkbox
    } = props;

    return (
        <div className={`row justify-content-center`}>
            <div className={s.container}>
                <h3 className={s.question}>{`${qnNumber}. ${question}`}</h3>
                {options.map((option, idx) => {
                    return (
                        <div key={`option-${idx}`} className={s.option_container}>
                            <input type="radio" id={`option-${idx}`} name={question} value={option} className={s.option_text}/>
                            <label for={`option-${idx}`}>{option}</label><br></br>
                        </div>
                    );
                })}
                <Button 
                    variant="success"
                    className={`${s.button}`}
                    onClick={() => {
                        handleClick(prev => prev + 1);
                    }}
                > 
                    Submit
                </Button>
            </div>
        </div>
        
    );
}

export default QuizQuestion;