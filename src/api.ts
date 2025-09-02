import axios from 'axios';

const API_ODDS_URL_NBA = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
const API_EVENTS_URL_NBA = 'https://api.the-odds-api.com/v4/sports/basketball_nba/events';
const API_ODDS_URL_NFL = 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds';
const API_EVENTS_URL_NFL = 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events';
const API_ODDS_URL_AFL = 'https://api.the-odds-api.com/v4/sports/aussierules_afl/odds';
const API_EVENTS_URL_AFL = 'https://api.the-odds-api.com/v4/sports/aussierules_afl/events';
const API_KEY = [
  '6ceee2dfc8c3728dcb0ea0ecdeb77d10',
  'db94a8cc6e5ad821ae213270d6d0bf0e',
  'c51ffcf14c9b231d13fc2e5040586a64',
  '0916223359750d95a00b7cfba18332bd',
  'eb94feb6200f3db5b8df679e71dc221e',
  'a871fca1e2d6e516b3eb191228439b41',
  '685a24369a5f36db9dbc9128cb713f53',
  '1d7cf0d863db69dfd11c6fb61af7ea64',
  '45ce6a520b6e75eef805e8f1905a48c3',
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
    const response = await axios.get(API_ODDS_URL_NBA, {
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

export const fetchNBAH2HOdds = () => fetchOdds('h2h');
export const fetchNBASpreadOdds = () => fetchOdds('spreads');
export const fetchNBATotalOdds = () => fetchOdds('totals');

// NFL odds
const fetchNFLOdds = async (markets: string): Promise<any> => {
  try {
    const response = await axios.get(API_ODDS_URL_NFL, {
      params: {
        regions: 'au',
        markets,
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(() => fetchNFLOdds(markets));
    console.error(`Error fetching NFL odds for ${markets}:`, error);
    throw error;
  }
};

export const fetchNFLH2HOdds = () => fetchNFLOdds('h2h');
export const fetchNFLSpreadOdds = () => fetchNFLOdds('spreads');
export const fetchNFLTotalOdds = () => fetchNFLOdds('totals');

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
    const response = await axios.get(API_EVENTS_URL_NBA, {
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

// NFL events and alternates
export const fetchNFLGameIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get(API_EVENTS_URL_NFL, {
      params: {
        regions: 'au',
        apiKey: API_KEY[currentKeyIndex],
      },
    });
    const data = response.data;
    const ids: string[] = data.map((game: any) => game.id);
    return ids;
  } catch (error: any) {
    if (error.response?.status === 401) return handle401(fetchNFLGameIds);
    console.error('Error fetching NFL game IDs:', error);
    return [];
  }
};

export const fetchAlternateNFLTotals = async (eventIds: string[]): Promise<any[]> => {
  try {
    const requests = eventIds.map(id =>
      axios.get(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${id}/odds`, {
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
    if (error.response?.status === 401) return handle401(() => fetchAlternateNFLTotals(eventIds));
    console.error('Error fetching NFL alternate totals:', error);
    return [];
  }
};

export const fetchAlternateNFLSpreads = async (eventIds: string[]): Promise<any[]> => {
  try {
    const requests = eventIds.map(id =>
      axios.get(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${id}/odds`, {
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
    if (error.response?.status === 401) return handle401(() => fetchAlternateNFLSpreads(eventIds));
    console.error('Error fetching NFL alternate spreads:', error);
    return [];
  }
};

// Fetch player props NBA (assists, rebounds, points) with retry on 401/429
const fetchPlayerPropsNBA = async (gameId: string, market: string, attempt: number = 0): Promise<any> => {
  const maxAttempts = 4;
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/events/${gameId}/odds?apiKey=${API_KEY[currentKeyIndex]}&regions=au&markets=${market}`
    );

    if (res.status === 401) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
      console.warn(`API key ${API_KEY[currentKeyIndex]} unauthorized. Switching to next key.`);
      if (attempt + 1 >= maxAttempts) return await res.json();
      return fetchPlayerPropsNBA(gameId, market, attempt + 1);
    }
    if (res.status === 429) {
      // Rotate key and backoff briefly
      currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
      const delayMs = 300 * (attempt + 1);
      await new Promise((r) => setTimeout(r, delayMs));
      if (attempt + 1 >= maxAttempts) return await res.json();
      return fetchPlayerPropsNBA(gameId, market, attempt + 1);
    }

    return await res.json();
  } catch (error) {
    if (attempt + 1 < maxAttempts) {
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      return fetchPlayerPropsNBA(gameId, market, attempt + 1);
    }
    console.error(`Error fetching player props for ${market}:`, error);
    throw error;
  }
};

export const fetchPlayerPropsAssists = (gameId: string) => fetchPlayerPropsNBA(gameId, 'player_assists');
export const fetchPlayerPropsAlternateAssists = (gameId: string) =>
  fetchPlayerPropsNBA(gameId, 'player_assists_alternate');

export const fetchPlayerPropsRebounds = (gameId: string) => fetchPlayerPropsNBA(gameId, 'player_rebounds');
export const fetchPlayerPropsAlternateRebounds = (gameId: string) =>
  fetchPlayerPropsNBA(gameId, 'player_rebounds_alternate');

export const fetchPlayerPropsPoints = (gameId: string) => fetchPlayerPropsNBA(gameId, 'player_points');
export const fetchPlayerPropsAlternatePoints = (gameId: string) =>
  fetchPlayerPropsNBA(gameId, 'player_points_alternate');

// Fetch player props NFL with retry on 401/429
const fetchPlayerPropsNFL = async (gameId: string, market: string, attempt: number = 0): Promise<any> => {
  const maxAttempts = 4;
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${gameId}/odds?apiKey=${API_KEY[currentKeyIndex]}&regions=au&markets=${market}`
    );

    if (res.status === 401) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
      console.warn(`API key ${API_KEY[currentKeyIndex]} unauthorized. Switching to next key.`);
      if (attempt + 1 >= maxAttempts) return await res.json();
      return fetchPlayerPropsNFL(gameId, market, attempt + 1);
    }
    if (res.status === 429) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
      const delayMs = 300 * (attempt + 1);
      await new Promise((r) => setTimeout(r, delayMs));
      if (attempt + 1 >= maxAttempts) return await res.json();
      return fetchPlayerPropsNFL(gameId, market, attempt + 1);
    }

    return await res.json();
  } catch (error) {
    if (attempt + 1 < maxAttempts) {
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      return fetchPlayerPropsNFL(gameId, market, attempt + 1);
    }
    console.error(`Error fetching NFL player props for ${market}:`, error);
    throw error;
  }
};

export const fetchNFLPlayerPropsPoints = (gameId: string) => fetchPlayerPropsNFL(gameId, 'player_points');
export const fetchNFLPlayerPropsAlternatePoints = (gameId: string) =>
  fetchPlayerPropsNFL(gameId, 'player_points_alternate');

export const fetchNFLPlayerPropsRebounds = (gameId: string) => fetchPlayerPropsNFL(gameId, 'player_rebounds');
export const fetchNFLPlayerPropsAlternateRebounds = (gameId: string) =>
  fetchPlayerPropsNFL(gameId, 'player_rebounds_alternate');

export const fetchNFLPlayerPropsAssists = (gameId: string) => fetchPlayerPropsNFL(gameId, 'player_assists');
export const fetchNFLPlayerPropsAlternateAssists = (gameId: string) =>
  fetchPlayerPropsNFL(gameId, 'player_assists_alternate');

// NFL QB markets
export const fetchNFLPlayerPropsPassYds = (gameId: string) => fetchPlayerPropsNFL(gameId, 'player_pass_yds');

export const fetchNFLPlayerPropsPassTds = (gameId: string) => fetchPlayerPropsNFL(gameId, 'player_pass_tds');



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
