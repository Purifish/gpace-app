import React, { useContext, useState } from "react";

import { Button } from "@mui/material";

import s from "./style.module.css";
import { AuthContext } from "../../../contexts/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import FileUpload from "../../FileUpload/FileUpload";

function AuthForm(props) {
  const auth = useContext(AuthContext);
  const { authMode, closeModal } = props;
  const [isLoginMode, setLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { sendRequest } = useHttpClient();
  const [formState, setFormState] = useState({
    email: "",
    name: "",
    password: "",
    image: null,
    file: null,
  });

  async function authSubmitHandler(event) {
    setErrorMessage("");
    event.preventDefault();
    // console.log(formState);
    if (isLoginMode) {
      try {
        const response = await sendRequest(
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

        const responseData = await response.json();

        if (!response.ok) {
          setErrorMessage(responseData.message);
        } else {
          auth.login(
            responseData.userId,
            responseData.name,
            responseData.token
          );
          closeModal();
          setLoginMode(true);
          auth.updateSuccessMessage("Log In Successful!");
        }
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      // Sign-up block
      try {
        const formData = new FormData();
        formData.append("email", formState.email);
        formData.append("name", formState.name);
        formData.append("password", formState.password);
        formData.append("image", formState.image);
        formData.append("file", formState.file);

        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );

        const responseData = await response.json();

        if (!response.ok) {
          setErrorMessage(responseData.message);
        } else {
          auth.login(
            responseData.userId,
            responseData.name,
            responseData.token
          );
          closeModal();
          setLoginMode(true);
          auth.updateSuccessMessage("Sign Up Successful!");
        }
      } catch (err) {
        setErrorMessage(err.message);
      }
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
        <button
          className={`${s.close_modal}`}
          onClick={() => {
            closeModal();
            setLoginMode(true);
            setErrorMessage("");
          }}
        >
          &times;
        </button>

        <div className={`${s.title_container}`}>
          <h1 className={`${s.auth_title}`}>{`GPAce ${
            isLoginMode ? "Login" : "Sign Up"
          }`}</h1>
        </div>

        <form onSubmit={authSubmitHandler}>
          <div className={`${s.input_container}`}>
            <input
              id="email"
              type="text"
              placeholder="Email"
              className={`${s.form_input}`}
              value={formState.email}
              onChange={(event) => {
                setFormState((prev) => {
                  return {
                    ...prev,
                    email: event.target.value,
                  };
                });
              }}
            />
          </div>
          {!isLoginMode && (
            <div className={`${s.input_container}`}>
              <input
                id="username"
                type="text"
                placeholder="Name"
                className={`${s.form_input}`}
                value={formState.name}
                onChange={(event) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      name: event.target.value,
                    };
                  });
                }}
              />
            </div>
          )}
          <div className={`${s.input_container}`}>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`${s.form_input}`}
              value={formState.password}
              onChange={(event) => {
                setFormState((prev) => {
                  return {
                    ...prev,
                    password: event.target.value,
                  };
                });
              }}
            />
          </div>

          {!isLoginMode && (
            <div className={`${s.input_container}`}>
              <FileUpload
                onInput={(pickedFile) => {
                  console.log(pickedFile);
                  setFormState((prev) => {
                    return {
                      ...prev,
                      file: pickedFile,
                    };
                  });
                }}
              />
            </div>
          )}

          {errorMessage && (
            <div className={`${s.error_container}`}>
              <p>{`${errorMessage}`}</p>
            </div>
          )}

          <div className={`${s.remark_container}`}>
            <p className={`${s.remark}`}>
              {isLoginMode ? "No account yet? " : "Already have an account? "}
              <span
                className={`${s.anchor}`}
                onClick={() => {
                  setErrorMessage("");
                  setLoginMode((prev) => !prev);
                }}
              >
                <u>{isLoginMode ? "Sign up" : "Log in"}</u>
              </span>
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
