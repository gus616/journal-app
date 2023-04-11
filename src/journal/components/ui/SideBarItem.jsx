import { TurnedInNot } from "@mui/icons-material";
import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {setActiveNote } from '../../../store/journal'

export const SideBarItem = ({ title = '', body, id, date, imageUrls = [] }) => {
    const dispatch = useDispatch();
    const newTitle = useMemo(() => {
        return title.length > 17 ? title.substring(0, 17) + '...' : title;
    }, [title]);

    const onClickNote = () => {
        dispatch(setActiveNote({ title, body, id, date, imageUrls}));
    }

    return (
        <ListItem disablePadding onClick={ onClickNote } >
        <ListItemButton>
            <ListItemIcon>
                <TurnedInNot />
            </ListItemIcon>
            <Grid container>
                <ListItemText primary= { newTitle }
                    secondary={ body }
                />
            </Grid>
        </ListItemButton>
    </ListItem>
    );
}