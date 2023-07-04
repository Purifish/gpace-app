import s from "./style.module.css";
import logoImg from "../../assets/images/dolphins.jpg";

function Logo(props) {
    const title = "Quiz Whiz";
    const image = logoImg;

    return (
        <div className={s.container}>
            <img className={s.img} src={image} alt="logo" />
            <div className={s.logo_text}>{title}</div>
        </div>
    );
}

export default Logo;