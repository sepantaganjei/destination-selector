import React from 'react';
import styles from "./page.module.css";

import Filtrer  from './components/filter'; // Import the 'Alldestination' component as a named export

export default function Home() {
        return (
            <main className={styles.main}>
                <Filtrer/>
            </main>
        );
    }
