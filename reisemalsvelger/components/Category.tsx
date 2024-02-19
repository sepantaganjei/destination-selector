import Link from "next/link";
import styles from "./category.module.css";

type Travel = {
  id: number;
  name: string;
  category: string;
  image: string;
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

const Category = () => {
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
      category: "historisk",
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

  return (
    <>
      <p>Historisk</p>
      <div className={styles.categoryList}>
        {reisedestinasjoner.map((reisedestinasjon, i) => (
          <CategoryItem key={i} reisedestinasjon={reisedestinasjon} />
        ))}
      </div>
    </>
  );
};

export default Category;
