import React from 'react';
import '../styles/datas.scss';
import Stack from '@mui/material/Stack';
import '../styles/alert.scss';
import '../styles/style.scss';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import Co2Icon from '@mui/icons-material/Co2';
import CircularProgress from '@mui/joy/CircularProgress';
import { fetchLastData } from '../resources/api';

const Datas = (props) => {

  const [getTemperature, setTemperature] = React.useState('');
  const [getCO2, setCO2] = React.useState('');
  const [getLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (props.getCurrentRoom) {
      setLoading(true);
      props.setError(false);
      fetchLastData(props.getCurrentRoom.id).then(response => response.json())
        .then(data => {
          setTemperature(data.temperature);
          setCO2(data.co2);
          setLoading(false);
        }).catch(error => {
          console.log("error");
        props.setError(true);
      });
    }
  }, [props.getCurrentRoom]);

  const color = (datas, type) => {
    if ( (datas.value < parseInt(datas.objective) - parseInt(datas.gap)) && (type == "temp")) {
      return '#757de8';
    } else if (datas.value > parseInt(datas.objective) + parseInt(datas.gap)) {
      return '#fc593c';
    } else {
      return '#6fbf73';
    }
  };

  return(
    <div className="container datas">
      <Stack spacing={1}>
        <h3>Espace Données</h3>
        {
        (props.getCurrentRoom === "") ? <p>Selectionnez une salle pour connaître ses données</p> :
        (getLoading) ?
          <div id='loading'><CircularProgress color="primary" determinate={false} size="sm"/><p>Chargement des données...</p></div>
          :
          <>
            <div className="data"><DeviceThermostatIcon/><span style={{color: color(getTemperature, "temp")}}>{getTemperature.value}°C</span></div>
            <div className="data"><Co2Icon fontSize="large"/><span style={{color: color(getCO2, "co2")}}>{getCO2.value}ppm </span></div>
          </>
        }
      </Stack>
    </div>
  );
};

export default Datas;

/*
      <Stack spacing={1}>
        <h3>Espace Données</h3>
        {
        (getTemperature === '' || getCO2 === '') ? <p>Selectionnez une salle pour connaître ses données</p> :
        (getLoading) ?
          <div id='loading'><CircularProgress color="primary" determinate={false} size="sm"/><p>Chargement des données...</p></div>
          :
          <>
            <div className="data" style={{color: color(getTemperature)}}><DeviceThermostatIcon/>{getTemperature.value}°C</div>
            <div className="data" style={{color: color(getCO2)}}><Co2Icon fontSize="large"/>  {getCO2.value}ppm </div>
          </>
        }
      </Stack>
*/
