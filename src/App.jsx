import s from "./style.module.css";

import { Outlet } from "react-router-dom";

import Header from "./components/Header/Header";

function App() {

  return (
    <div className={s.main_container}>
      <Header />
      <div className={s.workspace}>
        <Outlet /> {/*This will be replaced by a child route*/}
      </div>
      {/*TODO: Add footer */}
    </div>
    );
}

{/*
<a 
  href="https://www.flaticon.com/free-icons/maths" 
  title="maths icons"
>
  Maths icons created by Freepik - Flaticon
</a>
*/}

export default App;
