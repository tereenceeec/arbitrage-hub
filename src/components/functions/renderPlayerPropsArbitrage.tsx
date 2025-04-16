import React, { JSX } from 'react';

interface Outcome {
  name: string;
  price: number;
  point?: number;
  description: string; // Player name
}

interface Market {
  key: string;
  outcomes: Outcome[];
}

interface Bookmaker {
  key: string;
  title: string;
  markets?: Market[];
}

interface Game {
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

const calculateImpliedProbability = (odds: number) => 1 / odds;

const checkArbitrage = (overOdds: number, underOdds: number) => {
  const probOver = calculateImpliedProbability(overOdds);
  const probUnder = calculateImpliedProbability(underOdds);
  return probOver + probUnder < 1;
};

const extractPlayerAssists = (markets?: Market[]) =>
  markets?.find((m) => m.key === 'player_assists');

export const renderPlayerPropsArbitrageBets = (games: Game[]): JSX.Element => {
  const playerPropsArbitrage: JSX.Element[] = [];

  games.forEach((game) => {
    const players: Record<string, Record<string, { over?: Outcome; under?: Outcome }>> = {};

    game.bookmakers.forEach((bookmaker) => {
      const assistMarket = extractPlayerAssists(bookmaker.markets);
      if (!assistMarket) return;

      assistMarket.outcomes.forEach((outcome) => {
        const playerName = outcome.description;
        if (!players[playerName]) players[playerName] = {};
        if (!players[playerName][bookmaker.title]) players[playerName][bookmaker.title] = {};

        if (outcome.name === 'Over') {
          players[playerName][bookmaker.title].over = outcome;
        } else if (outcome.name === 'Under') {
          players[playerName][bookmaker.title].under = outcome;
        }
      });
    });

    Object.entries(players).forEach(([playerName, books]) => {
      const bookmakers = Object.entries(books);
      for (let i = 0; i < bookmakers.length; i++) {
        const [bk1, odds1] = bookmakers[i];
        for (let j = 0; j < bookmakers.length; j++) {
          if (i === j) continue;
          const [bk2, odds2] = bookmakers[j];

          if (
            odds1.over &&
            odds2.under &&
            odds1.over.point === odds2.under.point && // ✅ Only match if line is the same
            checkArbitrage(odds1.over.price, odds2.under.price)
          ) {
            playerPropsArbitrage.push(
              <div
                key={`${game.home_team}-${game.away_team}-${playerName}-${bk1}-${bk2}-${odds1.over.point}`}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <strong>{game.home_team} vs {game.away_team}</strong><br />
                <strong>{playerName}</strong> (Assists Market - Line: {odds1.over.point})<br />
                {bk1} (Over): {odds1.over.price}<br />
                {bk2} (Under): {odds2.under.price}<br />
                <strong style={{ color: 'red' }}>Arbitrage Opportunity!</strong>
              </div>
            );
          }
          
        }
      }
    });
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        padding: '20px',
      }}
    >
      {playerPropsArbitrage}
    </div>
  );
};
