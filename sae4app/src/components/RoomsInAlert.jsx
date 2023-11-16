import React from 'react';
import RoomItem from './RoomItem';
import { GlobalContext } from './GlobalContext';
import { useContext } from 'react';

/* @Mui integration */
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/joy/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

/* API Call */
import { fetchAlerts } from '../resources/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  boxShadow: 'none',
}));

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option,
});

const RoomsInAlert = (props) => {
  const [getLoading, setLoading] = React.useState();
  const { role } = useContext(GlobalContext);
  const [getRooms, setRooms] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState(null);
  const { actedRooms } = useContext(GlobalContext);

  React.useEffect(() => {
    setLoading(true);
    fetchAlerts().then(response => response.json())
      .then(data => {
        /*setRooms(data["rooms"].map(alert => alert));*/
        setRooms(data["rooms"].map(room => room));
        setLoading(false);
      }
    );
  }, []);

  const filterType = ["Différence de température", "Différence de CO2", "Conseil agis", "Conseil non agis"];

  const sortRoomsByTemp = (a, b) => {

    if (a.temperature !== null && b.temperature !== null)
    {
      if (Math.abs(a.temperature.difference_target) > Math.abs(b.temperature.difference_target))
        return -1;
      else if (Math.abs(a.temperature.difference_target) < Math.abs(b.temperature.difference_target))
        return 1;
      else
        return 0;
    }
    if (a.temperature !== null && b.temperature === null)
      return -1;
    if (a.temperature === null && b.temperature !== null)
      return 1;
    else
      return 0;
  };

  const sortRoomsByCo2 = (a, b) => {

    if (a.co2 !== null && b.co2 !== null)
    {
      if (Math.abs(a.co2.difference_target) > Math.abs(b.co2.difference_target))
        return -1;
      else if (Math.abs(a.co2.difference_target) < Math.abs(b.co2.difference_target))
        return 1;
      else
        return 0;
    }
    if (a.co2 !== null && b.co2 === null)
      return -1;
    if (a.co2 === null && b.co2 !== null)
      return 1;
    else
      return 0;
  };

  const sortRoomsByName = (a, b) => {
    if (a.room_name > b.room_name)
      return 1;
    else if (a.room_name < b.room_name)
      return -1;
    else
      return 0;
  };

  const filteredRooms = getRooms.sort(selectedFilter === 'Différence de température' ? sortRoomsByTemp  : (selectedFilter === 'Différence de CO2') ? sortRoomsByCo2 : sortRoomsByName).filter((room) => {
    if (selectedFilter === null || selectedFilter === "Différence de CO2" ) {
      return true;
    } else if (selectedFilter === "Différence de température") {
      return room.temperature !== null;
    } else if (selectedFilter === "Différence de CO2") {
      return room.co2 !== null;
    }
    if (selectedFilter === "Conseil agis") {
      return room.advice.acted || actedRooms.includes(room.room_id);
    } else if (selectedFilter === "Conseil non agis"){
      return !room.advice.acted && !actedRooms.includes(room.room_id);
    } 
  });


  return(
    <>
      <Box sx={{ width: '80%', marginTop: '10%', marginBottom: "10%" }}>
        <Item sx={{padding: '10%'}}>
          <Stack spacing={3}>
          <h3>Espace Salles en Alerte</h3>
          { (getLoading === true) ? <div id='roomsLoading'><CircularProgress color="primary" determinate={false} size="sm"/><p>Chargement des       alertes...</p></div> :
            (getRooms.length === 0) ? <p>Aucune salle en alerte</p> :
            <Stack spacing={2} role='listitem'>
              <Autocomplete
                id="filter-demo"
                options={filterType}
                getOptionLabel={(option) => option}
                filterOptions={filterOptions}
                sx={{ width: "100%"}}
                value={selectedFilter}
                onChange={(event, newValue) => {
                  setSelectedFilter(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Filtrer par" />}
              />
              {
                filteredRooms.map((room, index) => (
                  <Item sx={{border: '1px solid #EEEEEE' }} key={index}><RoomItem room={room} setRooms={setRooms} getRooms={getRooms}/></Item>
                ))
              }
            </Stack>
          }
          </Stack>
        </Item>        
      </Box>
    </>
  );
};

export default RoomsInAlert;
