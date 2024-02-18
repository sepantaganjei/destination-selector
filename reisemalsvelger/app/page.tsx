import Image from "next/image";
import styles from "./page.module.css";
import HomeBanner from "@/components/HomeBanner";
import Category from "@/components/Category";
import SearchNavbar from "@/components/SearchNavbar";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner />
      <SearchNavbar />
      <Category />
    </main>
  );
}
