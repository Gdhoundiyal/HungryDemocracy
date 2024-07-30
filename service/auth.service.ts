import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  FacebookAuthProvider,
  confirmPasswordReset
} from "firebase/auth";
import { getUser, saveUser } from "@/service/db.service";

export async function resetUserPassword(code, newPassword) {
  const result = await confirmPasswordReset(auth, code, newPassword).then(() => {
    // console.log('changed successfully');
    return 'Password Change Successfully'
  }).catch(() => {
    return 'An Error Occured Please try again'
  })
  return result;
}

export async function register(email, password, firstName, lastName, userName) {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  updateProfile(credentials.user, {
    displayName: firstName,
    //photoURL: "https://example.com/jane-q-user/profile.jpg"
  });
  await saveUser(email, firstName, lastName, userName, credentials.user.uid);
  return credentials.user;
}

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  // const user = await getUser(userCredential.user.uid);
  // //   analytics.logEvent("login", {
  // //     uid: userCredential.user.uid,
  // //   });
  return userCredential;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const firstName = result.user.displayName.split(' ')[0];
  const lastName = result.user.displayName.split(' ')[1];
  const userName = result.user.displayName.split(' ').join('-');
  saveUser(result.user.email, firstName, lastName, userName, result.user.uid);
  const user = await getUser(result.user.uid);
  return user;
}

export async function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  console.log(result);
}

export async function logout() {
  await auth.signOut();
  return true;
}

export async function forgotPassword(email) {
  await sendPasswordResetEmail(auth, email);
  return true;
}
