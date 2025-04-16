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
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ width: '32%' }}>
        <h2>H2H Arbitrage</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
          {h2hArbs.length ? (
            h2hArbs.map((arb, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {arb}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 2', padding: '1rem', textAlign: 'center' }}>
              No arbitrage found.
            </div>
          )}
        </div>
  
        <h2>H2H Odds</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
          {renderOdds(h2hOdds, 'h2h')}
        </div>
      </div>
  
      {/* Vertical Divider */}
      <div
        style={{
          width: '1px',
          backgroundColor: 'black',  // Black line
          height: 'auto',             // Ensure it spans the height of the parent
          margin: '0 20px',           // Spacing between the sections
        }}
      />
  
      <div style={{ width: '32%' }}>
        <h2>Spread Arbitrage</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
          {spreadArbs.length ? (
            spreadArbs.map((arb, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                {arb}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 2', padding: '1rem', textAlign: 'center' }}>
              No arbitrage found.
            </div>
          )}
        </div>
  
        <h2>Spread Odds</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
          {renderOdds(spreadOdds, 'spreads')}
        </div>
      </div>
  
      {/* Vertical Divider */}
      <div
        style={{
          width: '1px',
          backgroundColor: 'black',  // Black line
          height: 'auto',             // Ensure it spans the height of the parent
          margin: '0 20px',           // Spacing between the sections
        }}
      />
  
      <div style={{ width: '32%' }}>
        <h2>Total Arbitrage</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
          {totalArbs.length ? (
            totalArbs.map((arb, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {arb}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 2', padding: '1rem', textAlign: 'center' }}>
              No arbitrage found.
            </div>
          )}
        </div>
  
        <h2>Total Odds</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
          {renderOdds(totalOdds, 'totals')}
        </div>
      </div>
    </div>
  );
};

export default H2hSpreadTotal;
