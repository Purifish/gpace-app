import React from "react";

import s from "./style.module.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && `${s.loading_spinner__overlay}`}`}>
      <div className={`${s.lds_dual_ring}`}></div>
    </div>
  );
};

export default LoadingSpinner;
