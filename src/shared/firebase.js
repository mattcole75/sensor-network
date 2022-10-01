import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebase_service_account } from '../configuration/config';

const app = initializeApp(firebase_service_account);

export const auth = getAuth(app);
export const db = getFirestore(app);
