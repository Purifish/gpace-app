import React from "react";

import s from "./style.module.css";

function AuthForm(props) {
  const { authMode, closeModal } = props;
  return (
    <>
      <div className={`${s.modal} ${!authMode && s.hidden}`}>
        <button class={`${s.close_modal}`} onClick={closeModal}>
          &times;
        </button>
        <h1>I'm a modal window 😍</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div className={`${s.overlay} ${!authMode && s.hidden}`}></div>
    </>
  );
}

export default AuthForm;
