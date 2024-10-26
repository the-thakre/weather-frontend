// components/WeatherDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('http://localhost:3001/weather');
            setWeatherData(response.data);
        }

        async function fetchAlerts() {
            const response = await axios.get('http://localhost:3001/alerts');
            setAlerts(response.data);
        }

        fetchData();
        fetchAlerts();
    }, []);

    const tempData = {
        labels: weatherData.map(d => d.date),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: weatherData.map(d => d.temp),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div>
            <h2>Weather Dashboard</h2>
            {/* <Line data={tempData} /> */}
            <h3>Alerts</h3>
            <ul>
                {alerts.map((alert, idx) => (
                    <li key={idx}>{alert.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default WeatherDashboard;
