import {fetchRoom, postAdviceAct} from "../resources/api";
import {useContext} from "react";
import {GlobalContext} from "./GlobalContext";
import React, {useEffect} from 'react';


import Button from '@mui/material/Button';
import CircularProgress from "@mui/joy/CircularProgress";
import Stack from '@mui/material/Stack';

import '../styles/advice.scss';


function Advice(props) {
  const [getAdvice, setAdvice] = React.useState(0); // Use to fetch room from its id
  const [getActed, setActed] = React.useState(false); // Use to set locally if the advice is acted
  const { actedRooms, setActedRooms } = useContext(GlobalContext); // Use to set the rooms in the global context

  useEffect( () => {
    setAdvice(0);
    if(props.advice) {
      setAdvice(props.advice);
      setActed(props.advice.acted);
    };
  }, [props.advice]);

  // When the user click on the button to act
  const onAct = () => {
      postAdviceAct(getAdvice.id); // Modify the advice on the api to say that user acted it
      setActed(true);
      setActedRooms([
        ...actedRooms,
        props.room_id
      ]);
  };

  const renderAdvice = () => {
    return (
      <>
        <p>{getAdvice.sentence}</p>
        {(getActed || actedRooms.includes(props.room_id)) ?
          <Button sx={{width: "150px"}} variant="contained"  disabled> conseil suivi </Button> // Already acted
          :
          <Button sx={{width: "150px"}} variant="contained" onClick={onAct}> J'ai agi </Button> // Not yet acted
        }
      </>
    );
  };

  return (
      <div className="advice">
        <h3>Conseil</h3>
        {(getAdvice != 0) ?
          renderAdvice()
          :
          <p>Aucun conseil à donner pour le moment</p>
        }
      </div>
    );
}

export default Advice;