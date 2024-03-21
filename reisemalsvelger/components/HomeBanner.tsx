import { TravelDestination } from "@/types/TravelDestination";
import styles from "./homebanner.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "./Button";

type CategoryProps = {
  name: string;
  travelDestination: TravelDestination;
};

const HomeBanner = ({ travelDestination }: CategoryProps) => {
  const [randomDestination, setRandomDestination] =
    useState<TravelDestination | null>(null);

  useEffect(() => {
    setRandomDestination(travelDestination);
  }, [travelDestination]);

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h1>Finn din drømmereise</h1>
        <p>Utforsk skjulte perler og populære destinasjoner fra nord til sør</p>
        {travelDestination && (
          <Link href={`/destinations/${travelDestination?.id}`}>
            <Button important>Prøv lykken</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;
