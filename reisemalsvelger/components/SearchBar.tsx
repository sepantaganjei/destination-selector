import styles from "./searchbar.module.css";
import React, { useState } from "react";

const SearchBar = () => {
  return (
    <div className={styles.searchbar}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Søk destinasjoner"
          className={styles.input}
        />
        <button type="button" className={styles.button}>
          Søk
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
