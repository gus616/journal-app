import React from 'react'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { purpleTheme } from './purpleTheme';



export default function AppTheme({children}) {
  return (
    <ThemeProvider theme={purpleTheme}>    
        <CssBaseline />
         { children }      
    </ThemeProvider>
  )
};
