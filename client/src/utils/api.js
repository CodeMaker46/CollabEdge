import axios from 'axios';

const BASE_URL =  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1';


export const getRooms = async ()=>{
    const response = await axios.get(`${BASE_URL}/rooms/${gmail}`);
    return response.data;
}

export const getUserHistory = async (userId) => {
    const res = await axios.get(`${BASE_URL}/history/${email}`) ;
    return res.data;
  };