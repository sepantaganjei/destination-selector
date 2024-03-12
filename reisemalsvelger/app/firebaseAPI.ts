// DATABASE
import { db, storage, auth } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// INNLOGGING
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// BaseData er en generisk type
export interface BaseData {
  id?: string;
}

// Type for tags
export interface TagsData {
  id?: string;
  tags: {
    [key: string]: string;
  };
}

// Registrer bruker
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("Registrert bruker:", userCredential.user);

    // Definerer brukerprofilobjektet
    const userProfile = {
      reisedestinasjoner: [], // Markere reisedestinasjoner som favoritter
      theme: "light", 
    };

    // Oppretter et dokument i Firestore med uid som dokument-ID
    await setDoc(doc(db, "userProfiles", userCredential.user.uid), userProfile);

    console.log("Brukerprofil opprettet i Firestore med uid som dokument-ID");
  } catch (error) {
    console.error("Registreringsfeil:", error);
  }
};

// Henter brukerens tema fra Firestore
export const getTheme = async (userId: string): Promise<string> => {
  try {
    const docRef = doc(db, "userProfiles", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Henter brukerens tema:", docSnap.data().theme);
      return docSnap.data().theme; // Returnerer brukerens tema
    } else {
      console.log("Fant ingen brukerprofil.");
      return "light"; // Returnerer standardtema hvis ingen profil finnes
    }
  } catch (error) {
    console.error("Feil under henting av tema:", error);
    return "light"; // Returnerer standardtema ved feil
  }
};

// Setter (oppdaterer) brukerens tema i Firestore
export const setTheme = async (userId: string, theme: string): Promise<void> => {
  try {
    const docRef = doc(db, "userProfiles", userId);

    // Oppdaterer kun temaet i brukerprofilen
    await updateDoc(docRef, {
      theme: theme,
    });

    console.log("Brukerens tema oppdatert til:", theme);
  } catch (error) {
    console.error("Feil under oppdatering av tema:", error);
  }
};


// Logg inn bruker
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("Innlogget bruker:", userCredential.user);
  } catch (error) {
    console.error("Innloggingsfeil:", error);
  }
};

// Logg ut
export const logoutUser = async () => {
  try {
    await auth.signOut();
    console.log("Bruker logget ut");
  } catch (error) {
    console.error("Utloggingsfeil:", error);
  }
};

// Hent bruker-dokument fra Firestore
export const getUserProfile = async (uid: string): Promise<any> => {
  const querySnapshot = await getDocs(collection(db, "userProfiles"));
  const userProfileDoc = querySnapshot.docs.find(
    (doc) => doc.data().uid === uid,
  );
  if (userProfileDoc) {
    return { id: userProfileDoc.id, ...userProfileDoc.data() };
  } else {
    console.log("Ingen brukerprofil funnet for gitt UID");
    return null;
  }
};

// Legger til en reisedestinasjons-ID (markere reisedestinasjoner) i brukerdokumentet basert på uid
export const addDestinationToUser = async (
  uid: string,
  destinationId: string,
) => {
  const userDocRef = doc(db, "userProfiles", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const destinations = new Set(userData.reisedestinasjoner || []);
    destinations.add(destinationId); // Legger til ID, unngår duplikater

    await updateDoc(userDocRef, {
      reisedestinasjoner: Array.from(destinations),
    });
  } else {
    console.log("Brukerdokumentet finnes ikke");
  }
};

// Sletter en reisedestinasjons-ID fra brukerdokumentet basert på uid
export const removeDestinationFromUser = async (
  uid: string,
  destinationId: string,
) => {
  const userDocRef = doc(db, "userProfiles", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    let destinations = userDoc.data().reisedestinasjoner || [];
    const index = destinations.indexOf(destinationId);

    if (index > -1) {
      destinations.splice(index, 1);
      await updateDoc(userDocRef, {
        reisedestinasjoner: destinations,
      });
    }
  } else {
    console.log("Brukerdokumentet finnes ikke");
  }
};

// Funksjon for å hente alle reisedestinasjons-ID-er fra et brukerdokument basert på brukerens UID
export const getAllDestinationsFromUser = async (
  uid: string,
): Promise<string[]> => {
  try {
    // Referanse til brukerdokumentet i Firestore
    const userDocRef = doc(db, "userProfiles", uid);
    // Henter dokumentet
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Sjekker om 'reisedestinasjoner'-feltet eksisterer og returnerer det
      if (userData.reisedestinasjoner) {
        return userData.reisedestinasjoner;
      } else {
        console.log("Ingen reisedestinasjoner funnet for brukeren.");
        return [];
      }
    } else {
      console.log("Brukerdokumentet finnes ikke.");
      return [];
    }
  } catch (error) {
    console.error("Feil under henting av reisedestinasjoner:", error);
    throw error; // Kaster feilen videre for eventuell håndtering utenfor funksjonen
  }
};

