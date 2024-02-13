import React from 'react';
import styles from "./page.module.css";
import Filtrer  from './_components/filter';

export default function Home() {
        return (
            <main className={styles.main}>
                <Filtrer/>
            </main>
        )
    }
