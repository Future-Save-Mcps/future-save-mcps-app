import axios from "axios";
import { baseUrl } from "../features/api/apiSlice";
import { getTokens } from "./tokenManager";
import { toast } from "react-toastify";


export async function fetchAndStoreUserData() {
    const accessToken =  getTokens().accessToken
    try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        const response = await axios.get(`${baseUrl}user`);

        localStorage.setItem("userInfo", JSON.stringify(response.data));
    } catch (error) {
        toast.error("Failed to fetch user data")
        throw error; 
    }
}
