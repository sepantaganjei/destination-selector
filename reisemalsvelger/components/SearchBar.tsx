"use client";
import styles from "./searchbar.module.css";
import React, { KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    if (query === "") return;
    router.push(`/search?search=${query}`);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.iconContainer} onClick={handleSearch} >
        <IoSearchOutline size="20px" color="var(--color-foreground)" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Søk destinasjoner"
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;
