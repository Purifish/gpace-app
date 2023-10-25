import s from "./style.module.css";

import { Outlet, useNavigate } from "react-router-dom";
import { useCallback, useContext, useState, useEffect } from "react";

import AuthForm from "./components/auth_components/AuthForm/AuthForm";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CurrentCourseContext } from "./contexts/CurrentCourseContext";
import { AuthContext } from "./contexts/auth-context";

let logoutTimer;

function App() {
  const initialCurrentCourse = useContext(CurrentCourseContext);
  const [currentCourse, setCurrentCourse] = useState(initialCurrentCourse);
  // Set to true to display login modal
  const [authMode, setAuthMode] = useState(false);

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState();

  const navigate = useNavigate();

  function openModal() {
    setAuthMode(true);
  }

  function closeModal() {
    setAuthMode(false);
  }

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 3600);

    setTokenExpiry(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
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
    localStorage.removeItem("userData");
    navigate("/"); // redirect to homepage
  }, [navigate]);

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
        login: login,
        logout: logout,
      }}
    >
      <CurrentCourseContext.Provider
        value={{ currentCourse, setCurrentCourse }}
      >
        <div className={s.main_container}>
          <Header openModal={openModal} />
          <AuthForm authMode={authMode} closeModal={closeModal} />
          <div className={s.workspace}>
            <Outlet />
          </div>
          {/* <Footer /> */}
        </div>
      </CurrentCourseContext.Provider>
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
