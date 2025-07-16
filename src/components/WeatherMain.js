import React, { useState } from "react";
import DailyForecast from "./DailyForecast";
import "./WeatherMain.css";

function WeatherMain({ city, weather, onSearch }) {
  const [inputCity, setInputCity] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      onSearch(inputCity.trim());
      setInputCity("");
    }
  };

  return (
    <div className="weather-main">
      <form onSubmit={handleSearch} className="weather-search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      {weather && (
        <>
          <div className="weather-card text-center mb-4">
            <h1>{weather.current.temp_c}°C</h1>
            <h4>{weather.current.condition.text}</h4>
            <p>
              {weather.location.name}, {weather.location.country} • Feels like{" "}
              {weather.current.feelslike_c}°C
            </p>
          </div>

          <DailyForecast forecast={weather.forecast} />
        </>
      )}
    </div>
  );
}

export default WeatherMain;
