import s from "./style.module.css";

function Footer(props) {
    const year = new Date().getFullYear();
    return (
        // TODO: Add Freepik acknowledgement
        <div className={`row ${s.container}`}>
            <footer>
                <p>Copyright ⓒ {year}</p>
            </footer>
        </div>
    );
}

export default Footer;