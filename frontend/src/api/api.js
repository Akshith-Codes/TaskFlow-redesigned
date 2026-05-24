import axios from "axios";

const API= axios.create({
    baseURL: "https://taskflow-redesigned.onrender.com",
    withCredentials:true,
});

export default API;