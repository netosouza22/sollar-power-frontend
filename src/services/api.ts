import axios from 'axios';
import { parseCookies } from 'nookies';

const {auth_token} = parseCookies();

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
      }
})

if(auth_token){
    api.defaults.headers['Authorization'] = `Bearer ${auth_token}`;
}

export { api };

