import React, { useState, useEffect } from "react";
import styles from "./filter.module.css";
import Link from "next/link";

type Travel = {
  id: number;
  name: string;
  category: string;
  image: string;
  tags?: string[];
};

type CategoryItemProps = {
  reisedestinasjon: Travel;
};

const CategoryItem = ({ reisedestinasjon }: CategoryItemProps) => {
  return (
    <Link
      href={`/destinasjoner/${reisedestinasjon.id}`}
      className={styles.categoryItem}
      style={{ backgroundImage: `url(${reisedestinasjon.image})` }}
    >
      {reisedestinasjon.name}
    </Link>
  );
};

const Filtrer = () => {
  const reisedestinasjoner: Travel[] = [
    {
      id: 0,
      name: "Oslo",
      category: "historisk",
      image:
        "https://res.cloudinary.com/simpleview/image/upload/v1634555140/clients/norway/Oslo_operahus_2_447c01a6-7d1c-4cd6-a87a-0c38e552a893.jpg",
    },
    {
      id: 1,
      name: "Trondheim",
      category: "historisk",
      image:
        "https://a.cdn-hotels.com/gdcs/production112/d840/aae794d3-c510-4a77-a2a4-063f914565e5.jpg?impolicy=fcrop&w=800&h=533&q=medium",
    },
    {
      id: 2,
      name: "Bergen",
      category: "historisk",
      image:
        "https://www.fjordtours.com/media/old/1178/bryggen-girish-chouhan-visitbergen_com.jpg",
    },
    {
      id: 3,
      name: "Ålesund",
      category: "nei",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/71/Vista_de_%C3%85lesund_desde_Aksla%2C_Noruega%2C_2019-09-01%2C_DD_16.jpg",
    },
    {
      id: 4,
      name: "Gjøvik",
      category: "historisk",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/c/c1/Gj%C3%B8vik_sentrum_sett_fra_Hovdetoppen.JPG",
    },
    {
      id: 5,
      name: "Stavanger",
      category: "historisk",
      image:
        "https://www.stavanger.kommune.no/siteassets/om-kommunen/stavanger.jpg?width=1024&height=1024&transform=DownFit&h=812b1482ab039b1981e34f5c7b2302237fb2baaa",
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedTag, setSelectedTag] = useState("0");
  const [filteredDestinations, setFilteredDestinations] =
    useState<Travel[]>(reisedestinasjoner);
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = reisedestinasjoner;

    if (selectedCategory !== "0") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory);
    }

    if (selectedTag !== "0") {
      filtered = filtered.filter((dest) => dest.tags?.includes(selectedTag));
    }

    setFilteredDestinations(filtered);
  };

  return (
    <div>
      <div className={styles.container}>
        <header className={styles.header}>Alle destinasjoner</header>
        <div>
          <form className={styles.form} onSubmit={handleFilter}>
            <select
              className={styles.pulldown}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="0">Velg kategori</option>
              <option value="historisk">Historisk</option>
              <option value="Kultur">Kultur</option>
              <option value="Natur">Natur</option>
              <option value="Aktiviteter">Aktiviteter</option>
            </select>
            <select
              className={styles.pulldown}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="0">Velg Tag</option>
              <option value="">Skiheis</option>
              <option value="2">Kultur</option>
              <option value="3">Natur</option>
              <option value="4">Aktiviteter</option>
            </select>
            <button className={styles.button}>Filtrer</button>
          </form>
        </div>
      </div>
      <div className={styles.categoryList}>
        {filteredDestinations.map((reisedestinasjon, i) => (
          <CategoryItem key={i} reisedestinasjon={reisedestinasjon} />
        ))}
      </div>
    </div>
  );
};
export default Filtrer;
