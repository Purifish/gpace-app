import React, { useContext, useEffect, useState } from "react";

import s from "./style.module.css";
import { AuthContext } from "../../../contexts/auth-context";

function AuthSuccess(props) {
  const auth = useContext(AuthContext);
  const { successMessage, closeModal } = props;

  return (
    <>
      <div
        className={`${s.modal} ${
          !successMessage && s.hidden
        } col-sm-12 col-md-6 col-lg-4`}
      >
        {/* Exit Button */}
        <button
          className={`${s.close_modal}`}
          onClick={() => {
            closeModal();
          }}
        >
          &times;
        </button>

        <div className={`${s.message_container}`}>
          <h3>{`${successMessage}`}</h3>
        </div>
      </div>
      {/* Background Blurrer */}
      <div className={`${s.overlay} ${!successMessage && s.hidden}`}></div>
    </>
  );
}

export default AuthSuccess;
