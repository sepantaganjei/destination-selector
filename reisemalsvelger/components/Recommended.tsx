import styles from "./MostPopular.module.css";

import TravelDestinationCard from "./TravelDestinationCard";
import type { TravelDestination } from "@/types/TravelDestination";

type CategoryProps = {
  name: string;
  travelDestinations: TravelDestination[];
  averageRatings: Record<string, number>;
};

const Recommended = ({ travelDestinations, averageRatings }: CategoryProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Basert på dine preferanser</p>
      <div className={styles.travelDestinationList}>
        {travelDestinations.map((travelDestination, i) => (
          <TravelDestinationCard
            key={i}
            travelDestination={travelDestination}
            rating={averageRatings[travelDestination.id] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommended;
