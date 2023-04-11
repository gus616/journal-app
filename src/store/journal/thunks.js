import { collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore/lite";
import { firebaseDB } from "../../firebase/config";
import { fileUpload } from "../../helpers/fileUpload";
import { loadNotes } from "../../helpers/loadNotes";
import { addNewEmptyNote, setActiveNote, savingNewNote, setNotes, setSaving, updateNote, setPhotosToActiveNote, deleteNoteById} from "./journalSlice";


export const startNewNote = () => {

    return async (dispatch, getState) => {
        dispatch(savingNewNote());

        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
        }

        const newDoc = doc( collection( firebaseDB, `${uid}/journal/notes` ) );
        await setDoc(newDoc, newNote);

        dispatch( addNewEmptyNote( newNote ));
        dispatch( setActiveNote( newNote ));
        
    }
}

export const startLoadingNotes = () => {
    return async ( dispatch, getState ) => {
        const { uid } = getState().auth;

        if(!uid) throw new Error("error fetching");

        const notes = await loadNotes(uid);

        dispatch(setNotes(notes));
    }
}

export const startSavingNote = () => {
    return async ( dispatch, getState) => {

        dispatch(setSaving());

        const { uid } = getState().auth; 
        const { active: note } = getState().journal;

        if(!uid || !note) throw new Error("error saving note");

        const noteToFireStore = {...note};
        delete noteToFireStore.id;

        const docRef = doc( firebaseDB, `${uid}/journal/notes/${note.id}`);


        await updateDoc(docRef, noteToFireStore, { merge: true });


        dispatch( updateNote(note) );
       
    }
};

export const startUploadingFiles = (files = []) => {
    return async ( dispatch ) => {
        dispatch(setSaving());

        if(files.length === 0) return;

        const fileUploadPromises = [];

        files.forEach((file) => {
            fileUploadPromises.push(fileUpload(file));
        });

        const photosUrls = await Promise.all(fileUploadPromises);

        dispatch(setPhotosToActiveNote(photosUrls));
    }
};


export const startDeletingNote = () => {
    return async ( dispatch, getState ) => {

        const { uid } = getState().auth; 
        const { active: note } = getState().journal;

        const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);
        
        await deleteDoc(docRef);

        dispatch(deleteNoteById(note.id));

    }
}