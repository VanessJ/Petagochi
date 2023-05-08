import { getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Species, petsCollection } from '../firebase';
import { Typography } from '@mui/material';
import EggPreview from './EggPreview';

const EggsGrid = () => {
  const [pets, setPets] = useState<Species[]>([]);
  const [selectedPet, setSelectedPet] = useState<Species | null>(null);


  useEffect(() => {
    const fetchPets = async () => {
      try {
        const querySnapshot = await getDocs(petsCollection);
        const petsData: Species[] = [];
        querySnapshot.forEach((doc) => {
          petsData.push({ id: doc.id, ...doc.data() } as Species);
        });
        setPets(petsData);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, []);

  const handleGridItemClick = (pet: Species) => {
    setSelectedPet(pet);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
  };


  return (
    <div style={{ position: 'relative', marginBottom: '50px' }}>
       {!selectedPet && (
        <Typography variant="h4" align="center">
          Choose an egg
        </Typography>
      )}
      {selectedPet && <EggPreview pet={selectedPet} onClose={handleCloseModal}/>}
      <br />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', overflow: 'auto' }}>
        {pets.map((pet) => (
          <div
            key={pet.id}
            style={{
              border: selectedPet === pet ? '1px solid green' : '1px solid black',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleGridItemClick(pet)}
          >
            <img src={pet.eggImageURL} alt={pet.name} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EggsGrid;