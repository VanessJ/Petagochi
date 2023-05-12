import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User as FBUser,
} from 'firebase/auth';
import { CollectionReference, DocumentReference, collection, doc, getFirestore, setDoc } from 'firebase/firestore';

import { getStorage } from 'firebase/storage';


//Custom user type
export type User = FBUser & {role?: Role};

// Initialize Firebase
initializeApp({
  apiKey: "AIzaSyDpXaDoBhcHVeUGpWMs3Ji1CCZoLWgqoDU",
  authDomain: "task8-57a78.firebaseapp.com",
  projectId: "task8-57a78",
  storageBucket: "task8-57a78.appspot.com",
  messagingSenderId: "746133395820",
  appId: "1:746133395820:web:27bf0daec7489444777b49"
});

// Authentication
const auth = getAuth();

// Sign up handler
export const signUp = async (email: string, password: string) => {
	await setDoc(rolesDocument(email), {name:'user'});
	createUserWithEmailAndPassword(auth, email, password);
}
	

// Sign in handler
export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
	onAuthStateChanged(auth, callback);


export const storage = getStorage();

// Firestore
const db = getFirestore();

export type Role  = {name: 'user' | 'admin'};

export const rolesCollection = collection(
	db,
	'roles'
) as CollectionReference<Role>;

export const rolesDocument = (id: string) =>
  doc(db, 'roles', id) as DocumentReference<Role>;


export type Species  = {
	name: string;
	happyImageURL: string;
	neutralImageURL: string;
	sadImageURL: string;
	smallHappyImageURL: string;
	smallNeutralImageURL: string;
	smallSadImageURL: string;
	deadImageURL: string;
	eggImageURL: string;
	[key: string]: string;
}

export const speciesCollection = collection(
	db,
	'species'
) as CollectionReference<Species>;

export const speciesDocument = (id: string) =>
  doc(db, 'species', id) as DocumentReference<Species>;

export type Pet  = {
	name: string;
	speciesUid: string;
	ownerUid: string;
	timeCreated: Date;
	lastVisit: Date;
	hungerLevel: number;
	happinessLevel: number;
	energyLevel: number;
}

export const petConverter = {
	toFirestore(pet: Pet) {
	  return pet; 
	},
	fromFirestore(snapshot: any, options: any) {
	  const data = snapshot.data(options);
	  return {
		...data,
		timeCreated: data.timeCreated.toDate(), 
		lastVisit: data.lastVisit.toDate(), 
	  };
	},
  };

export const petDocument = (id: string) =>
	doc(db, 'pets', id) as DocumentReference<Pet>;

export const petsCollection = collection(
	db,
	'pets'
) as CollectionReference<Pet>;

export type Stage = "Egg" | "Adult" | "Baby" | "Dead";

export type Mood = "Happy" | "Neutral" | "Sad";




