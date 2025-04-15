import axios from 'axios';

const API_URL = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds/';
const API_KEY = 'b52a9454e4debad17c2d97210ef9e90c';

export const fetchOdds = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        regions: 'au',
        markets: 'h2h',
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
};