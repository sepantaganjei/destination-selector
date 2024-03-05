import styles from "./MostPopular.module.css";

import TravelDestinationCard from "./TravelDestinationCard";
import type { TravelDestination } from "@/types/TravelDestination";

type CategoryProps = {
  name: string;
  travelDestinations: TravelDestination[];
};

const Recommended = ({ travelDestinations }: CategoryProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Basert på dine preferanser</p>
      <div className={styles.travelDestinationList}>
        {travelDestinations.map((travelDestination, i) => (
          <TravelDestinationCard
            key={i}
            travelDestination={travelDestination}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommended;
