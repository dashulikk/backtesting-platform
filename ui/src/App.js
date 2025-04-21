import Login from "./Login"
import Signup from "./Signup";
import Home from "./Home";
import CreateEnvironmentPage from "./components/CreateEnvironmentPage";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route
          path="/signup"
          element={
            <Signup/>
          }
        />
        <Route
          path="/login"
          element={
            <Login/>
          }
        />
      </Routes>
    </Router>
  )
}

export default App;