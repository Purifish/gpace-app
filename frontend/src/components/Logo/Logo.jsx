import s from "./style.module.css";
// import logoImg from "../../assets/images/dolphins.jpg";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useNavigate } from "react-router-dom";

import { useHttpClient } from "../../hooks/http-hook";

function Logo(props) {
  const title = "GPAce";
  // const image = logoImg;
  const navigate = useNavigate();

  const { sendRequest } = useHttpClient();

  // TODO: Remove after done with test
  async function foo() {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/test`
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log("baddd");
      } else {
        console.log(responseData);
      }
    } catch (err) {
      // setErrorMessage(err.message);
      console.log(err.message);
    }
  }

  function navigateToHome() {
    navigate("/");
  }

  return (
    <div className={s.container}>
      {/* <img className={s.img} src={image} alt="logo" onClick={navigateToHome} /> */}
      <AutoAwesomeOutlinedIcon className={s.img} onClick={navigateToHome} />
      <div className={s.logo_text} onClick={foo}>
        {title}
      </div>
    </div>
  );
}

export default Logo;
