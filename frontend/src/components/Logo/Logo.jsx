import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useNavigate } from "react-router-dom";

import s from "./style.module.css";

function Logo(props) {
  const title = "GPAce";
  const navigate = useNavigate();

  function navigateToHome() {
    navigate("/");
  }

  return (
    <div className={s.container}>
      <AutoAwesomeOutlinedIcon className={s.img} onClick={navigateToHome} />
      <div className={s.logo_text} onClick={navigateToHome}>
        {title}
      </div>
    </div>
  );
}

export default Logo;
