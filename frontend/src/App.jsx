import s from "./style.module.css";

import { Outlet, useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";

import AuthForm from "./components/auth_components/AuthForm/AuthForm";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { AuthContext } from "./contexts/auth-context";
import AuthSuccess from "./components/auth_components/AuthSuccess/AuthSuccess";

let logoutTimer;

function App() {
  // Set to true to display login modal
  const [authMode, setAuthMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState();

  const navigate = useNavigate();

  function openAuthModal() {
    setAuthMode(true);
  }

  function closeAuthModal() {
    setAuthMode(false);
  }

  const login = useCallback((uid, userName, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setUserName(userName);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 3600);

    setTokenExpiry(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        userName: userName,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  /* Clear all user data upon logout */
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpiry(null);
    setUserId(null);
    setUserName(null);
    localStorage.removeItem("userData");
    setSuccessMessage("You have been logged out");
    navigate("/"); // redirect to homepage
  }, [navigate]);

  const updateSuccessMessage = useCallback((message) => {
    setSuccessMessage(message);
  }, []);

  /* Auto logout */
  useEffect(() => {
    if (token && tokenExpiry) {
      const remainingTime = tokenExpiry.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiry]);

  /* Maintain login status on page reload */
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      // auto login
      login(
        storedData.userId,
        storedData.userName,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        successMessage: successMessage,
        login: login,
        logout: logout,
        updateSuccessMessage: updateSuccessMessage,
      }}
    >
      <div className={s.main_container}>
        <Header openModal={openAuthModal} />
        <AuthForm authMode={authMode} closeModal={closeAuthModal} />
        <AuthSuccess
          successMessage={successMessage}
          closeModal={() => setSuccessMessage("")}
        />
        <div className={s.workspace}>
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </AuthContext.Provider>
  );
}

{
  /*
<a 
  href="https://www.flaticon.com/free-icons/maths" 
  title="maths icons"
>
  Maths icons created by Freepik - Flaticon
</a>
*/
}

export default App;
