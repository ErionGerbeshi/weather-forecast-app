import React from "react";
import "./DailyForecast.css";

function DailyForecast({ forecast }) {
  const days = forecast?.forecastday || [];

  return (
    <div className="daily-forecast-grid">
      {days.map((day, index) => (
        <div key={index} className="forecast-tile">
          <h5>{new Date(day.date).toDateString()}</h5>
          <img
            src={day.day.condition.icon}
            alt={day.day.condition.text}
            className="forecast-icon"
          />
          <p className="condition-text">{day.day.condition.text}</p>
          <p className="temp-range">
            <strong>{day.day.maxtemp_c}°</strong> / {day.day.mintemp_c}°
          </p>
        </div>
      ))}
    </div>
  );
}

export default DailyForecast;
