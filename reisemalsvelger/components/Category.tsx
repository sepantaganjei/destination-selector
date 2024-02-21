import styles from "./category.module.css";

import TravelDestinationCard from "./TravelDestinationCard";
import type { TravelDestination } from "@/types/TravelDestination";

type CategoryProps = {
  name: string;
  travelDestinations: TravelDestination[];
};

const Category = ({ name, travelDestinations }: CategoryProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{name}</p>
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

export default Category;
