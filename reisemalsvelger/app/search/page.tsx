"use client";
import React, { Suspense } from "react";
import styles from "./page.module.css";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { getSearchResults } from "@/app/firebaseAPI";
import { useEffect } from "react";
import { useState } from "react";
import TravelDestinationCard from "@/components/TravelDestinationCard";

export default function Home() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const [searchResults, setSearchResults] = useState<any[]>([]);
  console.log(searchResults);

  useEffect(() => {
    if (search) {
      getSearchResults(search).then((results) => {
        setSearchResults(results);
      });
    }
  }, [search]);

  return (
    <Suspense>
      <div className={styles.results}>
        {searchResults.length === 0 ? (
          <p>Ingen destinasjoner møter ditt søk</p>
        ) : (
          searchResults.map((result) => (
            <TravelDestinationCard
              key={result.name}
              travelDestination={result}
              rating={0}
            />
          ))
        )}
      </div>
    </Suspense>
  );
}
