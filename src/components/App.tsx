import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import PlayerPropsAssists from '../pages/playerPropsAssists';
import H2hSpreadTotal from '../pages/h2hSpreadTotal';

const App = () => {
  return (
    <div>
      <nav style={{ marginBottom: '1rem', gap: '30px', display: 'flex' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/h2h-spread-total">H2H - Spreads - Totals</Link>
        <Link to="/player-props-assists">Player Props - Assists</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/h2h-spread-total" element={<H2hSpreadTotal />} />
        <Route path="/player-props-assists" element={<PlayerPropsAssists />} />
      </Routes>
    </div>
  );
};

export default App;
