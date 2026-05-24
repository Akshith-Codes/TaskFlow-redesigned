import axios from "axios";

const API= axios.create({
    baseURL: "https://taskflow-redesigned.onrender.com/api",
    withCredentials:true,
});

export default API;