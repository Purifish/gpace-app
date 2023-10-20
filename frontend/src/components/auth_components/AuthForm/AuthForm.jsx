import React, { useContext, useState } from "react";

import { Button } from "@mui/material";

import s from "./style.module.css";
import { AuthContext } from "../../../contexts/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";

function AuthForm(props) {
  const auth = useContext(AuthContext);
  const { authMode, closeModal } = props;
  const [isLoginMode, setLoginMode] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, setFormState] = useState({
    email: "",
    username: "",
    password: "",
    image: null,
  });

  async function authSubmitHandler(event) {
    event.preventDefault();
    console.log("TEST");
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.email,
            password: formState.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      // CHECKPOINT
    }
  }

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

        <form onSubmit={authSubmitHandler}>
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
            <Button type="submit" variant="contained">
              {isLoginMode ? "Login " : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>

      {/* Background Blurrer */}
      <div className={`${s.overlay} ${!authMode && s.hidden}`}></div>
    </>
  );
}

export default AuthForm;