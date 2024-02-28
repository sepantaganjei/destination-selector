import SearchBar from "./SearchBar";
import styles from "./homebanner.module.css";

const HomeBanner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h1>Finn din drømmereise</h1>
        <p>Utforsk skjulte perler og populære destinasjoner fra nord til sør</p>
        <SearchBar />
      </div>
    </div>
  );
};

export default HomeBanner;
