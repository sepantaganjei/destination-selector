import styles from "./filter.module.css";

const Filtrer = () => {
    return (
        <div>
        <div className={styles.container}>
            <header className={styles.header}>Alle destinasjoner</header>
            <div>
                <form className={styles.form}>
                <input
                            type="text"
                            placeholder="Filtrer destinasjoner"
                            className={styles.input}>
                        </input>
                    <button className={styles.button}>Filtrer</button>
                </form>
            </div>

        </div> 
        <div> <p> Her kommer alle destinasjoner</p></div> 
     </div>
    );
}
export default Filtrer;