// Legger til en review i brukerdokumentet
export const addReviewToUser = async (
  uid: string,
  destinationId: string,
  rating: number,
  review: string,
) => {
  const userDocRef = doc(db, "userProfiles", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    // Sjekker om det allerede finnes en review for denne reisedestinasjonen
    if (!userData.reviews[destinationId]) {
      // Oppdaterer reviews-objektet med den nye reviewen
      const newReviews = {
        ...userData.reviews,
        [destinationId]: {
          rating,
          review,
        },
      };

      await updateDoc(userDocRef, {
        reviews: newReviews,
      });
    }
  } else {
    console.log("Brukerdokumentet finnes ikke");
  }
};

// Sletter en review fra brukerdokumentet basert på uid
export const removeReviewFromUser = async (
  uid: string,
  destinationId: string,
) => {
  const userDocRef = doc(db, "userProfiles", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    if (userData.reviews && userData.reviews[destinationId]) {
      // Fjerner reviewen for den spesifikke reisedestinasjonen
      const { [destinationId]: removed, ...remainingReviews } =
        userData.reviews;
      await updateDoc(userDocRef, {
        reviews: remainingReviews,
      });
    }
  } else {
    console.log("Brukerdokumentet finnes ikke");
  }
};

// Henter alle reviews fra brukerdokumentet basert på uid
export const getAllReviewsFromUser = async (uid: string) => {
  try {
    // Referanse til brukerdokumentet i Firestore
    const userDocRef = doc(db, "userProfiles", uid);
    // Henter dokumentet
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Sjekker om 'reviews'-feltet eksisterer og returnerer det
      if (userData.reviews) {
        return userData.reviews;
      } else {
        console.log("Ingen reviews funnet for brukeren.");
        return {};
      }
    } else {
      console.log("Brukerdokumentet finnes ikke.");
      return {};
    }
  } catch (error) {
    console.error("Feil under henting av reviews:", error);
    throw error; // Kaster feilen videre for eventuell håndtering utenfor funksjonen
  }
};

// HENT DATA FRA FIRESTORE: TAGS
export const getTags = async (docId: string): Promise<string[]> => {
  const docRef = doc(db, "tags", docId); // Bytt ut "dinKolleksjon" med navnet på din kolleksjon
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Konverterer objektet til en array av verdier
    const tagsMap: Record<number, string> = docSnap.data().tag;
    return Object.values(tagsMap);
  } else {
    // Dokumentet finnes ikke
    console.log("Ingen slike dokumenter!");
    return [];
  }
};

// HENT/SEND/SLETT DATA FRA FIRESTORE: REISEDESTINASJONER
export const getData = async <T extends BaseData>(
  collectionId: string,
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionId));
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
  return data;
};

// Send ny reisedestinasjon til Firestore
export const postData = async <T extends BaseData>(
  collectionId: string,
  newData: T,
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionId), newData);
  return docRef.id; // Returnerer ID-en til det nye dokumentet
};

export const deleteData = async (
  collectionId: string,
  docId: string,
): Promise<void> => {
  await deleteDoc(doc(db, collectionId, docId));
};

// Funksjon for å laste opp et bilde og returnere URL-en til bildet
export const uploadImageAndGetURL = async (
  uploadedFile: File,
): Promise<string> => {
  const storageRef = ref(storage, `images/${uploadedFile.name}`);
  try {
    const snapshot = await uploadBytes(storageRef, uploadedFile);
    console.log("Upload complete for", uploadedFile.name);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error in uploadImageAndGetURL:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Funksjon for å slette et bilde fra Firebase Storage
export const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl);

  // Check if the image is used by any document
  const querySnapshot = await getDocs(collection(db, "reisedestinasjoner"));
  querySnapshot.forEach(async (doc) => {
    const data = doc.data();
    if (data.imageUrl === imageUrl) {
      return;
    }
  });

  // Image is not used by any document, so delete it from storage
  await deleteObject(imageRef);
};

export const getSearchResults = async (queryString: string) => {
  const modQueryString =
    queryString.charAt(0).toUpperCase() + queryString.slice(1);

  const destinationsRef = collection(db, "travelDestination");

  const q = query(
    destinationsRef,
    where("name", ">=", modQueryString),
    where("name", "<=", modQueryString + "\uf8ff"),
  );
  const querySnapshot = await getDocs(q);

  const searchResults = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return searchResults;
};
