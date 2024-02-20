"use client";

import { useState } from 'react';
import { loginUser } from '../firebaseAPI';
import { useRouter } from 'next/navigation'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Riktig bruk av router her

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true); // Start innloggingen
    try {
      await loginUser(email, password);
      setIsLoggingIn(false); // Innlogging fullført
      router.push('/profile');
    } catch (error: any) {
      setError(error.message);
      setIsLoggingIn(false); // Feil ved innlogging
    }
  };

  return (
    <div>
      <h2>Logg inn</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>E-post</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Passord</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoggingIn}>{isLoggingIn ? 'Logger inn...' : 'Logg inn'}</button>
      </form>

      <h3>Ikke bruker?</h3>
      <button onClick={() => router.push('/register')}>Registrer her</button> 
    </div>
  );
};

export default LoginPage;
