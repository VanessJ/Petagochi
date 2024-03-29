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
import React, { useEffect, useRef, useState } from 'react';
import { deleteDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

type GameProps = {
	pet: Pet;
	species: Species;
};

const MaxLevel = 100;

export const UPDATE = 1000 * 60; // 1 minute in milliseconds

const Game: React.FC<GameProps> = ({ pet, species }) => {
	const [imageURL, setImageURL] = useState('');

	useEffect(() => {
		const update = () => {
			usePetImage(pet, species, setImageURL, setPetDeath);
			setHunger(pet.hungerLevel);
			setHappines(pet.happinessLevel);
			setEnergy(pet.energyLevel);
			// Schedule the next update after the specified interval
			setTimeout(update, UPDATE);
		};

		// Start the initial update
		setTimeout(update, 0);
	}, []);


	const dialogRef = useRef(false);
	const [isDialogOpen, setDialogOpen] = useState(false);
	useEffect(() => {
		dialogRef.current = isDialogOpen;
	}, [isDialogOpen]);

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
		toast.success(`Nom nom nom`);
		setHunger(pet.hungerLevel);
		usePetImage(pet, species, setImageURL, setPetDeath);
	};

	const updateHappines = (pet: Pet) => {
		pet.happinessLevel = MaxLevel;
		llamaSound.play();
		setHappines(pet.happinessLevel);
		setDoc(petDocument(pet.id), pet);
		toast.success(`Me played with my hooman, me happy`);
		usePetImage(pet, species, setImageURL, setPetDeath);
	};

	const updateEnergy = (pet: Pet) => {
		const updateInterval = 1000; // 1 sec in milliseconds

		setDialogOpen(true);

		const update = () => {
			if (pet.energyLevel < MaxLevel) {
				pet.energyLevel += 1;
				setEnergy(pet.energyLevel);
				usePetImage(pet, species, setImageURL, setPetDeath);

				if (pet.energyLevel >= MaxLevel || !dialogRef.current) {
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
		window.location.reload();
	};

	const wakeUp = () => {
		setDialogOpen(false);
		toast.success(`Good morning!`);
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
					border: '2px solid #fc03db',
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
					<Button onClick={() => wakeUp()}>Wake up</Button>
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
