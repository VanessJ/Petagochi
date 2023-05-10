import { Box, Typography } from "@mui/material";
import useLoggedInUser from "../hooks/useLoggedInUser";
import usePageTitle from "../hooks/usePageTitle";

import { useEffect, useState } from "react";
import { Pet, Species, petConverter, petsCollection, speciesDocument } from "../firebase";
import { getDoc, getDocs, query, where } from "firebase/firestore";
import EggsGrid from "../components/EggGrid";
import Game from "../components/Game";


const Home = () => {
	usePageTitle("Home");
	
	const user = useLoggedInUser();
	const [reload, setReload] = useState(false);
	const [hasPets, setHasPets] = useState(false);
	const [pet, setPet] = useState<Pet | null>(null);
	const [species, setSpecies] = useState<Species | null>(null);

	const handleSelect = () => {
		setReload(true);
	  };
  
	  useEffect(() => {
		const checkIfUserHasPets = async () => {
		  try {
			const q = query(petsCollection, where("ownerUid", "==", user?.uid)).withConverter(petConverter);
			const petsQuerySnapshot = await getDocs(q);
	
			if (!petsQuerySnapshot.empty) {
			  const firstPetDoc = petsQuerySnapshot.docs[0];
			  const pet = firstPetDoc.data() as Pet;
			  setPet(pet);
	
			  // Fetch the species based on pet's speciesUid
			  const speciesDocSnap = await getDoc(speciesDocument(pet.speciesUid));
	
			  if (speciesDocSnap.exists()) {
				const speciesData = speciesDocSnap.data() as Species;
				setSpecies(speciesData);
				setHasPets(true);
			  }
			} else {
			  setHasPets(false);
			}
		  } catch (error) {
			console.error("Error checking user's pets:", error);
		  }
		};
  
	  if (user) {
		checkIfUserHasPets();
	  }
	}, [user, reload]); 
  
	return (
	  <>
		<Box sx={{ display: "flex", alignItems: "center" }}>
		  <Typography variant="h1" fontWeight="bolder">
			Llamagochi
		  </Typography>
		</Box>
		{user?.email ? (
		  <>
			{hasPets ? (
			  <>
				<Game pet={pet!} species={species!} />
			  </>
			) : (
			  <EggsGrid onSelect={handleSelect} />
			)}
		  </>
		) : (
		  <Typography variant="h4" textAlign="center">
			Log in to access features
		  </Typography>
		)}
	  </>
	);
  };
  
  export default Home;
  
  
  
  