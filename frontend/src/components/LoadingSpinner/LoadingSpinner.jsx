import React from "react";

import s from "./style.module.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && s.loading_spinner__overlay}`}>
      <div className={`${s.spinner_square}`}>
        <div className={`${s.square_1} ${s.square}`}></div>
        <div className={`${s.square_2} ${s.square}`}></div>
        <div className={`${s.square_3} ${s.square}`}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
