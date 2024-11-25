import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BikeStation from "./pages/BikeStation";

function App() {
  const [bikeStations, setBikeStations] = useState([]);
  useEffect(() => {
    async function fetchBikeStations() {
      try {
        const response = await fetch("http://localhost:3000/get-data/");
        const data = await response.json();
        setBikeStations(data);
      } catch (error) {
        console.log("Error Fetching Bike Data", error);
      }
    }
    fetchBikeStations();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home bikeStations={bikeStations} />} />
          <Route path="/bike-station" element={<BikeStation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
