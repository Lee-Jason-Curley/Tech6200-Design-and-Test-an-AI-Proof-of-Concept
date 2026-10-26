// App.js
import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import Calendar from './components/Calendar';
import MeteorologicalPredictions from './components/MeteorologicalPredictions';
import { getWeatherData } from './services/WeatherService';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [meteorologicalPredictions, setMeteorologicalPredictions] = useState('');

  useEffect(() => {
    const currentDate = new Date().toDateString();
    const predictions = 'Meteorological predictions for the week: ...';

    setDate(currentDate);
    setMeteorologicalPredictions(predictions);
  }, []);

  const handleSearch = async () => {
    setError('');
    try {
      const data = await getWeatherData(city);
      setWeatherData(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Invalid city. Please check the name and try again.');
      }
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div>
      <div style={{ margin: '16px' }}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (!e.target.value) setError('');
          }}
        />
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={() => {
            setCity('');
            setError('');
          }}
        >
          Clear
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      {weatherData && <WeatherCard data={weatherData} />}
      {date && <Calendar date={date} />}
      {meteorologicalPredictions && (
        <MeteorologicalPredictions predictions={meteorologicalPredictions} />
      )}
    </div>
  );
};

export default App;
