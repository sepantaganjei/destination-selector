import React, { useState, useEffect } from "react";
import styles from "./filter.module.css";
import Link from "next/link";
import { TravelDestination } from "@/types/TravelDestination";
import { getData, getTags } from "@/app/firebaseAPI";
import TravelDestinationCard from "@/components/TravelDestinationCard";

type CategoryItemProps = {
  reisedestinasjon: TravelDestination;
};

const CategoryItem = ({ reisedestinasjon }: CategoryItemProps) => {
  return (
    <Link
      href={`/destinasjoner/${reisedestinasjon.id}`}
      className={styles.categoryItem}
      style={{ backgroundImage: `url(${reisedestinasjon.imageUrl})` }}
    >
      {reisedestinasjon.name}
    </Link>
  );
};

const Filtrer = () => {
  const [travelDestinations, setTravelDestinations] = useState<
    TravelDestination[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<
    TravelDestination[]
  >([]);

  const fetchDestinations = async () => {
    let data = await getData<TravelDestination>("travelDestination");
    data = data.map((travelDestination) => ({
      ...travelDestination,
      tags: travelDestination.tags.map((tag) => tag.toLowerCase()),
    }));
    setTravelDestinations(data);
    setFilteredDestinations(data);
  };

  const fetchTags = async () => {
    const fetchedTags = await getTags("h5tsqyxe5oB5BVM0f0St");
    setTags(fetchedTags.map((tag) => tag.toLowerCase()));
  };

  useEffect(() => {
    fetchTags();
    fetchDestinations();
  }, []);

  // const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedTag, setSelectedTag] = useState("0");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = travelDestinations;

    // if (selectedCategory !== "0") {
    //   filtered = filtered.filter((dest) => dest.tag === selectedCategory);
    // }
    console.log(filtered);
    console.log(selectedTag);
    if (selectedTag !== "0") {
      filtered = filtered.filter((dest) => dest.tags?.includes(selectedTag));
    }

    setFilteredDestinations(filtered);
  };

  return (
    <div>
      <div className={styles.container}>
        <header className={styles.header}>Alle destinasjoner</header>
        <div>
          <form className={styles.form} onSubmit={handleFilter}>
            <select
              className={styles.pulldown}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="0">Alle</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag[0].toUpperCase() + tag.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <button className={styles.button}>Filtrer</button>
          </form>
        </div>
      </div>
      <div className={styles.categoryList}>
        {filteredDestinations.map((reisedestinasjon, i) => (
          <TravelDestinationCard key={i} travelDestination={reisedestinasjon} />
        ))}
      </div>
    </div>
  );
};
export default Filtrer;
