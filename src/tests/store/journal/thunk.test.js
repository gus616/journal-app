import { collection, deleteDoc, getDocs } from "firebase/firestore/lite";
import { addNewEmptyNote, savingNewNote, setActiveNote } from "../../../store/journal/journalSlice";
import { startNewNote } from "../../../store/journal/thunks";
import { firebaseDB } from "../../../firebase/config";


describe('journal thunks tests', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('startNewNote must call savingNewNote, addNewEmptyNote, setActiveNote', async () => {
        const uid = 'test-uid';   
        getState.mockReturnValue({auth: {uid}})
        await startNewNote()(dispatch, getState);

        const newNote = {
            body: '',
            title:'',          
            date: expect.any( Number ),
        }
        expect( dispatch ).toHaveBeenCalledWith( savingNewNote() );

        expect( dispatch ).toHaveBeenCalledWith( addNewEmptyNote(newNote));
        expect( dispatch ).toHaveBeenCalledWith( setActiveNote(newNote));

        //Delete from FireBase
        const collectionRef = collection(firebaseDB, `${uid}/journal/notes`);
        const docs = await getDocs(collectionRef);

        const deletePromises = [];
        docs.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));
        await Promise.all(deletePromises);

    });
});