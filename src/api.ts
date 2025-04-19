import axios from 'axios';

const API_ODDS_URL = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
const API_EVENTS_URL = 'https://api.the-odds-api.com/v4/sports/basketball_nba/events';
const API_ODDS_URL_AFL = 'https://api.the-odds-api.com/v4/sports/aussierules_afl/odds';
const API_EVENTS_URL_AFL = 'https://api.the-odds-api.com/v4/sports/aussierules_afl/events';
const API_KEY = [
  'f90f511bc98e64f919a5317db8c220dc',
  'e237fae64b503a4d4d409eb00e230e68',
  '239dae407857a2200fd9ab284c03aa6d',
  'e34374422b34c4e7e898f89ca1cf8ef7',
  'b52a9454e4debad17c2d97210ef9e90c',
  'e5353f118308573f9d6e8af041131ffe',
  '454e54ff8674e4ee4944ad3d6398d5c7',
  '3a150273e700425461b272f525879a27',
  '296097ed38f27f86c4a02719eb317b1c',
  '5c49878f744603e60af91ffa91b0a58c',
  '1d4fe4a2849abc4b0c147c8c6ec8de6f',
  '3461f12ae8f23705d615214564c32ce4',
  'c5aae7b5e3d8e8a837568764429cd325',
  '5e53ed988250f7045fa425fc514a5be6',
  '11e3f36bc45e3d1cd1b17856fd994427',
  '90e25b6abecf7d83e54ac17b0a348c88',
  '3983324d543aa2834a50724435fa1e18',
];

let currentKeyIndex = 0;

const handle401 = async (originalFunction: () => Promise<any>) => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
  console.warn(`API key ${API_KEY[currentKeyIndex]} unauthorized. Switching to next key.`);
  return originalFunction();
};

const fetchOdds = async (markets: string): Promise<any> => {
  try {
    const response = await axios.get(API_ODDS_URL, {
      params: {
        regions: 'au',
        markets,
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchOdds(markets));
    console.error(`Error fetching odds for ${markets}:`, error);
    throw error;
  }
};

export const fetchH2HOdds = () => fetchOdds('h2h');
export const fetchSpreadOdds = () => fetchOdds('spreads');
export const fetchTotalOdds = () => fetchOdds('totals');

// Fetch alternate totals market
export const fetchAlternateTotals = async (eventIds: string[]): Promise<any[]> => {
  try {
    const requests = eventIds.map(id =>
      axios.get(`https://api.the-odds-api.com/v4/sports/basketball_nba/events/${id}/odds`, {
        params: {
          regions: 'au',
          markets: 'alternate_totals',  // Request alternate totals
          apiKey: API_KEY[currentKeyIndex],
        },
      })
    );
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchAlternateTotals(eventIds));
    console.error('Error fetching alternate totals:', error);
    return [];
  }
};

// Fetch alternate spreads market
export const fetchAlternateSpreads = async (eventIds: string[]): Promise<any[]> => {
  try {
    const requests = eventIds.map(id =>
      axios.get(`https://api.the-odds-api.com/v4/sports/basketball_nba/events/${id}/odds`, {
        params: {
          regions: 'au',
          markets: 'alternate_spreads',  // Request alternate spreads
          apiKey: API_KEY[currentKeyIndex],
        },
      })
    );
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchAlternateSpreads(eventIds));
    console.error('Error fetching alternate spreads:', error);
    return [];
  }
};


// Fetch game IDs
export const fetchGameIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get(API_EVENTS_URL, {
      params: {
        regions: 'au',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    const data = response.data;
    const ids: string[] = data.map((game: any) => game.id);
    return ids;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchGameIds);
    console.error('Error fetching game IDs:', error);
    return [];
  }
};

// Fetch player props (assists, rebounds, points)
const fetchPlayerProps = async (gameId: string, market: string): Promise<any> => {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/events/${gameId}/odds?apiKey=${API_KEY[currentKeyIndex]}&regions=au&markets=${market}`
    );

    if (res.status === 401) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
      console.warn(`API key ${API_KEY[currentKeyIndex]} unauthorized. Switching to next key.`);
      return fetchPlayerProps(gameId, market);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching player props for ${market}:`, error);
    throw error;
  }
};

export const fetchPlayerPropsAssists = (gameId: string) => fetchPlayerProps(gameId, 'player_assists');
export const fetchPlayerPropsAlternateAssists = (gameId: string) =>
  fetchPlayerProps(gameId, 'player_assists_alternate');

export const fetchPlayerPropsRebounds = (gameId: string) => fetchPlayerProps(gameId, 'player_rebounds');
export const fetchPlayerPropsAlternateRebounds = (gameId: string) =>
  fetchPlayerProps(gameId, 'player_rebounds_alternate');

export const fetchPlayerPropsPoints = (gameId: string) => fetchPlayerProps(gameId, 'player_points');
export const fetchPlayerPropsAlternatePoints = (gameId: string) =>
  fetchPlayerProps(gameId, 'player_points_alternate');



// Fetch AFL odds
export const fetchAFLGameIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get(API_EVENTS_URL_AFL, {
      params: {
        regions: 'au',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    const data = response.data;
    const ids: string[] = data.map((game: any) => game.id);
    return ids;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchAFLGameIds);
    console.error('Error fetching game IDs:', error);
    return [];
  }
};

const fetchAFLOdds = async (markets: string): Promise<any> => {
  try {
    const response = await axios.get(API_ODDS_URL_AFL, {
      params: {
        regions: 'au',
        markets,
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchAFLOdds(markets));
    console.error(`Error fetching odds for ${markets}:`, error);
    throw error;
  }
};

export const fetchAlternateAFLTotals = async (eventIds: string[]): Promise<any[]> => {
  try {
    const requests = eventIds.map(id =>
      axios.get(`https://api.the-odds-api.com/v4/sports/aussierules_afl/events/${id}/odds`, {
        params: {
          regions: 'au',
          markets: 'alternate_totals',
          apiKey: API_KEY[currentKeyIndex],
        },
      })
    );
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchAlternateAFLTotals(eventIds));
    console.error('Error fetching alternate totals:', error);
    return [];
  }
};

export const fetchAlternateAFLSpreads = async (eventIds: string[]): Promise<any[]> => {
  try {
    const requests = eventIds.map(id =>
      axios.get(`https://api.the-odds-api.com/v4/sports/aussierules_afl/events/${id}/odds`, {
        params: {
          regions: 'au',
          markets: 'alternate_spreads',
          apiKey: API_KEY[currentKeyIndex],
        },
      })
    );
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchAlternateAFLSpreads(eventIds));
    console.error('Error fetching alternate spreads:', error);
    return [];
  }
};


export const fetchH2HAFLOdds = () => fetchAFLOdds('h2h');
export const fetchSpreadAFLOdds = () => fetchAFLOdds('spreads');
export const fetchTotalAFLOdds = () => fetchAFLOdds('totals');
