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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRatings, setAverageRatings] = useState<{
    [key: string]: number;
  }>({});
  const { user } = useAuth();

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

  const fetchPreferences = async () => {
    console.log("Henter preferanser");
    let existingPreference = await getData<Preference>("userPreference");
    let yourPreference = existingPreference.find(
      (preference) => preference.uid === (user?.email || ""),
    );
    setPreferences(yourPreference?.tag.map((tag) => tag.toLowerCase()) || []);
  };

  const fetchReviews = async () => {
    let reviewData = await getData<Review>("reviews");
    setReviews(reviewData);
  };

  useEffect(() => {
    fetchDestinations();
    fetchTags();
    fetchReviews();
    fetchPreferences();
  }, []);

  useEffect(() => {
    const calculateAverageRatings = () => {
      const destinationRatings: { [key: string]: number[] } = {};
      reviews.forEach((review) => {
        if (destinationRatings[review.destinationId]) {
          destinationRatings[review.destinationId].push(review.rating);
        } else {
          destinationRatings[review.destinationId] = [review.rating];
        }
      });

      const updatedAverageRatings: { [key: string]: number } = {};
      Object.keys(destinationRatings).forEach((destinationId) => {
        const ratings = destinationRatings[destinationId];
        const averageRating =
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        updatedAverageRatings[destinationId] = averageRating;
      });

      setAverageRatings(updatedAverageRatings);
    };

    calculateAverageRatings();
  }, [reviews]);

  const filteredDestinations = travelDestinations.filter((destination) => {
    const destinationReviews = reviews.filter(
      (review) => review.destinationId === destination.id,
    );
    const averageRating =
      destinationReviews.length > 0
        ? destinationReviews.reduce((sum, review) => sum + review.rating, 0) /
          destinationReviews.length
        : 0;
    averageRatings[destination.name] || 0;

    return averageRating > 4;
  });

  const recommendedDestinations = travelDestinations.filter((destination) => {
    return destination.tags.some((lammeg) => preferences.includes(lammeg));
  });

  const randomDestination = Array.from(
    new Set(recommendedDestinations.concat(filteredDestinations)),
  )[
    Math.floor(
      Math.random() *
        (recommendedDestinations.length > 0
          ? recommendedDestinations.length
          : filteredDestinations.length),
    )
  ];

  return (
    <>
      <HomeBanner travelDestination={randomDestination} name={""} />
      <SearchNavbar />
      <MostPopular
        travelDestinations={filteredDestinations}
        name={""}
        averageRatings={averageRatings}
      />
      {user && recommendedDestinations.length > 0 && (
        <>
          <Recommended
            travelDestinations={recommendedDestinations}
            name={""}
            averageRatings={averageRatings}
          />
        </>
      )}
      {tags.map((tag) => (
        <Category
          key={tag}
          name={tag[0].toUpperCase() + tag.slice(1).toLowerCase()}
          travelDestinations={travelDestinations.filter((travelDestination) =>
            travelDestination.tags.includes(tag),
          )}
          averageRatings={averageRatings}
        />
      ))}
    </>
  );
}
