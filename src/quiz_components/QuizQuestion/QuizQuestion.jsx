import s from "./style.module.css";
import Button from 'react-bootstrap/Button';
import { useState } from "react";

function QuizQuestion(props) {
    const {
        qnNumber,
        question,
        options,
        handleClick,
        type, // radio or checkbox
        setSelectedChoices
    } = props;

    const [selectedOption, setSelectedOption] = useState(-1);

    console.log(selectedOption);

    return (
        <div className={`row justify-content-center`}>
            <div className={s.container}>
                <h3 className={s.question}>{`${qnNumber}. ${question}`}</h3>
                {options.map((option, idx) => {
                    return (
                        <div key={`option-${idx}`} className={s.option_container}>
                            <input 
                                type="radio" 
                                id={`option-${idx}`} 
                                name={question} 
                                value={idx} 
                                className={s.option_text}
                                onChange={e => {
                                    setSelectedOption(e.target.value);
                                }}
                            />
                            <label htmlFor={`option-${idx}`}>{option}</label><br></br>
                        </div>
                    );
                })}
                <Button 
                    variant="success"
                    className={`${s.button}`}
                    onClick={() => {
                        setSelectedChoices(prev => [...prev, selectedOption]);
                        handleClick(prev => prev + 1);
                    }}
                > 
                    Next
                </Button>
            </div>
        </div>
        
    );
}

export default QuizQuestion;