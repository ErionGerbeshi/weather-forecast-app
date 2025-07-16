import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { FaMapMarkerAlt, FaPlus, FaStar, FaTrash } from "react-icons/fa";
import { WiDaySunny } from "react-icons/wi";

function Sidebar({ onCitySelect, city, weather }) {
  const [favorites, setFavorites] = useState([
    { name: "Stuttgart", location: "Germany" }
  ]);

  // Weather cache for all favorites
  const [weatherCache, setWeatherCache] = useState({});
  const [loadingWeather, setLoadingWeather] = useState({});

  // Fetch weather for all favorites
  useEffect(() => {
    const API_KEY = "52bb1cf5596c4f86805191456252004";
    favorites.forEach(fav => {
      if (!weatherCache[fav.name]) {
        setLoadingWeather(prev => ({ ...prev, [fav.name]: true }));
        fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(fav.name)}`)
          .then(res => res.json())
          .then(data => {
            setWeatherCache(prev => ({ ...prev, [fav.name]: data }));
            setLoadingWeather(prev => ({ ...prev, [fav.name]: false }));
          })
          .catch(() => {
            setWeatherCache(prev => ({ ...prev, [fav.name]: null }));
            setLoadingWeather(prev => ({ ...prev, [fav.name]: false }));
          });
      }
    });
  }, [favorites]);

  const [newCity, setNewCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef(null);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setNewCity(value);
    setSelectedSuggestion(-1);
    if (value.length > 1) {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=YOUR_API_KEY_HERE&q=${value}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (location) => {
    const alreadyExists = favorites.some((fav) => fav.name.toLowerCase() === location.name.toLowerCase());
    if (!alreadyExists) {
      setFavorites((prev) => [
        ...prev,
        { name: location.name, location: location.country },
      ]);
      onCitySelect(location.name);
      setNewCity("");
      setSuggestions([]);
      setSelectedSuggestion(-1);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    } else {
      alert("City is already in favorites!");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const handleAddCity = () => {
    if (!newCity.trim()) return;
    let cityToAdd = null;
    if (suggestions.length > 0 && selectedSuggestion >= 0) {
      cityToAdd = suggestions[selectedSuggestion];
    } else if (suggestions.length > 0) {
      cityToAdd = suggestions[0];
    } else {
      cityToAdd = { name: newCity.trim(), country: "" };
    }
    const alreadyExists = favorites.some((fav) => fav.name.toLowerCase() === cityToAdd.name.toLowerCase());
    if (!alreadyExists) {
      setFavorites((prev) => [
        ...prev,
        { name: cityToAdd.name, location: cityToAdd.country },
      ]);
      onCitySelect(cityToAdd.name);
      setNewCity("");
      setSuggestions([]);
      setSelectedSuggestion(-1);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    } else {
      alert("City is already in favorites!");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const handleInputKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestion]);
        } else {
          handleAddCity();
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAddCity();
    }
  };

  // Utility to title-case a string
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Find the most recently added favorite (last in the array)
  const topFavorite = favorites.length > 0 ? favorites[favorites.length - 1] : { name: "Wanchac", location: "Cusco, Peru" };
  // Get temperature and condition if available
  let topTemp = "--°C";
  let topCond = "";
  if (weatherCache[topFavorite.name] && weatherCache[topFavorite.name].current) {
    topTemp = `${weatherCache[topFavorite.name].current.temp_c}°C`;
    topCond = weatherCache[topFavorite.name].current.condition.text;
  } else if (loadingWeather[topFavorite.name]) {
    topTemp = "...";
  } else if (weatherCache[topFavorite.name] === null) {
    topTemp = "N/A";
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <WiDaySunny className="weather-icon" />
          <h2>Weather</h2>
        </div>

        <div className="location-card">
          <FaMapMarkerAlt className="location-icon" />
          <div>
            <h4>{toTitleCase(topFavorite.name)}</h4>
            <small>{toTitleCase(topFavorite.location)}</small>
            <div className="temp-badge">{topTemp}</div>
            {topCond && <div style={{fontSize:'0.9em',color:'#ccc'}}>{topCond}</div>}
          </div>
        </div>

        <div className="favorites">
          <h5 className="favorites-title">
            <FaStar className="star-icon" /> Favorites
          </h5>
          <ul>
            {favorites.map((city, index) => {
              let temp = "--°C";
              if (weatherCache[city.name] && weatherCache[city.name].current) {
                temp = `${weatherCache[city.name].current.temp_c}°C`;
              } else if (loadingWeather[city.name]) {
                temp = "...";
              } else if (weatherCache[city.name] === null) {
                temp = "N/A";
              }
              return (
                <li
                  key={index}
                  className="favorite-item"
                >
                  <div className="favorite-info" onClick={() => onCitySelect(city.name)}>
                    <strong>{toTitleCase(city.name)}</strong>
                    <br />
                    <span>{toTitleCase(city.location)}</span>
                  </div>
                  <span style={{marginLeft:8, fontWeight:600}}>{temp}</span>
                  <button
                    className="remove-fav-btn"
                    title="Remove"
                    onClick={() => setFavorites(favorites.filter((_, i) => i !== index))}
                  >
                    <FaTrash />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="add-city-bottom">
        <div className="add-city-group center-horizontal">
          <input
            type="text"
            className="city-input"
            placeholder="Type city..."
            value={newCity}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            ref={inputRef}
            aria-label="Type city"
            autoFocus
          />
          <button
            className="add-btn always-visible"
            onClick={handleAddCity}
            style={{ marginTop: 0 }}
            aria-label="Add City"
            tabIndex={0}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleAddCity(); } }}
          >
            <FaPlus />
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="autocomplete-list">
            {suggestions.map((s, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionSelect(s)}
                className={`autocomplete-item${index === selectedSuggestion ? " selected" : ""}`}
                tabIndex={0}
                onKeyDown={e => { if (e.key === "Enter") handleSuggestionSelect(s); }}
                aria-label={`Select ${s.name}, ${s.country}`}
              >
                {s.name}, {s.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="footer">
        <p>
          Designed by{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jean Paul E.
          </a>
        </p>
      </footer>
    </aside>
  );
}

export default Sidebar;
