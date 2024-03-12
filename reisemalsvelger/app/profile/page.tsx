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
  postData,
  BaseData,
  uploadImageAndGetURL,
  getTags,
} from "../../app/firebaseAPI";
import { Review } from "@/types/Review";
import { Rating } from "react-simple-star-rating";
import { setGlobal } from "next/dist/trace";
import { Preference } from "@/types/Preference";
import { TravelDestination } from "@/types/TravelDestination";

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
  const [gatherData, setGatherData] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [pinnedDestinations, setPinned] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchReviews = async () => {
    let reviewData = await getData<Review>("reviews");
    setReviews(reviewData);
    let filteredReviews = reviewData.filter(
      (review) => review.name === user?.email,
    );
    setReviews(filteredReviews);
    console.log(filteredReviews);
  };

  const fetchDestinations = async () => {
    try {
      if (user) {
        const destinationIds = await getAllDestinationsFromUser(user.uid); // Dette returnerer ID-ene
        console.log(destinationIds);
        const allDestinations =
          await getData<TravelDestination>("travelDestination"); // Henter detaljer for alle destinasjoner med riktig type

        // Filtrer ut destinasjonene brukeren har basert på ID
        const userDestinations = allDestinations
          .filter((destination) =>
            destinationIds.includes(destination.id as string),
          )
          .map((dest) => dest.name); // Mapper til kun navnene

        console.log(userDestinations);
        setDestinations(userDestinations); // Oppdaterer state med navnene på destinasjonene
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
      fetchTags();
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
        review.review,
      );
    }
  };

  const handleAddDestination = async () => {
    if (user) {
      await addDestinationToUser(user.uid, "NYER");
      fetchDestinations();
    }
  };
  const fetchTags = async () => {
    const fetchedTags = await getTags("h5tsqyxe5oB5BVM0f0St");
    setTags(fetchedTags);
    const existingPreference = await getData<Preference>("userPreference");
    let filteredPreference = existingPreference.filter(
      //Veldig dårlig kode :P
      (preference) => preference.uid === user?.email,
    );
    let filteredPrefern = filteredPreference[0];
    setSelectedTags(filteredPrefern?.tag || []);
  };
  if (loading) {
    return <p>Laster...</p>;
  }

  const handleDelete = async (id: string) => {
    await deleteData("reviews", id);
    setReviews((prev) => prev.filter((review) => review.name === user?.email));
    window.location.reload();
  };
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag); // Fjerner taggen hvis den allerede er valgt
      } else {
        return [...prev, tag]; // Legger til taggen hvis den ikke er valgt
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submit");
    try {
      const newPreference = {
        uid: user?.email || "",
        tag: selectedTags,
      };
      const existingPreference = await getData<Preference>("userPreference");
      let filteredPreference = existingPreference.filter(
        (preference) => preference.uid === user?.email,
      );
      if (filteredPreference.length > 0) {
        let filteredPrefern = filteredPreference[0];
        await deleteData("userPreference", filteredPrefern.id ?? "");
      }
      await postData<Preference>("userPreference", newPreference);
      setGatherData(true);
      window.location.reload();
    } catch (error) {
      console.error("Error adding/updating user preference: ", error);
      setGatherData(false);
    }
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
          <div>
            <h3>Mine preferanser</h3>
            <form onSubmit={handleSubmit}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => toggleTag(tag)}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    border: selectedTags.includes(tag)
                      ? "2px solid blue"
                      : "1px solid grey",
                    margin: "2px",
                  }}
                >
                  {tag}
                </span>
              ))}
              <button type="submit">Oppdater</button>
            </form>
          </div>
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
          <button onClick={handleAdmin}>Legg til destinasjon</button>
        </div>
      ) : (
        <p>Du er ikke logget inn.</p>
      )}
    </div>
  );
};

export default UserPage;
