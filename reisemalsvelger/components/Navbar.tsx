import styles from "./navbar.module.css";
import { FaUserAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className={styles["navbar-container"]}>
      <div className={styles["logo-container"]}>
        <img
          title="Image"
          src="https://static.vecteezy.com/system/resources/thumbnails/024/553/534/small/lion-head-logo-mascot-wildlife-animal-illustration-generative-ai-png.png"
        ></img>
        <div className={styles["title-container"]}>
          <h1>Ferdfinner</h1>
        </div>
      </div>

      <div className={styles["login-button-container"]}>
        <button title="Login">
          <FaUserAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
