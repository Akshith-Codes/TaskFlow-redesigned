import axios from "axios";

const API= axios.create({
    baseURL: "https://task-flow-redesigned.vercel.app",
    withCredentials:true,
});

export default API;