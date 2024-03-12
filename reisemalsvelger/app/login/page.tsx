"use client";

import { useState } from "react";
import { loginUser } from "../firebaseAPI";
import { useRouter } from "next/navigation";

import styles from "./styles.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Riktig bruk av router her

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true); // Start innloggingen
    try {
      await loginUser(email, password);
      setIsLoggingIn(false); // Innlogging fullført
      router.push("/profile");
    } catch (error: any) {
      setError(error.message);
      setIsLoggingIn(false); // Feil ved innlogging
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Logg inn</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Passord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={isLoggingIn} className={styles.button}>
          {isLoggingIn ? "Logger inn..." : "Logg inn"}
        </button>
      </form>

      <h3 className={styles.subheading}>Har du ikke bruker?</h3>
      <button
        onClick={() => router.push("/register")}
        className={styles.linkButton}
      >
        Registrer deg her
      </button>
    </div>
  );
};

export default LoginPage;
