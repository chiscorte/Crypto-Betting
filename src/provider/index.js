import Axios from "axios";
export const axios = Axios;
//export const baseURL = "http://localhost:5000/api";
export const baseURL = `${process.env.REACT_APP_BACKEND_URL}/api`;
