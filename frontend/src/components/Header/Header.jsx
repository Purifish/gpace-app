import s from "./style.module.css";

import Logo from "../Logo/Logo";

function Header(props) {
  const { openModal } = props;
  return (
    <div className={`row ${s.container}`}>
      {/*12 on mobile*/}
      <div className="col-xs-12 col-sm-4">
        <Logo />
      </div>
      <div className="col-xs-12 col-sm-4"></div>
      <div className={`col-xs-12 col-sm-4`}>
        <h2 className={`${s.auth}`} onClick={openModal}>
          Sign Up
        </h2>
      </div>
    </div>
  );
}

export default Header;
