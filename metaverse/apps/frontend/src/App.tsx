import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import SpacePage from './pages/SpacePage';
import Main from './pages/Main';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* The root path will use the Landing component */}
        <Route path="/" element={<Landing />} />
        
        {/* SpacePage will be used for space creation */}
        <Route path="/space" element={<SpacePage />} />
        
        {/* /arena will display the Main component */}
        <Route
          path="/arena"
          element={<Main />} // Main component will access spaceData through useLocation
        />
      </Routes>
    </Router>
  );
};

export default App;
