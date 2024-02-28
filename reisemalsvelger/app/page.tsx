"use client";
import Image from "next/image";
import styles from "./page.module.css";
import HomeBanner from "@/components/HomeBanner";
import Category from "@/components/Category";
import SearchNavbar from "@/components/SearchNavbar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { TravelDestination } from "@/types/TravelDestination";
import { getData, getTags } from "./firebaseAPI";

export default function Home() {
  const [travelDestinations, setTravelDestinations] = useState<
    TravelDestination[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async () => {
    const fetchedTags = await getTags("h5tsqyxe5oB5BVM0f0St");
    setTags(fetchedTags.map((tag) => tag.toLowerCase()));
  };

  const fetchDestinations = async () => {
    let data = await getData<TravelDestination>("travelDestination");
    data = data.map((travelDestination) => ({
      ...travelDestination,
      tags: travelDestination.tags.map((tag) => tag.toLowerCase()),
    }));
    setTravelDestinations(data);
  };

  useEffect(() => {
    fetchDestinations();
    fetchTags();
  }, []);

  return (
    <>
      <HomeBanner />
      <SearchNavbar />
      {tags.map((tag) => (
        <Category
          key={tag}
          name={tag[0].toUpperCase() + tag.slice(1).toLowerCase()}
          travelDestinations={travelDestinations.filter((travelDestination) =>
            travelDestination.tags.includes(tag)
          )}
        />
      ))}
    </>
  );
}
