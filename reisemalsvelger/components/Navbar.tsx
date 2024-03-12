"use client";
import styles from "./navbar.module.css";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useTheme } from "@/context/theme";
import { useEffect } from "react";
import { setTheme } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  const changeTheme = () => {
    toggleTheme();
  };

  useEffect(() => {
    if (!loading && user) {
      setTheme(user!.uid, theme);
    }
  }, [theme]);

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
        <button onClick={() => changeTheme()}>Bytt tema</button>

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
