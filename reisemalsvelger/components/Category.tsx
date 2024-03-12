import styles from "./category.module.css";

import TravelDestinationCard from "./TravelDestinationCard";
import type { TravelDestination } from "@/types/TravelDestination";
const allowedCategoryNames = ["Fjell", "Fjord", "Storby"];
type CategoryProps = {
  name: string;
  travelDestinations: TravelDestination[];
  averageRatings: Record<string, number>;
};

const Category = ({
  name,
  travelDestinations,
  averageRatings,
}: CategoryProps) => {
  if (!allowedCategoryNames.includes(name)) {
    console.error(`Invalid category name: ${name}`);
    return null;
  }
  return (
    <div className={styles.container}>
      <p className={styles.title}>{name}</p>
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

export default Category;
