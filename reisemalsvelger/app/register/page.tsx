"use client";
import { useState } from "react";
import { registerUser } from "../firebaseAPI";
import { useRouter } from "next/navigation";

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
    <div>
      <h2>Registrer ny bruker</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Passord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Registrer</button>
      </form>
      <h3>Har du bruker?</h3>
      <button onClick={() => router.push("/create")}>Logg inn her</button>
    </div>
  );
};

export default RegisterPage;
