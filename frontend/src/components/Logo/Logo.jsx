import s from "./style.module.css";
// import logoImg from "../../assets/images/dolphins.jpg";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useNavigate } from "react-router-dom";

function Logo(props) {
  const title = "GPAce";
  // const image = logoImg;
  const navigate = useNavigate();

  function navigateToHome() {
    navigate("/");
  }

  return (
    <div className={s.container}>
      {/* <img className={s.img} src={image} alt="logo" onClick={navigateToHome} /> */}
      <AutoAwesomeOutlinedIcon className={s.img} onClick={navigateToHome} />
      <div className={s.logo_text} onClick={navigateToHome}>
        {title}
      </div>
    </div>
  );
}

export default Logo;
