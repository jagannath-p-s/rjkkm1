// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import PointsTable from './PointsTable';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        {authenticated ? (
          <PointsTable />
        ) : (
          <LoginPage setAuthenticated={setAuthenticated} />
        )}
      </div>
    </Router>
  );
}

export default App;
