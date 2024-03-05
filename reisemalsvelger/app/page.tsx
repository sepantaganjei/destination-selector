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
import { Review } from "@/types/Review";
import MostPopular from "@/components/MostPopular";
import Recommended from "@/components/Recommended";
import { useAuth } from "@/context/authContext";
import { Preference } from "@/types/Preference";

export default function Home() {
  const [travelDestinations, setTravelDestinations] = useState<
    TravelDestination[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  const fetchTags = async () => {
    const fetchedTags = await getTags("h5tsqyxe5oB5BVM0f0St");
    setTags(fetchedTags.map((tag) => tag.toLowerCase()));
  };
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuth();
  const fetchDestinations = async () => {
    let data = await getData<TravelDestination>("travelDestination");
    data = data.map((travelDestination) => ({
      ...travelDestination,
      tags: travelDestination.tags.map((tag) => tag.toLowerCase()),
    }));
    setTravelDestinations(data);
  };
  const fetchPreferences = async () => {
    let existingPreference = await getData<Preference>("userPreference");
    setPreferences(existingPreference[0].tag.map((tag) => tag.toLowerCase()));
  };

  useEffect(() => {
    fetchDestinations();
    fetchTags();
    fetchReviews();
    fetchPreferences();
  }, []);

  const fetchReviews = async () => {
    let reviewData = await getData<Review>("reviews");
    setReviews(reviewData);
  };

  const filteredDestinations = travelDestinations.filter((destination) => {
    const destinationReviews = reviews.filter(
      (review) => review.destinationId === destination.id,
    );
    const averageRating =
      destinationReviews.length > 0
        ? destinationReviews.reduce((sum, review) => sum + review.rating, 0) /
          destinationReviews.length
        : 0;
    return averageRating > 4;
  });

  const recommendedDestinations = travelDestinations.filter((destination) => {
    return destination.tags.some((lammeg) => preferences.includes(lammeg));
  });

  return (
    <>
      <HomeBanner />
      <SearchNavbar />
      <MostPopular travelDestinations={filteredDestinations} name={""} />
      {user && recommendedDestinations.length > 0 && (
        <>
          <Recommended travelDestinations={recommendedDestinations} name={""} />
        </>
      )}
      {tags.map((tag) => (
        <Category
          key={tag}
          name={tag[0].toUpperCase() + tag.slice(1).toLowerCase()}
          travelDestinations={travelDestinations.filter((travelDestination) =>
            travelDestination.tags.includes(tag),
          )}
        />
      ))}
    </>
  );
}
