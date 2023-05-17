import {
	Typography,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogActions
} from '@mui/material';
import { Pet, Species, petDocument } from '../firebase';
import usePetImage from '../hooks/usePetImage';
import React, { useEffect, useState } from 'react';
import { deleteDoc, setDoc } from 'firebase/firestore';

type GameProps = {
	pet: Pet;
	species: Species;
};

const MaxLevel = 100;

const Game: React.FC<GameProps> = ({ pet, species }) => {
	const [imageURL, setImageURL] = useState('');

	useEffect(() => usePetImage(pet, species, setImageURL, setPetDeath), []);

	const [isDialogOpen, setDialogOpen] = useState(false);
	const [isPetDead, setPetDeath] = useState(false);

	const [Hunger, setHunger] = useState(pet.hungerLevel);
	const [Happines, setHappines] = useState(pet.happinessLevel);
	const [Energy, setEnergy] = useState(pet.energyLevel);

	let nomNom = new Audio('/src/sounds/nomnom.mp3');
	let llamaSound = new Audio('/src/sounds/llamaSound.wav');
	let sleeping = new Audio('/src/sounds/snoring.mp3');

	const updateHunger = (pet: Pet) => {
		nomNom.play();
		const rndNum = Math.floor(Math.random() * 40);
		if (pet.hungerLevel + rndNum <= MaxLevel) {
			pet.hungerLevel += rndNum;
		} else {
			pet.hungerLevel = MaxLevel;
		}
		setHunger(pet.hungerLevel);
		usePetImage(pet, species, setImageURL, setPetDeath);
	};

	const updateHappines = (pet: Pet) => {
		pet.happinessLevel = MaxLevel;
		llamaSound.play();
		setHappines(pet.happinessLevel);
		setDoc(petDocument(pet.id), pet);
		usePetImage(pet, species, setImageURL, setPetDeath);
	};

	const updateEnergy = (pet: Pet) => {
		const updateInterval = 60000; // 1 minute in milliseconds

		const update = () => {
			setDialogOpen(true);

			if (pet.energyLevel < MaxLevel) {
				pet.energyLevel += 1;
				setEnergy(pet.energyLevel);
				usePetImage(pet, species, setImageURL, setPetDeath);

				if (pet.energyLevel >= MaxLevel) {
					setDialogOpen(false);
					return;
				}
			}
			sleeping.play();
			// Schedule the next update after the specified interval
			setTimeout(update, updateInterval);
		};

		// Start the initial update
		setTimeout(update, 0);
	};

	const startOver = (pet: Pet) => {
		deleteDoc(petDocument(pet.id));
		setPetDeath(false);
	};

	useEffect(() => {
		if (Energy >= MaxLevel) {
			setDialogOpen(false);
		}
	}, [Energy]);

	return (
		<>
			<Typography variant="h4" textAlign="center">
				{pet.name}
			</Typography>
			<Box
				sx={{
					border: '2px solid green',
					padding: '10px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<>
					<img
						src={imageURL}
						alt={pet.name}
						style={{ width: '25vw', height: '25vw', objectFit: 'cover' }}
					/>

					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'column',
							marginTop: '10px'
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '10px'
							}}
						>
							<Typography variant="h5" sx={{ marginRight: '15px' }}>
								Hunger: {Hunger}/{MaxLevel}
							</Typography>
							<Button
								variant="contained"
								size="small"
								onClick={() => updateHunger(pet)}
								disabled={isPetDead}
							>
								Feed
							</Button>
						</Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '10px'
							}}
						>
							<Typography variant="h5" sx={{ marginRight: '15px' }}>
								Happines: {Happines}/{MaxLevel}
							</Typography>
							<Button
								variant="contained"
								size="small"
								onClick={() => updateHappines(pet)}
								disabled={isPetDead}
							>
								Play
							</Button>
						</Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '10px'
							}}
						>
							<Typography variant="h5" sx={{ marginRight: '15px' }}>
								Energy: {Energy}/{MaxLevel}
							</Typography>
							<Button
								variant="contained"
								size="small"
								onClick={() => updateEnergy(pet)}
								disabled={isPetDead}
							>
								Sleep
							</Button>
						</Box>
					</Box>
				</>
			</Box>
			<Dialog open={isDialogOpen}>
				<DialogContent>
					<Typography variant="body1">
						Sleeping... {MaxLevel - pet.energyLevel} remaining
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Wake up</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isPetDead}>
				<DialogContent>
					<Typography variant="h2">Game Over</Typography>
					<Typography variant="h3">Your pet has died.</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => startOver(pet)}>Start Over</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Game;
