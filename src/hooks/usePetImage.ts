import { Pet, Species, petDocument } from '../firebase';
import { setDoc } from 'firebase/firestore';

type Mood = 'happy' | 'neutral' | 'sad';

const usePetImage = (pet: Pet, species: Species, setImageURL: React.Dispatch<React.SetStateAction<string>>, setPetDeath:React.Dispatch<React.SetStateAction<boolean>>) => {

	const calculateMood = () => {
		const { hungerLevel, happinessLevel, energyLevel } = pet;
		const averageLevel = (hungerLevel + happinessLevel + energyLevel) / 3;
		if (averageLevel < 33) {
			return 'sad';
		} else if (averageLevel < 66) {
			return 'neutral';
		} else {
			return 'happy';
		}
	};

	const calculateEachLevel = () => {
		const currentDate = new Date();
		const timeLastVisit = new Date(pet.lastVisit);
		const lastVisitInMiliseconds =
			currentDate.getTime() - timeLastVisit.getTime();
		const lastVisitInHours = Math.floor(
			lastVisitInMiliseconds / (1000 * 60 * 60)
		);

		if (lastVisitInHours > 0) {
			pet.energyLevel = Math.max(pet.energyLevel - lastVisitInHours, 0);
			pet.hungerLevel =  Math.max(pet.hungerLevel - lastVisitInHours, 0);
			pet.happinessLevel =  Math.max(pet.happinessLevel - lastVisitInHours, 0);

			pet.lastVisit = currentDate;
		}

		setDoc(petDocument(pet.id), pet);
	};

	const calculateAge = () => {
		const timeCreated = new Date(pet.timeCreated);
		const currentDate = new Date();
		const ageInMilliseconds = currentDate.getTime() - timeCreated.getTime();
		const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
		return ageInDays;
	};

	calculateEachLevel();
	let imagePrefix;
	let imageURLKey;
	let imageURL;

	if (pet.hungerLevel + pet.happinessLevel + pet.energyLevel <= 0) {
		imageURLKey = `deadImageURL`;
		setPetDeath (true);
	} else {
		const mood: Mood = calculateMood();
		const age = calculateAge();
		imagePrefix = age < 3 ? 'small' : '';
		const capitalizeFirstLetter = (str: string) =>
			str.charAt(0).toUpperCase() + str.slice(1);
			imageURLKey = `${imagePrefix}${
				imagePrefix === 'small' ? capitalizeFirstLetter(mood) : mood
			}ImageURL`;

	}
	imageURL = species[imageURLKey];

	setDoc(petDocument(pet.id), pet);
	setImageURL(imageURL);
};

export default usePetImage;
