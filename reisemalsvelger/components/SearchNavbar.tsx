import Link from "next/link";
import styles from "./searchnavbar.module.css";
import { FaArrowRightLong } from "react-icons/fa6";

const SearchNavbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <button id={styles.destinationBtn}>
          <Link href={"hduwhdkqw"}>
            <p>Se alle destinasjoner</p>
            <FaArrowRightLong id={styles.arrow} />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default SearchNavbar;
