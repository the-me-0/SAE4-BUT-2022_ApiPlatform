const fetchRooms = () => {
    return fetch('http://localhost:8000/api/rooms');
};

const fetchAlerts = () => {
    return fetch('http://localhost:8000/api/rooms/alerts');
};

const fetchLastData = async (tag) => {
    return fetch(`http://localhost:8000/api/rooms/${tag}/lastdata`);
};

const postAdviceAct = async (adviceID) => {
    fetch(`http://localhost:8000/api/advice/${adviceID}/act`);
};

const fetchRoom = async (room) => {
    return fetch(`http://localhost:8000/api/rooms/${room}`);
};

export { fetchRooms, fetchAlerts, fetchLastData, postAdviceAct, fetchRoom };
