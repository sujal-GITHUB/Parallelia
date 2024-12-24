import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api/v1";

export const signUp = async (data: { username: string; password: string; role: string }) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Error response from the backend
      throw new Error(error.response.data.message || "Something went wrong.");
    } else {
      // Network or other errors
      throw new Error("Network error or invalid response.");
    }
  }
};
