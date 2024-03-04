"use client";
import { getData, postData } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";
import { TravelDestination } from "@/types/TravelDestination";
import { Review } from "@/types/Review";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Rating } from "react-simple-star-rating";

const DestinationPage = ({ params }: any) => {
  const { destination } = params;
  const { user, loading } = useAuth(); // Bruk loading tilstanden
  const [gatherData, setGatherData] = useState<boolean>(false);
  const [travelDestination, setTravelDestination] =
    useState<TravelDestination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [description, setDescription] = useState<string>("");
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

  const fetchReviews = async () => {
    let reviewData = await getData<Review>("reviews");
    setReviews(reviewData);
    // let filteredReviews = reviewData.filter(
    //   (review) => review.destinationId === destination
    // );
    // setReviews(filteredReviews);
    // console.log(filteredReviews);
  };

  // Rating
  const [rating, setRating] = useState(0);
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  useEffect(() => {
    if (!loading && !user) {
      // Sjekk om ikke laster og ingen bruker
      router.push("/login");
    }
    fetchDestinations();
    fetchReviews();
  }, []);

  if (travelDestination == null) {
    return <p>Laster...</p>;
  }
  // Håndterer innsending av skjema
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newReview = {
        name: "test", //legge til denne funksjonaliteten
        description: description,
        rating: rating,
        destinationId: destination,
      };
      const docId = await postData<Review>("reviews", newReview);
      setRating(0);
      setDescription("");
      setGatherData(true);
      event.currentTarget.reset();
    } catch (error) {
      console.error("Error adding review: ", error);
      setGatherData(false);
    }
    setRating(0);
    setDescription("");
  };
  //Oppdaterer tilstanden basert på endringer i textarea-feltet
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
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
          <form onSubmit={handleSubmit}>
            <h2>Gi din anmeldelse</h2>
            <div className="App">
              <Rating onClick={handleRating} />
            </div>
            <textarea
              placeholder="Skriv en anmeldelse..."
              className={styles.commentInput}
              name="description"
              required
              onChange={handleChange}
            />
            <button type="submit">Legg til anmeldelse</button>
          </form>
        </div>
      </div>
      <div className={styles.showComments}>
        <h2>Anmeldelser</h2>
        {reviews.map((review) => (
          <div className={styles.comment} key={review.id}>
            <p>
              <b>Navn:</b> {review.name}
            </p>
            <p>
              <b>Anmeldelse:</b> {review.description}
            </p>
            <p>
              <b>Rating:</b>
              <Rating initialValue={review.rating} readonly={true} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationPage;
