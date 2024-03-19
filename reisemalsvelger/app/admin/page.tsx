"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from './styles.module.css';

import {
  BaseData,
  postData,
  getData,
  deleteData,
  uploadImageAndGetURL,
  deleteImage,
  getTags,
} from "../firebaseAPI";
import { useAuth } from "../../context/authContext";
import { TravelDestination } from "@/types/TravelDestination";

// Definerer interfacet for TravelDestination

const AdminPage = () => {
  const { user, loading } = useAuth();
  // admin mail: admin@fjellogfjord.com
  // password: admin123

  // test mail: test@fjellogfjord.com
  // password: test123

  const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID || "";

  const [gatherData, setGatherData] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [destination, setDestination] = useState<TravelDestination>({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    tags: [],
  });
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Hvis man ikke er admin

  // Oppdaterer tilstanden basert på endringer i input-feltene
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDestination((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag); // Fjerner taggen hvis den allerede er valgt
      } else {
        return [...prev, tag]; // Legger til taggen hvis den ikke er valgt
      }
    });
  };

  // Håndterer innsending av skjema
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const imageUrl = selectedFile
        ? await uploadImageAndGetURL(selectedFile)
        : "";
      const newDestination = { ...destination, imageUrl, tags: selectedTags }; // Bruker selectedTags for tags
      const docId = await postData<TravelDestination>(
        "travelDestination",
        newDestination,
      );
      console.log(`Ny destinasjon lagt til med ID: ${docId}`);
      setDestination({
        name: "",
        location: "",
        description: "",
        imageUrl: "",
        tags: [],
      });
      setSelectedTags([]); // Nullstiller valgte tags
      setSelectedFile(null);
      setGatherData(true);
    } catch (error) {
      console.error("Error adding document or uploading image: ", error);
      setGatherData(false);
    }
  };

  const fetchTags = async () => {
    const fetchedTags = await getTags("h5tsqyxe5oB5BVM0f0St");
    setTags(fetchedTags);
  };

  const fetchDestinations = async () => {
    if (user && user.uid === ADMIN_UID) {
      const data = await getData<TravelDestination>("travelDestination");
      setDestinations(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (user && user.uid === ADMIN_UID) {
      await deleteData("travelDestination", id);
      await deleteImage(
        destinations.find((destination) => destination.id === id)?.imageUrl ||
          "",
      );
      setDestinations((prev) =>
        prev.filter((destination) => destination.id !== id),
      );
    }
  };

  // Hent reisemål fra databasen første gang siden lastes
  useEffect(() => {
    fetchTags();
    fetchDestinations();
  }, [loading]);

  // Hent reisemål fra databasen etter at et nytt reisemål er lagt til
  useEffect(() => {
    if (gatherData == true) {
      fetchDestinations();
    }
    setGatherData(false);
  }, [gatherData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setSelectedFileName(file.name); // Her henter vi filnavnet fra den valgte filen
    } else {
      setSelectedFileName(""); // Nullstill filnavnet hvis ingen fil er valgt
    }
  };
  
  return (
    <>
      <h1>Legg til reisedestinasjoner</h1>
      <form onSubmit={handleSubmit}>
      <ol>
        <li>
          <input
            type="text"
            name="name"
            value={destination.name}
            className={styles.inputField}
            onChange={handleChange}
            placeholder="Navn på reisemål"
            required
          />
        </li>
        <li>
          <input
            type="text"
            name="location"
            value={destination.location}
            className={styles.inputField}
            onChange={handleChange}
            placeholder="Sted"
            required
          />
        </li>
        <li>
          <input
            type="text"
            name="description"
            value={destination.description || ""}
            className={styles.inputField}
            onChange={handleChange}
            placeholder="Beskrivelse (valgfritt)"
          />
        </li>
        <li>
          <p>Velg tags:</p>
          <div className={styles.tagsContainer}>
            <div className={styles.tagsBox}>
              {tags.map((tag, index) => (
                <span
                key={index}
                onClick={() => toggleTag(tag)}
                className={styles.tag}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  border: selectedTags.includes(tag)
                  ? "2px solid blue"
                  : "1px solid grey",
                  margin: "2px",
                }}
                >
                {tag}
                </span>
              ))}
            </div>
          </div>
        </li>
        <li>
          <label htmlFor="fileUpload" className={styles.fileInputLabel}>Last opp bilde</label>
          <input
            type="file"
            id="fileUpload"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {selectedFileName && <p className={styles.fileInfo}>Valgt bilde: {selectedFileName}</p>}
        </li>
          <button className={styles.submitButton} type="submit">Last opp reisemål</button>
        </ol>
      </form>
      <div className={styles.destinationContainer}>
        {destinations.map((dest) => (
          <div key={dest.id}>
            <img
              style={{ width: "800px" }}
              src={dest.imageUrl}
              alt={dest.name}
            />
            <h3>NAVN: {dest.name}</h3>
            <p>LOKASJON: {dest.location}</p>
            <p>BESKRIVELSE: {dest.description}</p>
            <p>
              TAGS:{" "}
              {dest.tags &&
                dest.tags.map((tag, index) => (
                  <span key={tag} className={styles.tag}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    border: selectedTags.includes(tag)
                      ? "2px solid blue"
                      : "1px solid grey",
                    margin: "2px",
                  }}>
                    {tag}
                    {index < dest.tags.length - 1 ? "" : ""}
                  </span>
                ))}
            </p>
            <button className={styles.deleteButton} onClick={() => dest.id && handleDelete(dest.id)}>
              Slett
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminPage;
