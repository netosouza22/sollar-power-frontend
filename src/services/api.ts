import axios from 'axios';

type apiRequest = {
    api: string
    setToken: () => void
}

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'token <your-token-here> -- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
      }
})

const setToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }


export { api, setToken };
