import React, { useEffect, useContext } from 'react';
import '../src/styles/style.scss';

/* Router */
import { Outlet } from "react-router-dom";

/* Components includes */
import Base from './components/Base';

/* Styles includes */
import Alert from '@mui/material/Alert';
import './styles/style.scss';

function App() {
  const [error, setError] = React.useState();
  
  return (
    <div id="App">
      <Base />
      {error ? 
        <Alert id='alert' severity="error">{error}</Alert>
      : null}
      <div id="main-content">
        <Outlet context={[error, setError]} />
      </div>
    </div>
  );
}
export default App;
