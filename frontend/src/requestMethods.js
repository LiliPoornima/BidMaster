import axios from 'axios';

export const publicRequest = axios.create({
    baseURL: 'http://localhost:5000'
});