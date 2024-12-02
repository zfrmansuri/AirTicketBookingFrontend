import axios from "axios";

const BASE_URL = "https://localhost:7136/api";

export const searchFlights = async (origin, destination, date) => {
  try {
    const formattedDate = date ? date.toISOString().split("T")[0] : null; // Ensure date is formatted
    const response = await axios.get(`${BASE_URL}/Flight/SearchFlights`, {
      params: { origin, destination, date: formattedDate },
    });
    return response;
  } catch (error) {
    console.error("Error fetching flights:", error.response?.data?.message);
    throw error;
  }
};


export const getFlightDetails = async (flightId) => {
  const response = await axios.get(`${BASE_URL}/Flight/GetFlightDetails/${flightId}`);
  return response.data;
};
