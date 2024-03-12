"use client";
import { useState } from "react";
import { registerUser } from "../firebaseAPI";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Forhindrer standard form submit handling
    setError(""); // Nullstill eventuelle tidligere feilmeldinger
    try {
      await registerUser(email, password);
      router.push("/profile");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Registrer ny bruker</h2>
      <form onSubmit={handleRegister} className={styles.form}>
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
        <button type="submit" className={styles.button}>
          Registrer
        </button>
      </form>
      <h3 className={styles.subheading}>Har du bruker?</h3>
      <button
        onClick={() => router.push("/login")}
        className={styles.linkButton}
      >
        Logg inn her
      </button>
    </div>
  );
};

export default RegisterPage;
