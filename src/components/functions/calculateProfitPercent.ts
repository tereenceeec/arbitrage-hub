export const calculateProfitPercent = (oddsA: number, oddsB: number, stake: number): number => {
    const isValid = !isNaN(oddsA) && !isNaN(oddsB) && !isNaN(stake);
    if (!isValid) return 0;
  
    const arbPercent = (1 / oddsA) + (1 / oddsB);
    if (arbPercent >= 1) return 0;
  
    const betA = (stake * (1 / oddsA)) / arbPercent;
    const betB = (stake * (1 / oddsB)) / arbPercent;
  
    const payoutA = betA * oddsA;
    const payoutB = betB * oddsB;
  
    const guaranteedReturn = Math.min(payoutA, payoutB);
    const profit = guaranteedReturn - stake;
    const profitPercent = (profit / stake) * 100;
  
    return profitPercent;
  };
  