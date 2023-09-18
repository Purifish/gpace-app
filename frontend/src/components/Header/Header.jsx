import s from "./style.module.css";

import Logo from "../Logo/Logo";

function Header(props) {
    return (
        <div className={`row ${s.container}`}>
            <div className="col-xs-12 col-sm-4"> {/*12 on mobile*/}
                <Logo/>
            </div>
        </div>
    );
}

export default Header;