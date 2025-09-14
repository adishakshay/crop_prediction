import React, { useState, useEffect, useContext } from "react";
import { indiaStates } from "./../services/indiaStates";
import "./../styles/Weather.css";
import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";

const Weather = () => {
  const { lang } = useContext(LanguageContext);
  const t = languages[lang];

  const [selectedState, setSelectedState] = useState(indiaStates[0]);
  const [selectedCity, setSelectedCity] = useState(indiaStates[0].cities[0]);
  const [weatherCurrent, setWeatherCurrent] = useState(null);
  const [weatherHourly, setWeatherHourly] = useState([]);
  const [weatherPast10Days, setWeatherPast10Days] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchWeather = async (cityObj) => {
    setLoading(true);
    try {
      const { lat, lon } = cityObj;
      const today = new Date();
      const currentDateStr = formatDate(today);

      const pastStartDate = new Date(today);
      pastStartDate.setDate(today.getDate() - 10);
      const pastStartDateStr = formatDate(pastStartDate);

      const next24HoursDate = new Date(today);
      next24HoursDate.setDate(today.getDate() + 1);
      const next24DateStr = formatDate(next24HoursDate);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&start_date=${pastStartDateStr}&end_date=${next24DateStr}&current_weather=true`
      );
      const data = await res.json();

      setWeatherCurrent(data.current_weather);

      const pastData = {};
      data.hourly.time.forEach((timeStr, idx) => {
        const dateStr = timeStr.split("T")[0];
        const timeHour = new Date(timeStr).getHours();
        if (dateStr < currentDateStr) {
          if (!pastData[dateStr]) pastData[dateStr] = [];
          pastData[dateStr].push({
            hour: timeHour,
            temperature: data.hourly.temperature_2m[idx],
            humidity: data.hourly.relative_humidity_2m[idx],
            wind: data.hourly.wind_speed_10m[idx],
          });
        }
      });
      setWeatherPast10Days(pastData);

      const next24Hours = [];
      data.hourly.time.forEach((timeStr, idx) => {
        const dateObj = new Date(timeStr);
        const dateStr = dateObj.toISOString().split("T")[0];
        if (dateStr === currentDateStr || dateStr === next24DateStr) {
          next24Hours.push({
            time: dateObj,
            temperature: data.hourly.temperature_2m[idx],
            humidity: data.hourly.relative_humidity_2m[idx],
            wind: data.hourly.wind_speed_10m[idx],
          });
        }
      });
      setWeatherHourly(next24Hours.slice(0, 24));
    } catch (err) {
      console.error("Failed to fetch weather data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
    const interval = setInterval(() => fetchWeather(selectedCity), 300000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const handleStateChange = (e) => {
    const stateObj = indiaStates.find((s) => s.state === e.target.value);
    setSelectedState(stateObj);
    setSelectedCity(stateObj.cities[0]);
  };

  const handleCityChange = (e) => {
    const cityObj = selectedState.cities.find((c) => c.name === e.target.value);
    setSelectedCity(cityObj);
  };

  return (
    <div className="weather-container">
      <h1 className="weather-title">{t.weatherTitle}</h1>

      {/* State & City Dropdowns */}
      <div className="weather-search">
        <select
          className="weather-select"
          value={selectedState.state}
          onChange={handleStateChange}
        >
          {indiaStates.map((s) => (
            <option key={s.state} value={s.state}>{s.state}</option>
          ))}
        </select>

        <select
          className="weather-select"
          value={selectedCity.name}
          onChange={handleCityChange}
        >
          {selectedState.cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <button
          className="weather-button"
          onClick={() => fetchWeather(selectedCity)}
        >
          🔄 {t.refreshBtn}
        </button>
      </div>

      {loading && <p className="weather-loading">{t.loadingWeather}</p>}

      {/* Current Weather */}
      {weatherCurrent && (
        <div className="weather-card">
          <h2 className="weather-city">{selectedCity.name}</h2>
          <p className="weather-current-temp">🌡 {t.temperature}: {weatherCurrent.temperature}°C</p>
          <p className="weather-wind">💨 {t.wind}: {weatherCurrent.windspeed} m/s</p>
          <p className="weather-time">🕒 {t.time}: {weatherCurrent.time}</p>
        </div>
      )}

      {/* Hourly Forecast */}
      {weatherHourly && (
        <div className="weather-card">
          <h3 className="weather-forecast-title">{t.hourlyForecast}</h3>
          <div className="weather-hourly">
            {weatherHourly.map((hour, idx) => (
              <div key={idx} className="weather-hourly-item">
                <p className="weather-hour">{hour.time.getHours()}:00</p>
                <p className="weather-hour-temp">🌡 {hour.temperature}°C</p>
                <p className="weather-hour-humidity">💧 {hour.humidity}%</p>
                <p className="weather-hour-wind">💨 {hour.wind} m/s</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past 10 Days */}
      {weatherPast10Days && Object.keys(weatherPast10Days).length > 0 && (
        <div className="weather-card">
          <h3 className="weather-forecast-title">{t.past10Days}</h3>
          <div className="weather-hourly">
            {Object.entries(weatherPast10Days).map(([date, hours]) => (
              <div key={date} style={{ marginBottom: "15px" }}>
                <h4 style={{ color: "#1f3c55" }}>{date}</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {hours.map((hourData, idx) => (
                    <div key={idx} className="weather-hourly-item">
                      <p className="weather-hour">{hourData.hour}:00</p>
                      <p className="weather-hour-temp">🌡 {hourData.temperature}°C</p>
                      <p className="weather-hour-humidity">💧 {hourData.humidity}%</p>
                      <p className="weather-hour-wind">💨 {hourData.wind} m/s</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
