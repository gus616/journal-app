import { fireEvent, getByLabelText, render, screen } from "@testing-library/react";
import { LoginPage } from "../../../auth/pages/LoginPage";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../../store/auth/authSlice";
import { MemoryRouter } from "react-router-dom";
import { notAuthenticatedState } from '../../fixtures/authFixtures';

const mockStartGoogleSignIn = jest.fn();
const mockStartLoginWithEmailPassword = jest.fn();

jest.mock('../../../store/auth/thunks', () => ({
    startGoogleSignIn: () => mockStartGoogleSignIn,
    startLoginWithEmailPassword: ({email, password}) => {
        return () => mockStartLoginWithEmailPassword({email, password})
    }
}));

jest.mock('react-redux', ()=> ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,        
      },
      preloadedState: {
        auth: notAuthenticatedState
      }
});

describe('LoginPage tests', () => {
    beforeEach(()=> jest.clearAllMocks());

    test('must show component correctly', () => {
      
        render(
            <Provider store={ store }>
                <MemoryRouter>
                      <LoginPage/>
                </MemoryRouter>              
            </Provider>
        );

       
        expect(screen.getAllByText('Login').length).toBeGreaterThanOrEqual(1);
    });

    test('onGoogleSignIn must dispatch startGoogleSignIn', () => {
        render(
            <Provider store={ store }>
                <MemoryRouter>
                      <LoginPage/>
                </MemoryRouter>              
            </Provider>
        );

        const googleBtn = screen.getByLabelText('google-btn');
        
        fireEvent.click(googleBtn);

        expect(mockStartGoogleSignIn).toHaveBeenCalled();
        
    });

    test('submit must call startLoginWithEmailAndPassword', () => {

        const emailValue = 'testingemail@testing.com';
        const passwordValue = 'testing123';

        render(
            <Provider store={ store }>
                <MemoryRouter>
                      <LoginPage/>
                </MemoryRouter>              
            </Provider>
        );

        const emailField = screen.getByRole('textbox', {name: 'email'});
        const passwordField = screen.getByTestId('password');
        const btn = screen.getByLabelText('submit-btn');

        fireEvent.change(emailField, {target: {value: emailValue}});
        fireEvent.change(passwordField, {target: {value: passwordValue}});
        fireEvent.click(btn);



        expect(mockStartLoginWithEmailPassword).toHaveBeenCalledWith({email: emailValue, password: passwordValue});

    });
});