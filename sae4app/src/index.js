import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ContextProvider } from './components/GlobalContext';

/* Router */
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* Components includes */
import App from './App';
import Home from './components/Home';
import RoomsInAlert from './components/RoomsInAlert';
import Login from './components/Login';

// router creation
const router = createBrowserRouter([
    {
      path: "/",
      element: (
          <ContextProvider>
          <App />
          </ContextProvider>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: '/alerts',
          element: <RoomsInAlert />
        
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
