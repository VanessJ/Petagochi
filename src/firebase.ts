import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User
} from 'firebase/auth';
import { CollectionReference, collection, getFirestore } from 'firebase/firestore';

import { getStorage } from 'firebase/storage';


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
export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
	onAuthStateChanged(auth, callback);

// Firestore
const db = getFirestore();

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

export const petsCollection = collection(
	db,
	'species'
) as CollectionReference<Species>;

export const storage = getStorage();



