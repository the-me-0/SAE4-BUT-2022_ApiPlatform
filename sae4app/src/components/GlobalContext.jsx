import { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
    const [role, setRole] = useState(() => {
        const storedRole = localStorage.getItem('role');
        return storedRole ? storedRole : 'user';
    });

    const [actedRooms, setActedRooms] = useState([]);

    useEffect(() => {
        localStorage.setItem('role', role);
    }, [role]);

    return (
        <GlobalContext.Provider value={{ role, setRole, actedRooms, setActedRooms }}>
            {children}
        </GlobalContext.Provider>
    );
};
