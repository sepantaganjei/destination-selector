"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import {
  logoutUser,
  addReviewToUser,
  getAllReviewsFromUser,
  addDestinationToUser,
  getAllDestinationsFromUser,
  removeReviewFromUser,
  getData,
  deleteData,
} from "../../app/firebaseAPI";
import { Review } from "@/types/Review";
import { Rating } from "react-simple-star-rating";

interface ReviewDetails {
  rating: number;
  review: string;
}
interface Reviews {
  [destinationId: string]: ReviewDetails;
}

const UserPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID || "";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  const fetchReviews = async () => {
    let reviewData = await getData<Review>("reviews");
    setReviews(reviewData);
    let filteredReviews = reviewData.filter(
      (review) => review.name === user?.email
    );
    setReviews(filteredReviews);
    console.log(filteredReviews);
  };

  const fetchDestinations = async () => {
    try {
      if (user) {
        const userDestinations = await getAllDestinationsFromUser(user.uid);
        console.log(userDestinations);
        setDestinations(userDestinations);
      }
    } catch (error) {
      console.error("Feil ved henting av destinasjoner:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      const isNotLoggedIn = !user;
      fetchDestinations();
      fetchReviews();
      if (isNotLoggedIn) {
        console.log(user, loading);
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const handleAdmin = async () => {
    router.push("/admin");
  };

  const handleAddReview = async () => {
    const review = {
      rating: 5,
      review: "Veldig fint sted",
    };
    if (user) {
      await addReviewToUser(
        user.uid,
        "destinasjon-1",
        review.rating,
        review.review
      );
    }
  };

  const handleAddDestination = async () => {
    if (user) {
      await addDestinationToUser(user.uid, "NYER");
      fetchDestinations();
    }
  };

  if (loading) {
    return <p>Laster...</p>;
  }

  const handleDelete = async (id: string) => {
    await deleteData("reviews", id);
    setReviews((prev) => prev.filter((review) => review.name === user?.email));
    window.location.reload();
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Brukerprofil</h1>
          <p>Velkommen, {user.email}</p>
          {user?.uid === ADMIN_UID && (
            <button onClick={handleAdmin}>
              Administrer reisedestinasjoner
            </button>
          )}
          <h3>Brukeranmeldelser:</h3>
          <div>
            {Object.keys(reviews).length > 0 ? (
              Object.entries(reviews).map(([destinationId, reviewDetails]) => (
                <div key={destinationId}>
                  <h4>Destinasjon: {reviewDetails.destinationName}</h4>
                  <p>
                    Rating:{" "}
                    <Rating
                      initialValue={reviewDetails.rating}
                      readonly={true}
                    />
                  </p>
                  <p>Anmeldelse: {reviewDetails.description}</p>
                  <button
                    onClick={() =>
                      reviewDetails.id && handleDelete(reviewDetails.id)
                    }
                  >
                    Fjern anmeldelse
                  </button>
                </div>
              ))
            ) : (
              <p>Ingen reviews funnet.</p>
            )}
          </div>
          <div>
            <h2>Destinasjoner</h2>
            {destinations.length > 0 ? (
              <ul>
                {destinations.map((destination, index) => (
                  <li key={index}>{destination}</li>
                ))}
              </ul>
            ) : (
              <p>Ingen destinasjoner funnet.</p>
            )}
          </div>
          <button onClick={handleLogout}>Logg ut</button>
          <button onClick={handleAddDestination}>Legg til destinasjon</button>
        </div>
      ) : (
        <p>Du er ikke logget inn.</p>
      )}
    </div>
  );
};

export default UserPage;
