"use client";
import { getData, postData, deleteData } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";
import { TravelDestination } from "@/types/TravelDestination";
import { Review } from "@/types/Review";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { Rating } from "react-simple-star-rating";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { Pinned } from "@/types/Pinned";

const DestinationPage = ({ params }: any) => {
  const { destination } = params;
  const { user, loading } = useAuth(); // Bruk loading tilstanden
  const [gatherData, setGatherData] = useState<boolean>(false);
  const [travelDestination, setTravelDestination] =
    useState<TravelDestination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const textfieldref = useRef<HTMLTextAreaElement>(null);
  const [showNewIcon, setNewIcon] = useState<boolean>(false);

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
  const checkIfPinned = async () => {
    if (!user) {
      setNewIcon(false);
      return;
    }

    try {
      const pinnedItems = await getData<Pinned>("pinned");
      const pinnedDestinations = pinnedItems.map((pinned) => pinned.destinationId);
      const destinationIds = [destination];

      destinationIds.forEach(destId => {
        if (pinnedDestinations.includes(destId)) {
          setNewIcon(true);
        } else {
          setNewIcon(false);
        }
      });
    } catch (error) {
      console.log("Error checking if destination is pinned:", error);
    }
  };

  const Pinned = async () => {
    if (!user) {
      console.log("User is not logged in");
      return;
    }
    
    const pinnedItems = await getData<userProfiles>("reisedestinasjoner");
    const isDestinationPinned = pinnedItems.some(
      (pinned) => pinned.destinationId === destination,
    );

    try {
      if (!isDestinationPinned) {
        const newPinned: Pinned = {
          name: user.email,
          destinationId: destination,
          destinationName: travelDestination.name,
        };
        const docId = await postData<Pinned>("pinned", newPinned);
        setNewIcon(true);
      } else {
        const pinnedItemId = pinnedItems.find(
          (pinned) => pinned.destinationId === destination,
        )?.id;
        if (pinnedItemId) {
          await deleteData("pinned", pinnedItemId);
          setNewIcon(false);
        }
      }
      checkIfPinned(); 
    } catch (error) {
      console.log("Error pinning destination:", error);
    }
  };

  const fetchReviews = async () => {
    let reviewData = await getData<Review>("reviews");
    setReviews(reviewData);
    let filteredReviews = reviewData.filter(
      (review) => review.destinationId === destination,
    );
    setReviews(filteredReviews);
    console.log(filteredReviews);
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
    checkIfPinned();
  }, [user]);

  if (travelDestination == null) {
    return <p>Laster...</p>;
  }
  // Håndterer innsending av skjema
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (user == null) {
        throw new Error("User not logged in");
      }
      const newReview = {
        name: user.email || "",
        description: description,
        rating: rating,
        destinationId: destination,
        destinationName: travelDestination.name,
      };
      const docId = await postData<Review>("reviews", newReview);
      setRating(0); //Resetter ikke det bruker ser tho
      setDescription("");
      setGatherData(true);
      window.location.reload(); // Oppdaterer siden
      if (textfieldref.current) {
        textfieldref.current.value = "";
      }
    } catch (error) {
      console.error("Error adding review: ", error);
      setGatherData(false);
    }
  };
  //Oppdaterer tilstanden basert på endringer i textarea-feltet
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  return (
    <div>
      <div className={styles.mainComponent}>
        <div className={styles.destination}>
          <div className={styles.mark}>
            <h1>{travelDestination.name}</h1>
            <button onClick={Pinned(user?.email)} className={styles.pin}>
              {showNewIcon ? (
                <BsPinAngleFill className={styles.icon} />
              ) : (
                <BsPinAngle className={styles.icon} />
              )}
            </button>
          </div>
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
              <Rating onClick={handleRating} transition />
            </div>
            <textarea
              placeholder="Skriv en anmeldelse..."
              className={styles.commentInput}
              name="description"
              required
              ref={textfieldref}
              onChange={handleChange}
            />
            <button type="submit">Legg til anmeldelse</button>
          </form>
        </div>
      </div>
      <div className={styles.showComments}>
        <h2>Anmeldelser</h2>
        {reviews.length === 0 ? (
          <p>{travelDestination.name} har ingen anmeldelser</p>
        ) : (
          reviews.map((review) => (
            <div className={styles.comment} key={review.id}>
              <p>
                <b>Bruker:</b> {review.name}
              </p>
              <p>
                <b></b> {review.description}
              </p>
              <p>
                <b></b>
                <Rating initialValue={review.rating} readonly={true} />
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DestinationPage;
