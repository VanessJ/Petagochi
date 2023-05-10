import { useEffect, useState } from "react";
import { Pet, Species } from "../firebase";

type Mood = "happy" | "neutral" | "sad";

const usePetImage = (pet: Pet, species: Species) => {
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const calculateMood = () => {
      const { hungerLevel, happinessLevel, energyLevel } = pet;
      const averageLevel = (hungerLevel + happinessLevel + energyLevel) / 3;

      if (averageLevel < 33) {
        return "sad";
      } else if (averageLevel < 66) {
        return "neutral";
      } else {
        return "happy";
      }
    };

    const calculateAge = () => {
      const timeCreated = new Date(pet.timeCreated);
      const currentDate = new Date();
      const ageInMilliseconds = currentDate.getTime() - timeCreated.getTime();
      const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
      return ageInDays;
    };

    const mood: Mood = calculateMood();
    const age = calculateAge();
    const imagePrefix = age < 3 ? "small" : "";

    const capitalizeFirstLetter = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    const imageURLKey = `${imagePrefix}${
      imagePrefix === "small" ? capitalizeFirstLetter(mood) : mood
    }ImageURL`;

    const imageURL = species[imageURLKey];
    setImageURL(imageURL);
  }, [pet, species]);

  return imageURL;
};

export default usePetImage;