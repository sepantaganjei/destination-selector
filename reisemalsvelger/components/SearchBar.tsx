import styles from "./searchbar.module.css";
import React, { useState } from "react";
import { getSearchResults } from "../app/firebaseAPI";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query === "") return;
    const searchResults = await getSearchResults(query);
    console.log("Search results", searchResults);
  };

  return (
    <div className={styles.searchbar}>
      <div className={styles.inputContainer}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søk destinasjoner"
            className={styles.input}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
