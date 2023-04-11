import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword} from "firebase/auth";
import { FireBaseAuth, firebaseDB } from "./config";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({    prompt: 'select_account'})
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(FireBaseAuth, googleProvider);
        const {displayName, email, photoURL, uid } = result.user;
        return {
            ok: true,
            displayName,
            email,
            photoURL,
            uid
        };
    }
    catch(error) {      
        
        const err = error.message.replace('Firebase:', '');
        const errorMessage = err.message;
        
        return {
            ok: false, errorMessage            
        }
    }
};

export const registerUserWithEmailPassword =  async ({email, password, displayName}) => {
    try {
      const response = await createUserWithEmailAndPassword(FireBaseAuth, email, password);
      const {uid, photoURL} = response.user;

      await updateProfile(FireBaseAuth.currentUser, {
        displayName
      });

      return {
        ok: true,
        uid,
        photoURL,
        email,
        displayName,
      }


    } catch(err) {
      const error = err.message.replace('Firebase:', '');
      return {ok: false, errorMessage: error}
    }
};

export const loginWithEmailPassword = async ({email, password}) => {
    try {
      const response = await signInWithEmailAndPassword(FireBaseAuth, email,password);
      const { uid, photoURL, displayName} = response.user;
      return {
        ok: true,
        uid,
        photoURL,
        displayName,
      }
    } catch(err) {
      const error = err.message.replace('Firebase:', '');
      return {ok: false, errorMessage: error}
    }
};

export const logoutFirebase = async () => {
    try {
      return await FireBaseAuth.signOut();
    } catch(err){
      console.log(err);
    }
};

