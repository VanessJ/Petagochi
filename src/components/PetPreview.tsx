import { useEffect, useState } from "react";
import { Pet, petsCollection, storage } from "../firebase";
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { DocumentReference, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

type PetPreviewProps = {
  pet: Pet;
  onClose: () => void;
  onPetUpdate: () => void; 
};

const PetPreview: React.FC<PetPreviewProps> = ({ pet, onClose, onPetUpdate }) => {
  const imageKeys = [
    "neutralImageURL",
    "happyImageURL",
    "sadImageURL",
    "smallNeutralImageURL",
    "smallHappyImageURL",
    "smallSadImageURL",
    "eggImageURL",
    "deadImageURL",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [editedName, setEditedName] = useState<string>(pet.name);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const numImages = imageKeys.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < numImages - 1 ? prevIndex + 1 : numImages - 1));
  };

  useEffect(() => {
    setEditedName(pet.name);
  }, [pet]);

  const currentImageKey = imageKeys[currentImageIndex];
  const currentImageUrl = uploadedImage ? URL.createObjectURL(uploadedImage) : pet[currentImageKey];

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleSaveName = async () => {
    try {
      const petRef: DocumentReference<Pet> = doc(petsCollection, pet.id);

      await updateDoc(petRef, { name: editedName });
      onPetUpdate();
      toast.success(`Pet successfully updated`);
    } catch (error) {
      toast.error(`Error updating pet name: ${error}`);
    }
  };

  const handleSaveImage = async () => {
    if (uploadedImage) {
      try {
        const currentImageKey = imageKeys[currentImageIndex];
        const storageRef = ref(storage, `images/${pet.name}/${currentImageKey}`);
        const uploadTask = uploadBytes(storageRef, uploadedImage);

        await uploadTask;

        const downloadURL = await getDownloadURL(storageRef);
        const petRef: DocumentReference<Pet> = doc(petsCollection, pet.id);

        await updateDoc(petRef, { [currentImageKey]: downloadURL });
        onPetUpdate();

        setUploadedImage(null);
        setCurrentImageIndex(0);
        toast.success(`Pet successfully updated`);
      } catch (error) {
        toast.error(`Error updating pet image: ${error}`);
      }
    }
  };
  
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <img
        src={currentImageUrl}
        alt={pet.name}
        style={{ width: '25vw', height: '25vw', objectFit: 'cover' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input type="text" value={editedName} onChange={handleNameChange} style={{ marginRight: '10px' }} />
        <button style={{ padding: '5px 10px', cursor: 'pointer' }} onClick={handleSaveName}>
          Save
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button style={{ padding: '5px 10px', cursor: 'pointer' }} onClick={handleSaveImage} disabled={!uploadedImage}>
          Update Photo
        </button>
      </div>
      <button style={{ marginTop: '10px' }} onClick={onClose}>
        Close
      </button>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        <ArrowBack
          onClick={handlePrevImage}
          style={{ cursor: 'pointer', marginRight: '10px', visibility: currentImageIndex === 0 ? 'hidden' : 'visible' }}
        />
        <span style={{ margin: '0 10px' }}>{currentImageIndex + 1}</span>
        <ArrowForward
          onClick={handleNextImage}
          style={{
            cursor: 'pointer',
            marginLeft: '10px',
            visibility: currentImageIndex === numImages - 1 ? 'hidden' : 'visible',
          }}
        />
      </div>
    </div>
  );
};

export default PetPreview;