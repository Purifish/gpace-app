import s from "./style.module.css";

import Logo from "../Logo/Logo";
import { AuthContext } from "../../contexts/auth-context";
import { useContext } from "react";

function Header(props) {
  const auth = useContext(AuthContext);
  const { openModal } = props;
  return (
    <div className={`row ${s.container}`}>
      {/*12 on mobile*/}
      <div className="col-xs-6 col-sm-4">
        <Logo />
      </div>
      <div className="col-xs-0 col-sm-4 col-md-5 col-lg-6"></div>
      <div
        className={`col-xs-6 col-sm-4 col-md-3 col-lg-2 ${s.auth_container}`}
      >
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
