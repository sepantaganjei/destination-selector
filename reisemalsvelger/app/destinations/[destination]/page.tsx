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

  const test = 2; //Only for testing purposes, should be replaced with the rating from the database

  if (travelDestination == null) {
    return <p>Laster...</p>;
  }

  return (
    <div>
      <div className={styles.mainComponent}>
        <div className={styles.destination}>
          <h1>{travelDestination.name}</h1>
          <img src={travelDestination?.imageUrl} className={styles.image} />

          <p>
            <b>Sted:</b> {travelDestination.location}
          </p>
          <p>
            <b>Tags:</b>{" "}
            {travelDestination.tags.map((tag) => (
              <span key={tag}>{tag} </span>
            ))}
          </p>
          <p>
            <b>Beskrivelse:</b> {travelDestination.description}
          </p>
        </div>
        <div className={styles.commentSection}>
          <form>
            <h2>Gi din anmeldelse</h2>
            <div className="App">
              <Rating onClick={handleRating} />
            </div>
            <textarea
              placeholder="Skriv en anmeldelse..."
              className={styles.commentInput}
            />
            <button type="submit">Legg til anmeldelse</button>
          </form>
        </div>
      </div>
      <div className={styles.showComments}>
        <h2>Anmeldelser</h2>
        <div className={styles.comment}>
          <p>
            <b>Navn:</b> Navn
          </p>
          <p>
            <b>Anmeldelse:</b> Anmeldelse
          </p>
          <p>
            <b>Rating:</b>
            <Rating
              initialValue={test} // Set the initial value from the database
              readonly={true} // Make the rating read-only
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
