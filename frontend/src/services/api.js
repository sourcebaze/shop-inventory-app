import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(config=>{const token=localStorage.getItem('stockwise_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401){localStorage.removeItem('stockwise_token');localStorage.removeItem('stockwise_user');if(location.pathname!=='/login')location.href='/login'}return Promise.reject(e)});export default api;
