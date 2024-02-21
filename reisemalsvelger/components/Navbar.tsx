import styles from "./navbar.module.css";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className={styles["navbar-container"]}>
      <Link href="/" className={styles["logo-container"]}>
        <img
          title="Image"
          alt="logo"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0lahmL7dYeyPHJEwrOgsejj77EtDzUlcOSg&usqp=CAU"
        />
        <div className={styles["title-container"]}>
          <h1>Fjell og Fjord</h1>
        </div>
      </Link>

      <div className={styles["login-button-container"]}>
        <Link href="/profile">
          <button title="Login">
            <FaUserAlt />
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
