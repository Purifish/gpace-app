import s from "./style.module.css";

function QuizQuestion(props) {
  const {
    qnNumber, // int
    question, // string
    options, // arr
    // setCurQuestion,
    solution,
    score,
    setUserScore,
    isSelected,
    updateSelected,
    type, // radio or checkbox
  } = props;

  return (
    <div className={`row justify-content-center`}>
      <div className={s.container}>
        <h3 className={s.question}>{`${qnNumber}. ${question}`}</h3>
        {options.map((option, idx) => {
          return (
            <div key={`option-${idx}`} className={s.option_container}>
              <input
                type="checkbox"
                id={`option-${idx}`}
                name={question}
                value={idx}
                className={s.option_text}
                onChange={(e) => {
                  updateSelected(qnNumber - 1, idx, e.target.checked);
                }}
              />
              <label htmlFor={`option-${idx}`}>{option}</label>
              <br></br>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuizQuestion;

/*
Checkpoint:
    Todo ->
        IMPT: Fix isSelected update issue (FIXED)
        Settle checkbox stuff
        Calculate correct score
        Allow radio and checkbox
        Remove buttons per qn (only 1 button at the end)
        Use custom buttons (instead of Bootstrap)
        Design buttons with CSS

*/
