import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlightSearch from "./Components/FlightSearch";
import FlightListPage from "./Pages/FlightListPage";
import SeatSelectionPage from "./Components/SeatSelection";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Header from "./Pages/Header";
import "./App.css"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<FlightSearch />} />
        <Route path="/flights" element={<FlightListPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seat-selection/:flightId" element={<SeatSelectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
