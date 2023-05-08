import { Box, Typography } from "@mui/material";
import useLoggedInUser from "../hooks/useLoggedInUser";
import usePageTitle from "../hooks/usePageTitle";

import { useEffect, useState } from "react";
import { petsCollection } from "../firebase";
import { getDocs, query, where } from "firebase/firestore";
import EggsGrid from "../components/EggGrid";


const Home = () => {
  usePageTitle("Home");
  
  const user = useLoggedInUser();
  const [hasPets, setHasPets] = useState(false);
  const [petNames, setPetNames] = useState<string[]>([]);

  useEffect(() => {
    const checkIfUserHasPets = async () => {
      try {
        const q = query(petsCollection, where("ownerUid", "==", user?.uid));
        const petsQuerySnapshot = await getDocs(q);

        if (!petsQuerySnapshot.empty) {
          const petNamesArray = petsQuerySnapshot.docs.map((doc) => doc.data().name);
          setPetNames(petNamesArray);
          setHasPets(true);
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
  }, [user]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h1" fontWeight="bolder">
          Llamagochi
        </Typography>
      </Box>
      {user?.email ? (
        <>
          <Typography variant="h4" textAlign="center">
            Welcome, {user.email}!
          </Typography>
          {hasPets ? (
            <>
              <Typography variant="h4" textAlign="center">
                You have a pet:
              </Typography>
              <ul>
                {petNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
			  <Typography variant="h4" textAlign="center">
                If you want to actually interact with this pet, code the rest of the app.
              </Typography>
            </>
          ) : (
            <EggsGrid />
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