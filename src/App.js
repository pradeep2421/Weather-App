import Weather from "./app_component/Weather";
import "weather-icons/css/weather-icons.css";
import "./App.css";
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Form from "./app_component/Form";

//api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}
const WEATHER_KEY = "fbfb2ea87086e2bc2a96747ccc1bfce1";

class App extends Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      temp_celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false,
      nocity: false,
    };

    this.weatherIcon = {
      clouds: "wi-day-fog",
      rain: "wi-storm-showers",
      snow: "wi-snow",
      thunderstorm: "wa-thunderstorm",
      atmosphere: "wi-fog",
      clear: "wi-day-sunny",
      drizzle: "wi-thunderstorm",
    };
  }
  getCelsius(temp) {
    let cur = Math.floor(temp - 273.5);
    return cur;
  }
  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({ icon: this.weatherIcon.thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: this.weatherIcon.drizzle });
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({ icon: this.weatherIcon.rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: this.weatherIcon.snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: this.weatherIcon.atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: this.weatherIcon.clear });
        break;
      default:
        this.setState({ icon: this.weatherIcon.clouds });
    }
  }
  getWeather = async (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    if (city) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}`
      );
      const response = await api_call.json();
      console.log(response);
      if (!response.message) {
        this.setState({
          city: `${response.name},${response.sys.country}`,
          temp_celsius: this.getCelsius(response.main.temp),
          temp_min: this.getCelsius(response.main.temp_min),
          temp_max: this.getCelsius(response.main.temp_max),
          description: response.weather[0].description,
          error: false,
          nocity: false,
        });
        this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
      } else {
        this.setState({
          nocity: true,
          error: false,
          city: undefined,
          country: undefined,
          icon: undefined,
          main: undefined,
          temp_celsius: undefined,
          temp_max: undefined,
          temp_min: undefined,
          description: "",
        });
      }
    } else {
      this.setState({
        error: true,
        nocity: false,
        city: undefined,
        country: undefined,
        icon: undefined,
        main: undefined,
        temp_celsius: undefined,
        temp_max: undefined,
        temp_min: undefined,
        description: "",
      });
    }
  };
  render() {
    return (
      <div className="App">
        <Form
          loadweather={this.getWeather}
          error={this.state.error}
          nocity={this.state.nocity}
        ></Form>
        <Weather
          city={this.state.city}
          temp_celsius={this.state.temp_celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
          weatherIcons={this.state.weatherfont}
        ></Weather>
      </div>
    );
  }
}

export default App;
