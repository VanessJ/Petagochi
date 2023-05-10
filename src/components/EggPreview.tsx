import { useState } from "react";
import { Pet, Species, petsCollection } from "../firebase";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { addDoc } from "firebase/firestore";

type EggPreviewProps = {
  pet: Species;
  onClose: () => void;
  onSelect: () => void;
};

const EggPreview: React.FC<EggPreviewProps> = ({ pet, onClose, onSelect }) => {

  const user = useLoggedInUser();
  const [name, setName] = useState<string>("");

  const isNameEmpty = name.trim() === "";
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveName = async () => {
    if (!isNameEmpty) {
      try {
        const newPet: Pet = {
          name: name,
          speciesUid: pet.id,
          ownerUid: user!.uid,
          timeCreated: new Date(),
          lastVisit: new Date(),
          hungerLevel: 50,
          happinessLevel: 50,
          energyLevel: 50,
        };

        await addDoc(petsCollection, newPet);
        toast.success("Pet successfully adopted");
        onClose();
        onSelect();

      } catch (error) {
        toast.error(`Error adopting pet: ${error}`);
      }
    }
  };
  
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <img
        src={pet.eggImageURL}
        alt={pet.name}
        style={{ width: '25vw', height: '25vw', objectFit: 'cover' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <TextField
        label="Name your pet"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter pet name"
        style={{ marginRight: '10px' }}
        />
        <button style={{ padding: '5px 10px', cursor: 'pointer' }} onClick={handleSaveName} disabled={isNameEmpty}>
          Adopt pet
        </button>
      </div>
      <button style={{ marginTop: '10px' }} onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default EggPreview;