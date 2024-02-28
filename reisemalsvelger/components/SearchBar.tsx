import styles from "./searchbar.module.css";
import React, { useState } from "react";

const SearchBar = () => {
  return (
    <div>
      <input
        type="text"
        placeholder="Søk destinasjoner"
        className="search-input"
      />
      <button type="button" className="search-button">
        Søk
      </button>
    </div>
  );
};

export default SearchBar;
