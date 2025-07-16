import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import WeatherMain from "./components/WeatherMain";
import "./App.css";

function App() {
  const [city, setCity] = useState("Stuttgart");
  const [weather, setWeather] = useState(null);

  const API_KEY = "52bb1cf5596c4f86805191456252004"; // your API key

  const getWeather = async (searchCity) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=6&aqi=no&alerts=no`
      );
      const data = await res.json();

      if (data.location) {
        setWeather(data);
        setCity(searchCity);
      } else {
        alert("City not found!");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    getWeather("Stuttgart");
  }, []);

  return (
    <div className="container">
      <Sidebar onCitySelect={getWeather} city={city} weather={weather} />
      <div className="main-content">
        <WeatherMain city={city} weather={weather} onSearch={getWeather} />
      </div>
    </div>
  );
}

export default App;
