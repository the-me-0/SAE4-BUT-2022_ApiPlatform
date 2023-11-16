import React from 'react';
import '../styles/room.scss';
import '../styles/alert.scss';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import { fetchRooms } from '../resources/api';
import CircularProgress from '@mui/joy/CircularProgress';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(room, currentRoom, theme) {
  return {
    fontWeight:
      currentRoom.indexOf(room.num) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
} 

export default function Room(props) {

  const theme = useTheme();
  const [currentRoom, setRoom] = React.useState('');
  const [rooms, setRooms] = React.useState([]);
  const [getLoading, setLoading] = React.useState();

  React.useEffect(() => {
    props.setError(false);
    setLoading(true);
    fetchRooms().then(response => response.json())
      .then(data => {
        setRooms(data["hydra:member"].map(room => room));
        setLoading(false);
      }
    ).catch(error => {
      props.setError(true);
      setLoading(false);
    });
  }, []);

  const handleChange = (event) => {
    setRoom(event.target.value);
    props.setCurrentRoom(rooms.find(room => room.name === event.target.value));
  };

  return (
    <div className='roomContainer'>
        <h3>Dans quelle salle vous situez vous ?</h3>
        { (getLoading === true) ?
          //<Alert className='alert' severity="error">Erreur de chargement des salles, vérifiez votre connexion !</Alert> : 
          <div id='loading'><CircularProgress color="primary" determinate={false} size="sm"/><p>Chargement des salles...</p></div> :
          (rooms.length === 0) ?
          <p>Aucunes salles disponibles</p> :
          <FormControl sx={{ m: 1, width: 250}}>
              <InputLabel id="inputLabel">Choix de salle</InputLabel>
              <Select
              labelId="demo-multiple-room-label"
              id="demo-multiple-room"
              value={currentRoom}
              onChange={handleChange}
              input={<OutlinedInput label="Choix de salle" />}
              MenuProps={MenuProps}
              >
              {
              // fais le map sur room en triant le nom des salles par ordre croissant
              rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => (
                  <MenuItem key={room.name} value={room.name} style={getStyles(room, currentRoom, theme)}>
                  {room.name}
                  </MenuItem>
              ))}
              </Select>
          </FormControl>
        }
    </div>
  );
}