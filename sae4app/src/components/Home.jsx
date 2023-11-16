import React from 'react';
import "../styles/home.scss";
import { useOutletContext } from "react-router-dom";

/* Components includes */
import Room from './Room';
import Datas from './Datas';
import Advice from './Advice';

/* @MUI includes */
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  boxShadow: 'none',
}));

const Home = () => {

  // set useStates here
  const [getCurrentRoom, setCurrentRoom] = React.useState("");
  const [error, setError] = useOutletContext();
  const [roomError, setRoomError] = React.useState();
  const [tempError, setTempError] = React.useState();
  const [adviceError, setAdviceError] = React.useState();

  // <Alert id='alert' severity="error">Erreur de chargement de la température, vérifiez votre connexion !</Alert>

  React.useEffect(() => {
    if (roomError || tempError) {
      if (roomError) {
        setError("Erreur de chargement de la salle, vérifiez votre connexion !");
      }
      else if (tempError) {
        setError("Impossible de récupérer les données de cette salle !");
      }
    }
  }, [roomError, tempError]);
  
  return(
    <>
      <Box sx={{ width: '80%', marginTop: '10%', marginBottom: "10%" }}>
        <Stack spacing={4}>
          <Item><Room setCurrentRoom={setCurrentRoom} setError={setRoomError}/></Item>
          <Item><Datas getCurrentRoom={getCurrentRoom} setError={setTempError}/></Item>
          <Item><Advice advice={getCurrentRoom.advice} room_id={getCurrentRoom.id} setError={setAdviceError}/></Item>
        </Stack>
      </Box>
    </>
  );
};

export default Home;