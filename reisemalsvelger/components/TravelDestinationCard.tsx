import Link from "next/link";
import styles from "./traveldestinationcard.module.css";
import type { TravelDestination } from "@/types/TravelDestination";
import { Rating } from "react-simple-star-rating";
type TravelDestinationCardProps = {
  travelDestination: TravelDestination;
  rating: number;
};

const TravelDestinationCard = ({
  travelDestination,
  rating,
}: TravelDestinationCardProps) => {
  return (
    <Link
      href={`/destinations/${travelDestination.id}`}
      className={styles.card}
      style={{ backgroundImage: `url(${travelDestination.imageUrl})` }}
    >
      <div className={styles.vignette}></div>
      <span className={styles.name}>{travelDestination.name}</span>
      {rating !== 0 && (
        <div className={styles.star}>
          <Rating
            initialValue={rating}
            size={25}
            readonly={true}
            allowFraction={true}
          />
          {rating.toFixed(1)}
        </div>
      )}
    </Link>
  );
};

export default TravelDestinationCard;
