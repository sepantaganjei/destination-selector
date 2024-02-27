// DATABASE
import { db, storage, auth } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
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

    // Opprett et dokument i Firestore for den nye brukeren
    const userProfile = {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      createdAt: new Date(),
      reisedestinasjoner: [],
      anmeldelser: [],
    };
    await addDoc(collection(db, "userProfiles"), userProfile);

    console.log("Brukerprofil opprettet i Firestore");
  } catch (error) {
    console.error("Registreringsfeil:", error);
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
  const userProfileDoc = querySnapshot.docs.find(doc => doc.data().uid === uid);
  if (userProfileDoc) {
    return { id: userProfileDoc.id, ...userProfileDoc.data() };
  } else {
    console.log("Ingen brukerprofil funnet for gitt UID");
    return null;
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
