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
    imageSrc,
  } = props;

  const optionComponents = options.map((option, idx) => {
    return (
      <div key={`option-${idx}`} className={s.option_container}>
        {type === "radio" ? (
          <FormControlLabel
            value={idx}
            control={<Radio />}
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
                  updateSelected(qnNumber - 1, idx, e.target.checked, false);
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
        <h4 className={s.question}>{`${qnNumber}. ${question}`}</h4>
        {imageSrc !== "" && (
          <div>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${imageSrc}`}
              alt={`quiz question`}
              className={`${s.img}`}
            />
          </div>
        )}
        {type === "radio" ? (
          <FormControl>
            <RadioGroup
              onChange={(e) => {
                updateSelected(qnNumber - 1, e.target.value, true, true);
              }}
            >
              {optionComponents}
            </RadioGroup>
          </FormControl>
        ) : (
          <>{optionComponents}</>
        )}
      </div>
    </div>
  );
}

export default QuizQuestion;
