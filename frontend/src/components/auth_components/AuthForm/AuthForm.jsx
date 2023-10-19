import React, { useState } from "react";

import s from "./style.module.css";
import { Button } from "@mui/material";

function AuthForm(props) {
  const { authMode, closeModal } = props;
  const [isLoginMode, setLoginMode] = useState(false);
  return (
    <>
      <div
        className={`${s.modal} ${
          !authMode && s.hidden
        } col-sm-12 col-md-6 col-lg-4`}
      >
        {/* Exit Button */}
        <button class={`${s.close_modal}`} onClick={closeModal}>
          &times;
        </button>

        <div className={`${s.title_container}`}>
          <h3>{`GPAce ${isLoginMode ? "Login" : "Sign Up"}`}</h3>
        </div>

        <div className={`${s.input_container}`}>
          <input
            id="email"
            type="text"
            placeholder="Email"
            className={`${s.form_input}`}
          />
        </div>
        {!isLoginMode && (
          <div className={`${s.input_container}`}>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className={`${s.form_input}`}
            />
          </div>
        )}
        <div className={`${s.input_container}`}>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={`${s.form_input}`}
          />
        </div>

        <div className={`${s.remark_container}`}>
          <p>
            {isLoginMode ? "No account yet? " : "Already have an account? "}
            <a
              className={`${s.anchor}`}
              onClick={() => {
                setLoginMode((prev) => !prev);
              }}
            >
              <u>{isLoginMode ? "Sign up" : "Log in"}</u>
            </a>
          </p>
        </div>

        <div className={`${s.button_container}`}>
          <Button
            variant="contained"
            onClick={() => {
              // CHECKPOINT
              console.log("sign up");
            }}
          >
            {isLoginMode ? "Login " : "Sign Up"}
          </Button>
        </div>
      </div>

      {/* Background Blurrer */}
      <div className={`${s.overlay} ${!authMode && s.hidden}`}></div>
    </>
  );
}

export default AuthForm;
