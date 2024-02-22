"use client";
import { getData } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";
import { TravelDestination } from "@/types/TravelDestination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DestinationPage = ({ params }: any) => {
  const { destination } = params;
  const { user, loading } = useAuth(); // Bruk loading tilstanden

  const [travelDestination, setTravelDestination] =
    useState<TravelDestination | null>(null);
  const router = useRouter();

  const fetchDestinations = async () => {
    let data = await getData<TravelDestination>("travelDestination");
    data = data
      .map((travelDestination) => ({
        ...travelDestination,
        tags: travelDestination.tags.map((tag) => tag.toLowerCase()),
      }))
      .filter((data) => data.id == destination);
    setTravelDestination(data[0]);
  };

  useEffect(() => {
    if (!loading && !user) {
      // Sjekk om ikke laster og ingen bruker
      router.push("/login");
    }
    fetchDestinations();
  }, []);

  if (travelDestination == null) {
    return <p>Laster...</p>;
  }

  return (
    <div>
      <h1>{travelDestination.name}</h1>
      <img src={travelDestination?.imageUrl} />
      <p>
        <b>Beskrivelse:</b> {travelDestination.description}
      </p>
      <p>
        <b>Sted:</b> {travelDestination.location}
      </p>
      <p>
        <b>Tags:</b>{" "}
        {travelDestination.tags.map((tag) => (
          <span key={tag}>{tag} </span>
        ))}
      </p>
    </div>
  );
};

export default DestinationPage;
