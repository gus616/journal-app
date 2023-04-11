import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, signInWithGoogle } from "../../../firebase/providers";
import { login, logout} from "../../../store/auth/authSlice";
import { checkingCredentials } from "../../../store/auth/authSlice";
import { checkingAuthentication, startCreatingUserWithEmailPassword, startGoogleSignIn, startLoginWithEmailPassword, startLogout } from "../../../store/auth/thunks";
import { clearNotesLogout } from "../../../store/journal";
import { demoUser } from "../../fixtures/authFixtures";

jest.mock('../../../firebase/providers');
const dispatch = jest.fn();

describe('auth thunks tests', () => {
    test('must invoke checking credentials', async () => {
      
        await checkingAuthentication()(dispatch);
       
        
        //expect(dispatch).toHaveBeenCalledWith({"payload": undefined, "type": "auth/checkingCredentials"});
        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    });


    test('startGoogleSignIn must call checkingCredentials and login if success', async () => {
        const loginData = { ok:true, ...demoUser};

        await signInWithGoogle.mockResolvedValue(loginData);


        await startGoogleSignIn()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(login(loginData));
    });

    test('startGoogleSignIn must call checkingCredentials and logout if error', async () => {
        const loginData = { ok:false, errorMessage: "A google error"};

        await signInWithGoogle.mockResolvedValue(loginData);

        await startGoogleSignIn()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(logout(loginData.errorMessage));
    });

     test('startCreatingUserWithEmailPassword must call checkingCredentials and login - success' , async () => {
        const registerData = {ok: true, ...demoUser};
        const formData = {email: demoUser.email, password: "123456", displayName: demoUser.displayName};

        await registerUserWithEmailPassword.mockResolvedValue(registerData);
        await startCreatingUserWithEmailPassword(formData)(dispatch);


        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());

        expect(dispatch).toHaveBeenCalledWith({"payload": {"displayName": "Demo user", "email": "demo@google.com", "photoURL": "https://demo.jpg", "uid": "123ABC"}, "type": "auth/login"});

    });

    test('startCreatingUserWithEmailPassword must call checkingCredentials and login - error' , async () => {
        const registerData = {ok: false, errorMessage: "error creating demo user"};
        const formData = {email: demoUser.email, password: "123456", displayName: demoUser.displayName};

        await registerUserWithEmailPassword.mockResolvedValue(registerData);
        await startCreatingUserWithEmailPassword(formData)(dispatch);


        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());

        expect(dispatch).toHaveBeenCalledWith( {"payload": {"errorMessage": "error creating demo user"}, "type": "auth/logout"});
    }); 

    test('startLoginWithEmailPassword must call checkingCredentials and login - success', async () => {
        const loginData = {ok: true, ...demoUser};
        const formData = {email: demoUser.email, password: "123456"};

        await loginWithEmailPassword.mockResolvedValue( loginData );
        await startLoginWithEmailPassword(formData)(dispatch);

        expect( dispatch ).toHaveBeenCalledWith(checkingCredentials());
        expect( dispatch ).toHaveBeenCalledWith({"payload": {"displayName": "Demo user", "email": "demo@google.com", "photoURL": "https://demo.jpg", "uid": "123ABC"}, "type": "auth/login"});

    });

     test('startLoginWithEmailPassword must call checkingCredentials and logout - error', async () => {
        const loginData = {ok: false, errorMessage: "authentication error"};
        const formData = {email: demoUser.email, password: "123456", displayName: "demouser"};

        await loginWithEmailPassword.mockResolvedValue(loginData);


        await startLoginWithEmailPassword(formData)(dispatch);    
        
        expect( dispatch ).toHaveBeenCalledWith(checkingCredentials());
        expect( dispatch ).toHaveBeenCalledWith({"payload": {"errorMessage": "authentication error"}, "type": "auth/logout"});
    }); 

    test('startLogout must call logoutFirebase', async () => {
        await startLogout()(dispatch);

        expect(logoutFirebase).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(clearNotesLogout());
        expect(dispatch).toHaveBeenCalledWith(logout({}));
    });
}); 