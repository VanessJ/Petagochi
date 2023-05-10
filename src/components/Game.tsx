import { Typography, Box, Button } from "@mui/material";
import { Pet, Species } from "../firebase";
import usePetImage from "../hooks/usePetImage";


type GameProps = {
  pet: Pet;
  species: Species;
};

const Game: React.FC<GameProps> = ({ pet, species }) => {
  const imageURL = usePetImage(pet, species); 

  return (
    <>
      <Typography variant="h4" textAlign="center">
        {pet.name}
      </Typography>
      <Box
        sx={{
          border: "2px solid green",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
       <>
          <img
            src={imageURL}
            alt={pet.name}
            style={{ width: "25vw", height: "25vw", objectFit: "cover" }}
          />
          <Box sx={{ display: "flex", marginTop: "10px" }}>
            <Button variant="contained" size="small" style={{ marginRight: "5px" }}>
              Feed
            </Button>
            <Button variant="contained" size="small" style={{ marginRight: "5px" }}>
              Play
            </Button>
            <Button variant="contained" size="small">
              Sleep
            </Button>
          </Box>
        </>
      </Box>
    </>
  );
};

export default Game;