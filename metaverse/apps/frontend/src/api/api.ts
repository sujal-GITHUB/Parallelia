import axios from "axios";
import {jwtDecode} from "jwt-decode" 

const BACKEND_URL = "http://localhost:3000/api/v1";

interface DecodedToken {
  exp: number; // Expiration time (in seconds)
}

// Sign Up function
export const signUp = async (data: { username: string; password: string; role: string }) => {
  try {
    const modifiedData = {
      username: data.username,
      password: data.password,
      type: data.role.toLowerCase(),
    };

    const response = await axios.post(`${BACKEND_URL}/signup`, modifiedData);
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        userId: response.data.userId,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Something went wrong.";
        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          message: "No response from the server. Please try again later.",
        };
      } else {
        return {
          success: false,
          message: "An error occurred while making the request.",
        };
      }
    } else {
      return {
        success: false,
        message: "Network error or invalid response.",
      };
    }
  }
};

// Sign In function
export const signIn = async (data: { username: string; password: string }) => {
  try {
    const modifiedData = {
      username: data.username,
      password: data.password,
    };

    const response = await axios.post(`${BACKEND_URL}/signin`, modifiedData);

    if (response.data.token) {
      const token = response.data.token;

      // Decode the token to get the expiration time
      const decodedToken: DecodedToken = jwtDecode(token);
      const expiryTime = decodedToken.exp * 1000; // Convert seconds to milliseconds

      // Save token and expiry to localStorage
      localStorage.setItem("Token", token);
      localStorage.setItem("TokenExpiry", expiryTime.toString());

      return {
        success: true,
        token,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Sign in failed. Please check your credentials.",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Something went wrong.";
        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          message: "No response from the server. Please try again later.",
        };
      } else {
        return {
          success: false,
          message: "An error occurred while making the request.",
        };
      }
    } else {
      return {
        success: false,
        message: "Network error or invalid response.",
      };
    }
  }
};

//Create new space
export const spaceCreate = async (data: { spaceName: string, dimensions: string, mapName?: string }) => {
  try {
    // Prepare the payload for the backend
    const payload = {
      name: data.spaceName,
      dimensions: data.dimensions,
      mapName: data.mapName, // Optional mapId field
    };

    // Send the request to the backend to create the space using axios
    const response = await axios.post(`${BACKEND_URL}/space`, payload, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`, // Assuming the token is stored in localStorage
        "Content-Type": "application/json",
      },
    });

    // Success: return spaceId
    if (response.data && response.data.spaceId) {
      console.log(`Space created with ID: ${response.data.spaceId}`);
      return response.data.spaceId;  // Return the spaceId
    } else {
      throw new Error("spaceId not found in the response");
    }
  } catch (error) {
    // Handle errors from axios
    if (axios.isAxiosError(error) && error.response) {
      // Log detailed error response from backend
      console.error("Error creating space:", error.response.data); 
      console.error("Error message:", error.message); 
      throw new Error(error.response?.data?.message || "Failed to create space");
    } else {
      // Log unexpected errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred while creating space");
    }
  }
};

export const joinSpace = async (data: { spaceName: string }) => {
  try {
    // Step 1: Fetch space details using spaceName
    const lookupResponse = await axios.post(
      `${BACKEND_URL}/space/lookup`,
      { name: data.spaceName }, // Only send the name in the request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // If no space is returned in the response
    if (!lookupResponse.data || !lookupResponse.data.id) {
      return {
        success: false,
        message: "Space not found. Please check the Space Name.",
      };
    }

    // Extract space details from the response
    const { id, name, width, height, thumbnail, creatorId } = lookupResponse.data;

    return {
      success: true,
      message: "Space joined successfully!",
      data: {
        spaceId: id,
        name,
        dimensions: `${width}x${height}`,
        thumbnail,
        creatorId,
      },
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Handle specific HTTP errors
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Space not found. Please check the Space Name.",
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || "An unexpected error occurred. Please try again.",
      };
    }

    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
