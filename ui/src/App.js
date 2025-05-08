import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './Home';
import HomePage from "./components/HomePage";
import EnvironmentsPage from "./components/EnvironmentsPage";
import CreateEnvironmentPage from "./components/CreateEnvironmentPage";
import StrategiesPage from "./components/StrategiesPage";
import BacktestingResultsPage from "./components/BacktestingResultsPage";
import StrategyInfoPage from "./components/StrategyInfoPage";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="environments" element={<EnvironmentsPage />} />
            <Route path="create-environment" element={<CreateEnvironmentPage />} />
            <Route path="strategies" element={<StrategiesPage />} />
            <Route path="strategy-info" element={<StrategyInfoPage />} />
            <Route path="backtesting-results" element={<BacktestingResultsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;