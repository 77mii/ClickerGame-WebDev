
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Game from './Game';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<PrivateRoute component={Game} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

const PrivateRoute: React.FC<{ component: React.FC }> = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default App;