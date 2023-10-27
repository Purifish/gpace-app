import s from "./style.module.css";

import Logo from "../Logo/Logo";
import { AuthContext } from "../../contexts/auth-context";
import { useContext } from "react";

function Header(props) {
  const auth = useContext(AuthContext);
  const { openModal } = props;
  const storedData = JSON.parse(localStorage.getItem("userData"));
  return (
    <div className={`row ${s.container}`}>
      {/*12 on mobile*/}
      <div className="col-xs-6 col-sm-4">
        <Logo />
      </div>
      <div className="col-xs-0 col-sm-4 col-md-5 col-lg-6">
        <h2 className={`${s.welcome}`}>
          {auth.isLoggedIn && `Welcome ${auth.username.split(" ")[0]}`}
        </h2>
      </div>
      <div className={`col-xs-6 col-sm-4 col-md-3 col-lg-2`}>
        <h2
          className={`${s.auth}`}
          onClick={auth.isLoggedIn ? auth.logout : openModal}
        >
          {auth.isLoggedIn ? "Log Out" : "Sign Up"}
        </h2>
      </div>
    </div>
  );
}

export default Header;
