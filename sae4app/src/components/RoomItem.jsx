import React from 'react';

import Advice from "../components/Advice";

/* @MUI integration */
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Stack from '@mui/material/Stack';

/* Styles */
import '../styles/roomItem.scss';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={1} {...props} />
))(() => ({
  "boxShadow": 'none',
  border: `none`
}));

const RoomsInAlert = (props) => {

  const colorVariation = (variation) => {
    if (variation === 'stable') {
        return '#6fbf73';
    } else if (variation === 'haussière') {
        return '#ff7961';
    } else {
        return '#757de8';
    }
  };

  const colorTemperature = (temperature) => {
    if (temperature < 19) {
        return '#757de8';
    } else if (temperature > 19) {
        return '#ff7961';
    } else {
        return '#6fbf73';
    }
  };

  const colorCO2 = (co2) => {
    if (co2 < 800) {
        return '#757de8';
    } else if (co2 > 800) {
        return '#ff7961';
    } else {
        return '#6fbf73';
    }
  };

  const iconVariation = (variation) => {
    if (variation === 'stable') {
        return <TrendingFlatIcon sx={{fontSize: "large"}}/>;
    } else if (variation === 'en hausse') {
        return <TrendingUpIcon sx={{fontSize: "large"}}/>;
    } else {
        return <TrendingDownIcon sx={{fontSize: "large"}}/>;
    }
  };

  const renderingTemperature = () => {
    return (
      <Stack id='alertContainer'>
        <p style={{textAlign: "left", fontWeight: "bold", fontStyle: "italic"}}>Données température</p>
        <Stack direction="row" spacing={8} id='temperatureContainer'>
          <p style={{color: colorTemperature(props.room.temperature.value)}}>{props.room.temperature.value}°C</p>
          <p style={{color: colorTemperature(props.room.temperature.value)}}>{props.room.temperature.difference_target > 0 ? "+" : null}{props.room.temperature.difference_target}°C</p>
        </Stack>
        <p id='line'></p>
        <Stack direction="row" spacing={4} id='variations'>
          <svg id='variationIcon' style={{color: colorVariation(props.room.temperature.variation)}}>
            {iconVariation(props.room.temperature.variation)}
          </svg>
          <div id='variation'>La température est actuellement<span style={{ color: colorVariation(props.room.temperature.variation), fontWeight: "bold", fontStyle: "italic"}}>{props.room.temperature.variation}</span>
          </div>
        </Stack>
      </Stack>
    );
  };

  const renderingCo2 = () => {
    return (
      <Stack id='alertContainer'>
        <p style={{textAlign: "left", fontWeight: "bold", fontStyle: "italic"}}>Données CO2</p>
        <Stack direction="row" spacing={5} id='temperatureContainer'>
          <p style={{color: colorCO2(props.room.co2.value)}}>{props.room.co2.value}ppm</p>
          <p style={{color: colorCO2(props.room.co2.value)}}>{props.room.co2.difference_target > 0 ? "+" : null}{props.room.co2.difference_target}ppm</p>
        </Stack>
        <p id='line'></p>
        <Stack direction="row" spacing={4} id='variations'>
          <svg id='variationIcon' style={{color: colorVariation(props.room.co2.variation)}}>
            {iconVariation(props.room.co2.variation)}
          </svg>
          <div id='variation'>Le CO2 est actuellement<span style={{ color: colorVariation(props.room.co2.variation), fontWeight: "bold", fontStyle: "italic"}}>{props.room.co2.variation}</span>
          </div>
        </Stack>
      </Stack>
    );
  };

  return(
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{props.room.room_name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(props.room.temperature != null) ? renderingTemperature() : <p>Aucun problème de Température</p>}
          <p id='strongLine'></p>
          {(props.room.co2 != null) ? renderingCo2() : <p>Aucun problème de CO2</p>}
          <p id='strongLine'></p>
          <Advice advice={props.room.advice} room_id={props.room.room_id} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default RoomsInAlert;
