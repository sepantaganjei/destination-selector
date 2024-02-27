"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { logoutUser } from "../../app/firebaseAPI";

const UserPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID || "";

  useEffect(() => {
    if (!loading) {
      const isNotLoggedIn = !user;

      if (isNotLoggedIn) {
        console.log(user, loading);
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/"); // Omdiriger til hjemmesiden etter utlogging
  };

  const handleAdmin = async () => {
    router.push("/admin");
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
          {user?.uid === ADMIN_UID && (
            <button onClick={handleAdmin}>
              Administrer reisedestinasjoner
            </button>
          )}
          <button onClick={handleLogout}>Logg ut</button>
        </div>
      ) : (
        <p>Du er ikke logget inn.</p>
      )}
    </div>
  );
};

export default UserPage;
