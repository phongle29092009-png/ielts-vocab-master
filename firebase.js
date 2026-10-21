import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut} from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore';
const env=import.meta.env;
export const enabled=!!(env.VITE_FIREBASE_API_KEY&&env.VITE_FIREBASE_AUTH_DOMAIN&&env.VITE_FIREBASE_PROJECT_ID&&env.VITE_FIREBASE_APP_ID);
const app=enabled?initializeApp({apiKey:env.VITE_FIREBASE_API_KEY,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN,projectId:env.VITE_FIREBASE_PROJECT_ID,appId:env.VITE_FIREBASE_APP_ID}):null;
export const auth=app?getAuth(app):null;
const db=app?getFirestore(app):null;
export function watchUser(cb){if(!auth)return ()=>{};return onAuthStateChanged(auth,cb)}
export async function login(){if(!auth)throw Error('Configure Firebase in .env.local first');try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment'].includes(e.code))await signInWithRedirect(auth,new GoogleAuthProvider());else throw e}}
export async function logout(){if(auth)await signOut(auth)}
export async function loadCloud(uid){if(!db)return null;const snap=await getDoc(doc(db,'users',uid));return snap.exists()?snap.data().state:null}
export async function saveCloud(uid,state){if(db)await setDoc(doc(db,'users',uid),{state,updatedAt:new Date().toISOString()})}
