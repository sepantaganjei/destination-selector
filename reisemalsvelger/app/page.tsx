import Image from "next/image";
import styles from "./page.module.css";
import HomeBanner from "@/components/HomeBanner";
import Category from "@/components/Category";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner />
      <Category />
      <Navbar />
    </main>
  );
}
