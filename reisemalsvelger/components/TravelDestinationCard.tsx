import Link from "next/link";
import styles from "./traveldestinationcard.module.css";
import type { TravelDestination } from "@/types/TravelDestination";

type TravelDestinationCardProps = {
  travelDestination: TravelDestination;
};

const TravelDestinationCard = ({
  travelDestination,
}: TravelDestinationCardProps) => {
  return (
    <Link
      href={`/destinations/${travelDestination.id}`}
      className={styles.card}
      style={{ backgroundImage: `url(${travelDestination.imageUrl})` }}
    >
      <div className={styles.vignette}></div>
      <span className={styles.name}>{travelDestination.name}</span>
    </Link>
  );
};

export default TravelDestinationCard;
