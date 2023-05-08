import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Species, speciesCollection, storage } from '../firebase';
import { addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PetFormProps = {
  onSubmit: (petName: string, moodImages: MoodImages) => void;
};

type MoodImages = {
  [key: string]: File | null;
};

const PetForm: React.FC<PetFormProps> = ({ }) => {
  const [petName, setPetName] = useState('');
  const [moodImages, setMoodImages] = useState<MoodImages>({
    happy: null,
    neutral: null,
    sad: null,
    smallHappy: null,
    smallNeutral: null,
    smallSad: null,
    dead: null,
    egg: null,
  });
  const [formError, setFormError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetName(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, mood: keyof MoodImages) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setMoodImages((prevMoodImages) => ({
        ...prevMoodImages,
        [mood]: file,
      }));
    }
  };

  const formatMood = (mood: string): string => {
    // Split the mood key into words based on capital letters
    const words = mood.split(/(?=[A-Z])/);
    // Capitalize the first letter of each word and join them with a space
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  
  const handleSubmit = async () => {
    if (petName && Object.values(moodImages).every((image) => image !== null)) {
      setIsUploading(true); // Disable the create pet button
      try {
        // Upload each mood image to Firebase Storage and get the download URLs
        const downloadURLs = await Promise.all(
          Object.entries(moodImages).map(async ([mood, image]) => {
            const storageRef = ref(storage, `images/${petName}/${mood}`);
            await uploadBytes(storageRef, image!);
            return getDownloadURL(storageRef);
          })
        );

        // Create the pet object with the download URLs
        const pet: Species = {
          name: petName,
          happyImageURL: downloadURLs[0],
          neutralImageURL: downloadURLs[1],
          sadImageURL: downloadURLs[2],
          smallHappyImageURL: downloadURLs[3],
          smallNeutralImageURL: downloadURLs[4],
          smallSadImageURL: downloadURLs[5],
          deadImageURL: downloadURLs[6],
          eggImageURL: downloadURLs[7],
        };

        // Add the pet document to the "pets" collection
        await addDoc(speciesCollection, pet);
        toast.success(`Pet successfully created`);

        // Reset the form state to initial values
        setPetName('');
        setMoodImages({
          happy: null,
          neutral: null,
          sad: null,
          smallHappy: null,
          smallNeutral: null,
          smallSad: null,
          dead: null,
          egg: null,
        });
        setFormError(false);
      } catch (error) {
        toast.error(`Error adding pet document: ${error}`);
      } finally {
        setIsUploading(false); // Enable the create pet button
      }
    } else {
      setFormError(true);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Pet Name"
            variant="outlined"
            fullWidth
            value={petName}
            onChange={handleNameChange}
            error={formError && !petName}
            helperText={formError && !petName ? 'Please enter a pet name' : ''}
          />
        </Grid>
        {Object.keys(moodImages).map((mood) => (
          <Grid item xs={12} key={mood}>
            <Typography variant="h6" gutterBottom>
            {formatMood(mood)}
          </Typography>
            <input
              type="file"
              id={mood}
              accept="image/*"
              onChange={(event) => handleImageChange(event, mood as keyof MoodImages)}
            />
            {moodImages[mood] && (
              <img
                src={URL.createObjectURL(moodImages[mood]!)}
                alt={`${mood} preview`}
                height={100}
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12}>
          {formError && Object.values(moodImages).some((image) => image === null) && (
            <Typography variant="body2" color="error">
              Please upload all images
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Create Pet'}
        </Button>
      </Grid>
      </Grid>
    </form>
  );
};

export default PetForm;