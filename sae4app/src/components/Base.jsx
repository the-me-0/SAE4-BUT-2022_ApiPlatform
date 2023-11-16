import React from 'react';
import '../styles/base.scss';
import Menu from '@mui/icons-material/Menu';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import Stack from '@mui/material/Stack';
import { height } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import SecurityIcon from '@mui/icons-material/Security';
import { GlobalContext } from './GlobalContext';
import { useContext } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Base = () => {
    const openNav = () => {
    const sidenav = document.getElementById("mySidenav");
    sidenav.classList.add("active");
    };
    const { role } = useContext(GlobalContext);

  const closeNav = () => {
    const sidenav = document.getElementById("mySidenav");
    sidenav.classList.remove("active");
  };

  return (
    <div id="topBar">
      <h1 id='title'>SmartCampus</h1>
        <div id="mySidenav" className="sidenav">
        <a id="closeBtn" href="#" className="close" onClick={closeNav}>×</a>
          <div id='menuContainer'>
            <ul>
              <li><a href="/">Accueil</a></li>
              {role === 'admin' ? <li><a href="/alerts">Salles en alerte</a></li> : null}
              <li><a href="/login">Se connecter</a></li>
            </ul>
            <div id='roleContainer'>
              <p>Connecté en tant que role </p>
                {
                  role === 'user' ? <p className='roleText'>user<span className='roleIcon'><AccountCircleIcon/></span></p> 
                  : <p className='roleText'>admin<span className='roleIcon'><SecurityIcon/></span></p> 
                }
            </div>
          </div>
      </div>
      <a href="#" id="openBtn" onClick={openNav}>
        <span className="burger-icon">
            <Menu fontSize='large' id='menu'/>
        </span>
      </a>
    </div>
  );
};

export default Base;
