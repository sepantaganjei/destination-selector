"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Button from "@/components/Button";

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
  }, []);

  // Hent reisemål fra databasen etter at et nytt reisemål er lagt til
  useEffect(() => {
    if (gatherData == true) {
      fetchDestinations();
    }
    setGatherData(false);
  }, [gatherData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={destination.name}
          onChange={handleChange}
          placeholder="Navn på reisemål"
          required
        />
        <input
          type="text"
          name="location"
          value={destination.location}
          onChange={handleChange}
          placeholder="Sted"
          required
        />
        <input
          type="text"
          name="description"
          value={destination.description || ""}
          onChange={handleChange}
          placeholder="Beskrivelse (valgfritt)"
        />
        {tags.map((tag, index) => (
          <span
            key={index}
            onClick={() => toggleTag(tag)}
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
        <input type="file" onChange={handleImageChange} />
        <Button important submit>Last opp reisemål</Button>
      </form>
      <div>
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
                  <span key={tag}>
                    {tag}
                    {index < dest.tags.length - 1 ? ", " : ""}
                  </span>
                ))}
            </p>
            <button onClick={() => dest.id && handleDelete(dest.id)}>
              Slett
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminPage;
