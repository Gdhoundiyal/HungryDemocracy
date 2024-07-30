import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { browserLocalPersistence, getAuth, initializeAuth, browserPopupRedirectResolver } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_PROJECTID,
  storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGE_SENDERID,
  appId: process.env.NUXT_ENV_GOOGLE_APPID,
  measurementId: process.env.NUXT_ENV_MEASUREMENTID
};

//initialize App
let app;
if (getApps().length < 1) app = initializeApp(firebaseConfig);
//initialize Firestore
const db = getFirestore(app);
//initialize storage
const storage = getStorage(app);
//initialize auth
const auth = (typeof document !== 'undefined') ? initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
}) : getAuth(app);

export { db, storage, auth };
