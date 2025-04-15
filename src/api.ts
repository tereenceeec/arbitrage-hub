import axios from 'axios';

const API_URL = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds/';
const API_KEY = 'b52a9454e4debad17c2d97210ef9e90c';

export const fetchH2HOdds = async () => {
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

export const fetchSpreadOdds = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        regions: 'au',
        markets: 'spreads',
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
};

export const fetchTotalOdds = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        regions: 'au',
        markets: 'totals',
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
};