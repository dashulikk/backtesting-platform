import Login from "./Login"
import Signup from "./Signup";
import Home from "./Home";
import HomePage from "./components/HomePage";
import EnvironmentsPage from "./components/EnvironmentsPage";
import CreateEnvironmentPage from "./components/CreateEnvironmentPage";
import StrategiesPage from "./components/StrategiesPage";
import BacktestingResultsPage from "./components/BacktestingResultsPage";
import StrategyInfoPage from "./components/StrategyInfoPage";

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<HomePage />} />
          <Route path="environments" element={<EnvironmentsPage />} />
          <Route path="create-environment" element={<CreateEnvironmentPage />} />
          <Route path="strategies" element={<StrategiesPage />} />
          <Route path="strategy-info" element={<StrategyInfoPage />} />
          <Route path="backtesting-results" element={<BacktestingResultsPage />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;