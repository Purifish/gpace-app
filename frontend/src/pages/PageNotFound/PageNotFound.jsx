import React from "react";
import { Link } from "react-router-dom";

import s from "./style.module.css";
import mcCat from "../../assets/images/McCat.png";

function PageNotFound() {
  return (
    <div className={`${s.main_container}`}>
      <div className={`${s.container}`}>
        <h1 className={`${s.main_text}`}>404 Page Not Found</h1>
      </div>
      <div className={`${s.container}`}>
        <h2 className={`${s.message}`}>
          Sorry, we couldn't find what you were looking for.
        </h2>
      </div>
      <div className={`${s.container}`}>
        <h2 className={`${s.message}`}>However, we did find McKitty!</h2>
      </div>
      <div className={`${s.container}`}>
        <img src={mcCat} className={`${s.img}`} alt={"McKitty"} />
      </div>
      <div className={`${s.container}`}>
        <Link to="/" className={`${s.home_link}`}>
          Homepage
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
