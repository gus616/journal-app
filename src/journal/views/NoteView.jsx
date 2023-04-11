import { DeleteOutline, SaveOutlined, UploadOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css';

import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNote, startDeletingNote, startSavingNote, startUploadingFiles } from "../../store/journal"

import { useForm } from "../../hooks/useForm";
import { ImageGallery } from "../components/ui/ImageGallery";

export const NoteView = () => {    
    const dispatch = useDispatch();

    const inputFileRef = useRef();

    const { active: note, messageSaved, isSaving } = useSelector(state => state.journal);
    const {title, body, date, onInputChange, formState, onResetForm} = useForm( note );

    const dateString = useMemo( () => {
        const newDate = new Date( date ).toUTCString();
        return newDate;
    }, [date]);

    useEffect(() => {
        dispatch( setActiveNote(formState) );
    }, [formState]);

    useEffect(() => {
        if(messageSaved.length > 0) {
            Swal.fire("Note updated", messageSaved, 'success');
        }
    }, [messageSaved]);

    const onSaveNote = () => {
        dispatch(startSavingNote());
    }

    const onFileInputChange = ({ target }) => {
        const files = [...target.files];

        if(files.length === 0) return;

        dispatch(startUploadingFiles(files));
    }

    const onUploadFilesClickHandler = () => {
        inputFileRef.current.click();
    }

    const onDelete = () => {
        dispatch(startDeletingNote());
    };    

    return(
        <Grid
            className="animate__animated animate__fadeIn animate__faster" 
            container
            direction= 'row' justifyContent='space-between' alignItems='center' sx={{mb: 1}}
        >
            <Typography fontSize={39} fontWeight='light'>{dateString}</Typography>
            <Grid item>

                <input 
                    type="file" 
                    multiple
                    onChange={ onFileInputChange }
                    style={{display: 'none'}}
                    ref = { inputFileRef }
                />

                <IconButton
                    color="primary"
                    disabled = { isSaving }  
                    size = "large"    
                    onClick={onUploadFilesClickHandler}              
                >
                    <UploadOutlined />
                </IconButton>

                <Button 
                    color='primary' 
                    sx={{padding: 2}} 
                    onClick = { onSaveNote }
                    disabled = { isSaving }
                >
                    <SaveOutlined sx={{fontSize: 30, mr: 1}} />
                    Save
                </Button>
            </Grid>

            <Grid container>
                <TextField
                    type="text"
                    variant="filled"
                    fullWidth
                    placeholder="enter a title"
                    label="title"
                    name = "title"
                    value = {title}
                    onChange={ onInputChange }
                    sx={{border: 'none', mb: 1}} />
            
                <TextField
                    type="text"
                    variant="filled"
                    fullWidth
                    multiline
                    placeholder="What happened today?"
                    label="What happened today?"
                    name = "body"
                    value = {body}
                    onChange={ onInputChange }
                    minRows= { 5 }
                    />
                

                <Grid container justifyContent="end">
                    <Button
                        onClick={ onDelete }
                        sx={{ mt: 2 }}
                        color ="error"
                    > 
                        <DeleteOutline />
                        Delete
                    </Button>
                </Grid>

                <ImageGallery images = {note.imageUrls}/>
            </Grid>
            
        </Grid>
    )
};

