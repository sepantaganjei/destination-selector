"use client";
import { getData } from "@/app/firebaseAPI";
import { useAuth } from "@/context/authContext";
import { TravelDestination } from "@/types/TravelDestination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPinAngle } from "react-icons/bs";
import styles from "./styles.module.css";
import { BsPinAngleFill } from "react-icons/bs";




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

  const pinDestination = () => {
    
  };


  return (
    <div>
      <div className={styles.mark}> {

      }
      <h1>{travelDestination.name}</h1>
      <button onClick= {pinDestination} id = {styles.pin}> 
        <BsPinAngle id = {styles.icon} />
        <p> 

        </p>
      </button> 
      </div>

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
