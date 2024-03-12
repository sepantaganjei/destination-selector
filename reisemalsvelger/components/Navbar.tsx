"use client";
import styles from "./navbar.module.css";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useTheme } from "@/context/theme";

const Navbar = () => {
  const { toggleTheme } = useTheme();

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

      <div className={styles["right-side"]}>
        <SearchBar />
        <button onClick={() => toggleTheme()}>Bytt tema</button>

        <div>
          <Link href="/profile">
            <button title="Login" className={styles["login-button"]}>
              <FaUserAlt />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
