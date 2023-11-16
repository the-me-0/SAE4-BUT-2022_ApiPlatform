import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import '../styles/login.scss';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.primary,
    boxShadow: 'none',
}));

const Login = () => {
    const { role, setRole } = useContext(GlobalContext);

    const setNewRole = (role) => {
        setRole(role);
    };

    return (
        <>
            <Box sx={{ width: '80%', marginTop: '10%' }}>
                <Item>
                    <Stack spacing={3} sx={{display: "flex", alignItems: "center"}}>
                            <h3>Choix du role</h3>
                            {role === 'user' ? (
                                <Stack width={"50%"} spacing={3} sx={{display: "flex", alignItems: "center"}}>
                                    <Button sx={{width: "100%"}} variant="contained" onClick={() => setNewRole('admin')}>Admin</Button>
                                    <Button sx={{width: "100%"}} variant="contained" disabled>User</Button>
                                </Stack>
                                ) : (
                                <Stack width={"50%"} spacing={3} sx={{display: "flex", alignItems: "center"}}>
                                    <Button sx={{width: "100%"}} variant="contained" disabled>Admin</Button>
                                    <Button sx={{width: "100%"}} variant="contained" onClick={() => setNewRole('user')}>User</Button>
                                </Stack>
                            )}
                            <Stack direction="row" spacing={0.5}>
                                <p>Connecté en tant que role</p>
                                <p id='roleText'>{role}{role === 'user' ? <span className='roleIcon'><AccountCircleIcon/></span> 
                                : <span className='roleIcon'><SecurityIcon/></span> }
                                </p>
                            </Stack>
                    </Stack>
                </Item>
            </Box>
        </>
    );
};

export default Login;
