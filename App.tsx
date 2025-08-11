import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sales from './pages/Sales';
import GatePass from './pages/GatePass';
import Picking from './pages/picking'; // You'll create this next
import PickDisplay from './pages/PickDisplay'; // Importing the pick_display component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>POS System Frontend</h1>

          {/* Navigation */}
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/" style={{ marginRight: '10px' }}>Sales</Link>
            <Link to="/gatepass">Gate Pass</Link>
            <Link to="/picking "style={{ marginLeft: '10px' }}>Picking</Link>
            <Link to="/pickdisplay" style={{ marginLeft: '10px' }}>Pick Display</Link>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Sales />} />
            <Route path="/gatepass" element={<GatePass />} />
            <Route path="/picking" element={<Picking />} />
            <Route path="/pickdisplay" element={<PickDisplay />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
