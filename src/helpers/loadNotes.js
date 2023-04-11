import { collection, getDocs } from "firebase/firestore/lite";
import { firebaseDB } from "../firebase/config";

export const loadNotes = async (uid = '') => {
    if (!uid )throw new Error ("id doesn't exist");

    const collecitonRef = collection(firebaseDB, `${uid}/journal/notes`);
    const docs = await getDocs(collecitonRef);

    const notes = [];

    docs.forEach( doc => {
        notes.push({id: doc.id, ...doc.data( )});
    });

    return notes;
};