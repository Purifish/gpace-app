import { useCapitalizer } from "../../hooks/capitalize-hook";
import s from "./style.module.css";

function EmptyResource(props) {
  const { resourceType } = props;
  const { capitalizeWords } = useCapitalizer();

  return (
    <div className={`card`}>
      <div className="card-body">
        <h1 className={`card-title ${s.title}`}>{`No ${capitalizeWords(
          resourceType
        )} Found`}</h1>
        <p
          className={`card-text ${s.message}`}
        >{`There are currently no ${resourceType} available for this course. Come back in the near future!`}</p>
      </div>
    </div>
  );
}

export default EmptyResource;
