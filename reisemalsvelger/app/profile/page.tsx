"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { logoutUser } from "../../app/firebaseAPI";

const UserPage = () => {
  const { user, loading } = useAuth(); // Bruk loading tilstanden
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Sjekk om ikke laster og ingen bruker
      //router.push('/');
    }
    console.log(user, loading);
  }, [user, loading, router]); // Inkluder loading i avhengighetene

  const handleLogout = async () => {
    await logoutUser();
    router.push("/"); // Omdiriger til hjemmesiden etter utlogging
  };

  if (loading) {
    return <p>Laster...</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>Brukerprofil</h1>
          <p>Velkommen, {user.email}</p>
          <button onClick={handleLogout}>Logg ut</button>
        </div>
      ) : (
        <p>Du er ikke logget inn.</p>
      )}
    </div>
  );
};

export default UserPage;
