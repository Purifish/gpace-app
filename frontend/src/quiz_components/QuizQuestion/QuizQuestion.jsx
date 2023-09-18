import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import s from "./style.module.css";

function QuizQuestion(props) {
  const {
    qnNumber, // int
    question, // string
    options, // arr
    updateSelected, // func
    type, // radio or checkbox
  } = props;

  const optionComponents = options.map((option, idx) => {
    return (
      <div key={`option-${idx}`} className={s.option_container}>
        {type === "radio" ? (
          <FormControlLabel
            value={idx}
            control={
              <Radio
                onChange={(e) => {
                  updateSelected(qnNumber - 1, idx, e.target.checked);
                }}
              />
            }
            label={`${option}`}
          />
        ) : (
          <FormControlLabel
            label={`${option}`}
            control={
              <Checkbox
                id={`option-${idx}`}
                value={idx}
                className={s.option_text}
                onChange={(e) => {
                  updateSelected(qnNumber - 1, idx, e.target.checked);
                }}
              />
            }
          />
        )}
      </div>
    );
  });

  return (
    <div className={`row justify-content-center`}>
      <div className={s.container}>
        <h3 className={s.question}>{`${qnNumber}. ${question}`}</h3>
        {type === "radio" ? (
          <FormControl>
            <RadioGroup>{optionComponents}</RadioGroup>
          </FormControl>
        ) : (
          <>{optionComponents}</>
        )}
      </div>
    </div>
  );
}

export default QuizQuestion;

/*
Checkpoint:
    Todo ->
        IMPT: Fix isSelected update issue (FIXED)
        Settle checkbox stuff (DONE)
        Calculate correct score (DONE)
        Allow radio and checkbox (DONE)
        Remove buttons per qn (only 1 button at the end) (DONE)
        Use mat-ui buttons (DONE)
        Design buttons with CSS (SKIPPED)

        Connect to MongoDB
        Populate DB with quiz data
        Fetch quiz data

        Authentication Matters


*/
