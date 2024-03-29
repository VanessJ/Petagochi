import { getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Species, speciesCollection } from '../firebase';
import PetPreview from './PetPreview';

const PetsGrid = () => {
    const [pets, setPets] = useState<Species[]>([]);
    const [selectedPet, setSelectedPet] = useState<Species | null>(null);
    const [updateKey, setUpdateKey] = useState<number>(0); // State for forcing update - TODO: better way to do this?
  
    useEffect(() => {
      const fetchPets = async () => {
        try {
          const querySnapshot = await getDocs(speciesCollection);
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
    }, [updateKey]);
  
    const handleGridItemClick = (pet: Species) => {
      setSelectedPet(pet);
    };
  
    const handleCloseModal = () => {
      setSelectedPet(null);
    };
  
    const handlePetUpdate = () => {
      // Increment the updateKey value to force update - TODO: better way to do this?
      setUpdateKey((prevKey) => prevKey + 1);
    };
  
    return (
      <div style={{ position: 'relative', marginBottom: '50px' }}>
        {selectedPet && <PetPreview pet={selectedPet} onClose={handleCloseModal} onPetUpdate={handlePetUpdate} />}
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
              <img src={pet.neutralImageURL} alt={pet.name} style={{ width: '100%', height: 'auto' }} />
              <span style={{ marginTop: '5px' }}>{pet.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PetsGrid;