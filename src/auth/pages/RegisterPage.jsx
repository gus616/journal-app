import { Link as RouterLink } from 'react-router-dom'
import { Google } from "@mui/icons-material";
import { Grid, TextField, Typography, Button, Link, Alert} from "@mui/material";
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks/useForm';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startCreatingUserWithEmailPassword } from '../../store/auth/thunks';

const formData = {
    email: '',
    password: '',
    displayName: ''
};

const formValidations = {
    email: [ (value) => value.includes('@'), 'El correo debe de tener una @'],
    password: [ (value) => value.length >= 6, 'El password debe de tener más de 6 letras.'],
    displayName: [ (value) => value.length >= 1, 'El nombre es obligatorio.'],
  }

export const RegisterPage = () => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const { status, errorMessage } = useSelector(state=> state.auth);
    const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
    const dispatch = useDispatch();
    const { 
        formState, displayName, email, password, onInputChange,
        isFormValid, displayNameValid, emailValid, passwordValid, 
      } = useForm( formData, formValidations );
    

    const onSubmitHandler = (e) => {
        e.preventDefault();        

        setFormSubmitted(true);

        if(!isFormValid) return;

        dispatch(startCreatingUserWithEmailPassword(formState));

        //onResetForm();
    }

    return(
   <AuthLayout title="Register">   
        <form onSubmit={ onSubmitHandler } >
          
            <Grid 
                className="animate__animated animate__fadeIn animate__faster"
                container 
                spacing={2} sx={{mb: 2, mt:1}}
            >
                <Grid item xs={12} display={!!errorMessage ? '' : 'none'}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Grid>
                 <Grid item xs={12} sx={{mt:2 }}>
                            <TextField 
                                label="fullname" 
                                type="text" 
                                placeholder="fullname" 
                                fullWidth
                                name="displayName"
                                value={ displayName }
                                onChange={ onInputChange }
                                error = { !!displayNameValid  && formSubmitted}
                                helperText = {displayNameValid}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{mt:2 }}>
                            <TextField 
                                label="email" 
                                type="email" 
                                placeholder="email" 
                                fullWidth
                                name="email"
                                value={ email }
                                onChange={ onInputChange }
                                error = { !!emailValid && formSubmitted}
                                helperText = {emailValid}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{mt:2 }}>
                            <TextField 
                                label="password" 
                                type="password" 
                                placeholder="contraseña" 
                                fullWidth
                                name="password"
                                value={ password }
                                onChange={ onInputChange }
                                error = {!!passwordValid && formSubmitted}
                                helperText = {passwordValid}
                            />
                        </Grid>

                        <Grid container spacing={ 2 } sx={{mb: 2, mt:1}}>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit"
                                    variant='contained' 
                                    fullWidth
                                    disabled={ isCheckingAuthentication }
                                >
                                        Register
                                </Button>
                            </Grid>
{/* 
                            <Grid item xs={12} sm={6}>
                                <Button 
                                    variant='contained' 
                                    fullWidth
                                >
                                    <Google />
                                    <Typography sx={{ml:1 }}> Google </Typography>
                                </Button>
                            </Grid> */}
                        </Grid>

                        <Grid container direction='row' justifyContent='end'>
                            <Typography sx={{mr: 1}}>Already have an account?</Typography>
                            <Link component={RouterLink} color='inherit' to="/auth/login">
                                Back
                            </Link>
                        </Grid>      
                    </Grid>
                </form>
        </AuthLayout>                         
    )
};