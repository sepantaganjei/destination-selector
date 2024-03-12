"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../app/firebaseConfig"; // Importer auth fra din Firebase-konfigurasjon
import { onAuthStateChanged, User } from "firebase/auth";
import { getTheme } from "@/app/firebaseAPI";
import { useTheme } from "./theme";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed: ", user); // Legg til denne for å logge brukerobjektet
      setUser(user);
      setLoading(false);
      if (!loading && user) {
        getTheme(user!.uid).then((theme) => {
          setTheme(theme);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
