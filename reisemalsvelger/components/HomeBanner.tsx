import styles from "./homebanner.module.css";

const HomeBanner = () => {
    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <h1>blablabla</h1>
                <p>blablablablabla</p>
                <button>Prøv lykken</button>
            </div>
        </div>
    );
}

export default HomeBanner;