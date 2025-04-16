import React, { JSX, useEffect, useState } from 'react';
import { fetchH2HOdds, fetchSpreadOdds, fetchTotalOdds, fetchGameIds } from '../api';
import { renderArbitrageBets, Game } from '../components/functions/renderArbitrageBets';
import { renderOdds } from '../components/functions/renderOdds';

const H2hSpreadTotal = () => {
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

export default H2hSpreadTotal;
