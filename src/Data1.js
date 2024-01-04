import React, { useEffect, useState } from "react";
import "./Data_styles.css";
import Compass from "./Compass";
import apiKeys from "./api-keys.js";
const Data1 = () => {
  const [location, setLocation] = useState("");
  const [ws, setws] = useState("");
  const [temperature, setTemperature] = useState("");
  const [highTemperature, setHighTemperature] = useState("");
  const [lowTemperature, setLowTemperature] = useState("");
  const [icon, setIcon] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [uvIndex, setUVIndex] = useState(0);
  const [windDegree, setWindDegree] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [vision, SetVision] = useState(0);
  const [feelsLike, SetfeelsLike] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [Rain, SetRain] = useState(0);
  let UVType = "Low";

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeather);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getWeather = (position) => {
    const apiKey = apiKeys.apiKey;
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const sunriseSunsetApiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
    const openUVApiUrl = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const temperature = data.main.temp;
        const highTemp = data.main.temp_max;
        const lowTemp = data.main.temp_min;
        const cityName = data.name;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const visibility = data.visibility;
        const feelsLike = data.main.feels_like;
        const humidity = data.main.humidity;
        const Rain1 = data.rain;
        if (Rain1 != NaN)
          SetRain(Rain1);
        else
          SetRain(0)
        setHumidity(humidity);
        SetfeelsLike(feelsLike);
        setLocation(cityName);
        setHighTemperature(highTemp);
        setLowTemperature(lowTemp);
        setTemperature(temperature);
        setws(description);
        setIcon(icon);
        const speed = data.wind.speed;
        setWindSpeed(speed);
        const windDegree = data.wind.deg;
        setWindDegree(windDegree);
        SetVision(visibility);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(sunriseSunsetApiUrl)
      .then((response) => response.json())
      .then((data) => {
        const sunrise = new Date(data.results.sunrise);
        const sunset = new Date(data.results.sunset);

        setSunrise(sunrise.toLocaleTimeString());
        setSunset(sunset.toLocaleTimeString());
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(openUVApiUrl, {
      headers: {
        "x-access-token": apiKeys.openAPI,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const uvindex = data.result.uv;
        setUVIndex(uvindex);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let wimg = icon + ".png";
  const getUVLevelColor = (uvIndex) => {
    if (uvIndex >= 0 && uvIndex <= 2) {
      UVType = "Low";
      return "#3bb33b"; // Low UV level color
    } else if (uvIndex >= 3 && uvIndex <= 5) {
      UVType = "Moderate";
      return "#ffd700"; // Moderate UV level color
    } else if (uvIndex >= 6 && uvIndex <= 7) {
      UVType = "High";
      return "#ff7f00"; // High UV level color
    } else if (uvIndex >= 8 && uvIndex <= 10) {
      UVType = "Very high";
      return "#ff0000"; // Very high UV level color
    } else {
      UVType = "Extreme";
      return "#8b008b";
    }
  };

  const renderUVChart = () => {
    if (uvIndex !== "") {
      const uvLevelColor = getUVLevelColor(uvIndex);
      const dotPosition = (uvIndex / 11) * 100;
      return (
        <div className="uv-chart">
          <div
            className="uv-level"
            style={{ width: `${dotPosition}%`, backgroundColor: uvLevelColor }}
          >
            <div
              className="uv-dot"
              style={{ left: `${dotPosition}%`, backgroundColor: uvLevelColor }}
            ></div>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div>
      <div className="weather-container">
        <div id="weatherData">
          <div className="row">
            <div className="location"> {location}</div>
            <div className="temperature">
              Temperature: {Math.round(temperature)}°C
            </div>
            <div className="high-low-temperature">
              High: {Math.round(highTemperature) + 1}°C | Low:{" "}
              {Math.round(lowTemperature)}°C
            </div>
            <div className="weather-description">
              {ws} <img className="weatherLogo" src={wimg} alt="Weather Icon" />
            </div>
            <div className="sunrise">
              <h3>Sunrise: {sunrise}</h3>
            </div>
            <div className="sunset">
              <h3>Sunset: {sunset}</h3>
            </div>
          </div>

          <div></div>
          <div className="row">
            <h1></h1>
            <h1></h1>
          </div>
          <div className="row dat">
            <div className="col -2">
              <h1>
                <i class="fa-solid fa-wind sun_img"></i> Wind Speed
              </h1>
              <Compass windDegree={windDegree} />
              <h3>{windSpeed}Km/hr</h3>
            </div>
            <div className="col -3">
              <h1>
                {" "}
                <i class="fa-regular fa-sun sun_img"></i> Uv Level:{UVType}
              </h1>
              <h2>{Math.round(uvIndex)}</h2>
              {renderUVChart()}
            </div>
            <div className="col -2">
              <h1>
                <i class="fa-solid fa-eye sun_img"></i>Visibility{" "}
              </h1>
              <h2> </h2>
              <h2>{vision / 1000}Km</h2>
            </div>
            <div className="col -2">
              <h1>
                <i class="fa-solid fa-temperature-quarter sun_img"></i>Feels
                Like
              </h1>
              <h2> {Math.round(feelsLike) + 1}°C</h2>
            </div>
            <div className="col -1">
              <div className="humidity">
                <img className="humidity_img" src="humidity.png"></img>
                <h1>Humidity</h1>
              </div>

              <h2>{humidity}%</h2>
            </div>
            <div className="col -1">
              <div className="humidity shift">
                <i class="fa-solid fa-umbrella umb "></i>
                <h1>Rain</h1>
              </div>
              <h2>{Math.round(Rain)} mm</h2>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data1;
