"use client";
import { getData } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";
import { TravelDestination } from "@/types/TravelDestination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Rating } from "react-simple-star-rating";

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
  // Rating
  const [rating, setRating] = useState(0);
  const handleRating = (rate: number) => {
    setRating(rate);
    console.log(rate);
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
    <div className={styles.mainComponent}>
      <div className={styles.destination}>
        <h1>{travelDestination.name}</h1>
        <img src={travelDestination?.imageUrl} className={styles.image} />
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
      <div className={styles.commentSection}>
        <form>
          <h2>Gi din vurderings</h2>
          <div className="App">
            <Rating onClick={handleRating} />
          </div>
          <textarea
            placeholder="Skriv en kommentar"
            className={styles.commentInput}
          />
          <button>Legg til kommentar</button>
        </form>
      </div>
    </div>
  );
};

export default DestinationPage;
