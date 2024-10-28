// components/WeatherDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import './WeatherDashboard.css'; // Custom CSS for styling

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [cityData, setCityData] = useState({});

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('http://localhost:3001/weather');
            setWeatherData(response.data);
            groupDataByCity(response.data);
        }

        async function fetchAlerts() {
            const response = await axios.get('http://localhost:3001/alerts');
            setAlerts(response.data);
        }

        fetchData();
        fetchAlerts();
    }, []);

    // Group weather data by city for charting
    const groupDataByCity = (data) => {
        const groupedData = {};

        data.forEach((item) => {
            const city = item.city;
            if (!groupedData[city]) {
                groupedData[city] = {
                    dates: [],
                    temperatures: [],
                    feelsLikeTemps: [],
                };
            }
            groupedData[city].dates.push(new Date(item.dt).toLocaleTimeString());
            groupedData[city].temperatures.push(item.temp);
            groupedData[city].feelsLikeTemps.push(item.feels_like);
        });

        setCityData(groupedData);
    };

    // Generate series data for ApexCharts
    const generateSeriesData = () => {
        return Object.keys(cityData).map((city) => ({
            name: city,
            data: cityData[city].temperatures,
        }));
    };

    const chartOptions = {
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        title: {
            text: 'Temperature Trends by City',
            align: 'center',
        },
        xaxis: {
            categories: cityData[Object.keys(cityData)[0]]?.dates || [],
            title: {
                text: 'Time',
            },
        },
        yaxis: {
            title: {
                text: 'Temperature (°C)',
            },
            labels: {
                formatter: (value) => `${value.toFixed(1)}°C`, // Format Y-axis labels
            },
        },
        tooltip: {
            y: {
                formatter: (value) => `${value.toFixed(2)}°C`, // Format tooltip values
            },
        },
        stroke: {
            curve: 'smooth',
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 5,
        },
    };

    return (
        <div className="weather-dashboard">
            <h2 className="dashboard-title">Weather Dashboard</h2>

            {/* Chart for temperature trends by city */}
            <div className="chart-container">
                <ApexCharts
                    options={chartOptions}
                    series={generateSeriesData()}
                    type="line"
                    height={350}
                />
            </div>

            {/* Weather Data Table */}
            <div className="weather-table">
                <h3 className="table-title">Latest Weather Data</h3>
                <table>
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Main Condition</th>
                            <th>Temperature (°C)</th>
                            <th>Feels Like (°C)</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weatherData.map((data) => (
                            <tr key={data._id}>
                                <td>{data.city}</td>
                                <td>{data.main}</td>
                                <td>{data.temp.toFixed(2)}</td>
                                <td>{data.feels_like.toFixed(2)}</td>
                                <td>{new Date(data.dt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Alerts Section */}
            <div className="alerts-section">
                <h3 className="alerts-title">Weather Alerts</h3>
                <ul>
                    {alerts.map((alert, idx) => (
                        <li key={idx} className="alert-item">
                            {alert.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WeatherDashboard;
