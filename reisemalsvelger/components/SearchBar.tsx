"use client"
import styles from "./searchbar.module.css";
import React, { use, useState } from "react";
import { getSearchResults } from "../app/firebaseAPI";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query === "") return;
    router.push(`/search?search=${query}`);
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
