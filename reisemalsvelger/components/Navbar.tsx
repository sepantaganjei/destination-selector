"use client";
import styles from "./navbar.module.css";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useTheme } from "@/context/theme";
import { useEffect } from "react";
import { setTheme } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";
import { FaMoon } from "react-icons/fa6";
import { IoIosMoon, IoMdPerson } from "react-icons/io";
import { IoMoon, IoMoonOutline, IoPerson, IoPersonOutline, IoSunny } from "react-icons/io5";
import { LuMountain } from "react-icons/lu";

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
        <LuMountain size="30px" />
        <div className={styles["title-container"]}>
          <h1>Fjell og Fjord</h1>
        </div>
      </Link>

      <SearchBar />
      <div className={styles["right-side"]}>
        <button className={styles.iconButton} onClick={() => changeTheme()} >
          {theme === "light" ? 
            <IoMoon color="var(--color-foreground)" size="30px" />
          : 
            <IoSunny color="var(--color-foreground)" size="30px" />
          }
        </button>

        <div>
          <Link href="/profile">
            <button className={styles.iconButton} >
              <IoPerson color="var(--color-foreground)" size="30px" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
