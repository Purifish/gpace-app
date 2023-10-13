import s from "./style.module.css";

import { Outlet } from "react-router-dom";

import AuthForm from "./components/auth_components/AuthForm/AuthForm";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CurrentCourseContext } from "./contexts/CurrentCourseContext";
import { useContext, useState } from "react";

function App() {
  const initialCurrentCourse = useContext(CurrentCourseContext);
  const [currentCourse, setCurrentCourse] = useState(initialCurrentCourse);
  const [authMode, setAuthMode] = useState(false);

  function openModal() {
    setAuthMode(true);
  }

  function closeModal() {
    setAuthMode(false);
  }

  return (
    <CurrentCourseContext.Provider value={{ currentCourse, setCurrentCourse }}>
      <div className={s.main_container}>
        <Header openModal={openModal} />
        <AuthForm authMode={authMode} closeModal={closeModal} />
        <div className={s.workspace}>
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </CurrentCourseContext.Provider>
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
