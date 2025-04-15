import React, { JSX, useEffect, useState } from 'react';
import { fetchH2HOdds, fetchSpreadOdds, fetchTotalOdds } from '../api';

const App = () => {
  interface Outcome {
    name: string;
    price: number;
    point?: number;
  }

  interface Market {
    key: string;
    outcomes: Outcome[];
  }

  interface Bookmaker {
    key: string;
    title: string;
    markets: Market[];
  }

  interface Game {
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
  }

  const [h2hOdds, setH2HOdds] = useState<Game[]>([]);
  const [spreadOdds, setSpreadOdds] = useState<Game[]>([]);
  const [totalOdds, setTotalOdds] = useState<Game[]>([]);

  useEffect(() => {
    const getOdds = async () => {
      try {
        const h2hData = await fetchH2HOdds();
        const spreadData = await fetchSpreadOdds();
        const totalData = await fetchTotalOdds();

        setH2HOdds(h2hData);
        setSpreadOdds(spreadData);
        setTotalOdds(totalData);
      } catch (error) {
        console.error('Failed to fetch odds:', error);
      }
    };

    getOdds();
  }, []);

  const calculateImpliedProbability = (odds: number) => 1 / odds;

  const checkArbitrage = (homeOdds: number, awayOdds: number) => {
    const homeProb = calculateImpliedProbability(homeOdds);
    const awayProb = calculateImpliedProbability(awayOdds);
    return homeProb + awayProb < 1;
  };

  const extractMarket = (markets: Market[], key: string) =>
    markets.find(m => m.key === key);

  const renderArbitrageBets = (games: Game[], marketKey: string): JSX.Element[] => {
    const bets: JSX.Element[] = [];
    games.forEach(game => {
      game.bookmakers.forEach(b1 => {
        game.bookmakers.forEach(b2 => {
          if (b1.key !== b2.key) {
            const m1 = extractMarket(b1.markets, marketKey);
            const m2 = extractMarket(b2.markets, marketKey);
            if (m1 && m2) {
              const o1 = m1.outcomes.find(o => o.name === game.home_team);
              const o2 = m2.outcomes.find(o => o.name === game.away_team);
              if (o1 && o2 && checkArbitrage(o1.price, o2.price)) {
                bets.push(
                  <li key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${marketKey}`}>
                    <strong>{game.home_team} vs {game.away_team}</strong>
                    <br />
                    {b1.title} (Home): {o1.name} @ {o1.price}
                    <br />
                    {b2.title} (Away): {o2.name} @ {o2.price}
                    <br /><strong style={{ color: 'red' }}>Arbitrage Opportunity!</strong>
                  </li>
                );
              }
            }
          }
        });
      });
    });
    return bets;
  };

  const renderOdds = (games: Game[], marketKey: string): JSX.Element[] => {
    return games.map(game => (
      <div key={`${game.home_team}-${game.away_team}-${marketKey}`}
           style={{ borderBottom: '1px solid #ccc', marginBottom: '1em', paddingBottom: '1em' }}>
        <strong>{game.home_team} vs {game.away_team}</strong>
        <ul>
          {game.bookmakers.map(b => {
            const market = extractMarket(b.markets, marketKey);
            if (!market) return null;
            return (
              <li key={`${b.key}-${marketKey}`}>
                <strong>{b.title}</strong>
                <ul>
                  {market.outcomes.map(outcome => (
                    <li key={outcome.name}>
                      {outcome.name}: {outcome.price}
                      {outcome.point !== undefined ? ` (Points: ${outcome.point})` : ''}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    ));
  };

  const h2hArbs = renderArbitrageBets(h2hOdds, 'h2h');
  const spreadArbs = renderArbitrageBets(spreadOdds, 'spreads');
  const totalArbs = renderArbitrageBets(totalOdds, 'totals');

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ width: '32%' }}>
        <h2>H2H Arbitrage</h2>
        <ul>{h2hArbs.length ? h2hArbs : <li>No arbitrage found.</li>}</ul>
        <h2>H2H Odds</h2>
        {renderOdds(h2hOdds, 'h2h')}
      </div>
      <div style={{ width: '32%' }}>
        <h2>Spread Arbitrage</h2>
        <ul>{spreadArbs.length ? spreadArbs : <li>No arbitrage found.</li>}</ul>
        <h2>Spread Odds</h2>
        {renderOdds(spreadOdds, 'spreads')}
      </div>
      <div style={{ width: '32%' }}>
        <h2>Total Arbitrage</h2>
        <ul>{totalArbs.length ? totalArbs : <li>No arbitrage found.</li>}</ul>
        <h2>Total Odds</h2>
        {renderOdds(totalOdds, 'totals')}
      </div>
    </div>
  );
};

export default App;
