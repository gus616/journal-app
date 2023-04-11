import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import { Google } from "@mui/icons-material";
import { Grid, TextField, Typography, Button, Link, Alert} from "@mui/material";
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks/useForm';
import { startGoogleSignIn, startLoginWithEmailPassword } from '../../store/auth/thunks';
import { useMemo } from 'react';


const formData = {
    email: '',
    password: '',    
}

export const LoginPage = () => {
    const { status, errorMessage } = useSelector( state => state.auth );
    const authDispatch = useDispatch();


    const {
        email, password, onInputChange, onResetForm
    } = useForm(formData);

    const isAuthenticating = useMemo(() => status === 'checking', [status]);

    const onSubmitHandler = (e) => {
        e.preventDefault();

        authDispatch(startLoginWithEmailPassword({email, password}));
        
        onResetForm();
    }

    const onGoogleSignIn = () => {
        authDispatch(startGoogleSignIn()); 
    };



    return(
        <AuthLayout title="Login">
            <form className="animate__animated animate__fadeIn animate__faster">   
            <Grid item xs={12} display={!!errorMessage ? '' : 'none'}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Grid>
                    <Grid container>
                        <Grid item xs={12} sx={{mt:2 }}>
                            <TextField 
                                label="email" 
                                type="email" 
                                placeholder="email" 
                                fullWidth
                                name="email"
                                onChange={onInputChange}
                                value={ email }
                            />
                        </Grid>
                        <Grid item xs={12} sx={{mt:2 }}>
                            <TextField 
                                inputProps={{
                                    'data-testid': 'password'
                                }}
                                label="password" 
                                type="password" 
                                placeholder="password" 
                                fullWidth
                                name="password"
                                onChange={onInputChange}
                                value={ password }
                            />
                        </Grid>

                        <Grid container spacing={ 2 } sx={{mb: 2, mt:1}}>
                            <Grid item xs={12} sm={6}>
                                <Button 
                                     aria-label="submit-btn"
                                    disabled = { isAuthenticating }
                                    variant='contained' 
                                    fullWidth  
                                    onClick={onSubmitHandler} 
                                    >
                                        Login
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button 
                                    disabled = { isAuthenticating }
                                    variant='contained' 
                                    fullWidth 
                                    aria-label="google-btn"
                                    onClick={ onGoogleSignIn }

                                >
                                    <Google />
                                    <Typography sx={{ml:1 }}> Google </Typography>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container direction='row' justifyContent='end'>
                            <Link component={RouterLink} color='inherit' to="/auth/register">
                                Create an Account
                            </Link>
                        </Grid>
      
                    </Grid>
                </form>
        </AuthLayout>                         
    )
};
