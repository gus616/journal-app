import { authSlice, checkingCredentials, login, logout } from "../../../store/auth/authSlice";
import { aunthenticatedState, demoUser, initialState, notAunthenticatedState } from "../../fixtures/authFixtures";

describe('authSlice tests', () => {
    test('must return initial state and be called auth', () => {
        expect ( authSlice.name).toBe('auth');

        const state = authSlice.reducer(initialState, {});

        expect(state).toEqual(initialState);
    });

    test('must do the aunthentication', () => {

        const state = authSlice.reducer(initialState, login(demoUser));
        expect( state ).toEqual(demoUser);
    });

    test('must do logout', () => {
        const state = authSlice.reducer(aunthenticatedState, logout(demoUser));


        expect(state).toEqual(notAunthenticatedState);
    });

    test('must do logout and show error message', () => {
        const errorMessage = "Credenciales no son correctas";
        demoUser.errorMessage = errorMessage;
        const state = authSlice.reducer(aunthenticatedState, logout(demoUser));

        expect(state.errorMessage).toBe(errorMessage);
    });

    test('must change state to checking', () => {
        const state = authSlice.reducer(aunthenticatedState, checkingCredentials(demoUser));

        expect(state.status).toBe('checking');
    });


});


