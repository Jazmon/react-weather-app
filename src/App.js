// @flow
import React, { Component } from 'react';
import { Line as LineChart } from 'react-chartjs';
import 'whatwg-fetch';
import logo from './logo.svg';
import './App.css';
import apiResponse from '../response.json';

// const console.log = require('console.log')('weather');
function round(value: number, decimals: number): number {
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}

type DarkSky = {
  latitude: number;
  longitude: number;
  timezone: string;
  offset: number;
  currently: {
    time: number;
    summary: string;
    icon: string;
    nearestStormDistance: number;
    nearestStormBearing: number;
    precipIntensity: number;
    precipProbability: number;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    windSpeed: number;
    windBearing: number;
    visibility: number;
    cloudCover: number;
    pressure: number;
    ozone: number;
  };
  minutely: {
    summary: string;
    icon: string;
    data: Array<{
      time: number;
      precipIntensity: number;
      precipProbability: number;
    }>;
  };
  hourly: {
    summary: string;
    icon: string;
    data: Array<{
      time: number;
      summary: string;
      icon: string;
      precipIntensity: number;
      precipProbability: number;
      temperature: number;
      apparentTemperature: number;
      dewPoint: number;
      humidity: number;
      windSpeed: number;
      windBearing: number;
      visibility: number;
      cloudCover: number;
      pressure: number;
      ozone: number;
    }>;
  };
  daily: {
    summary: string;
    icon: string;
    data: Array<{
      time: number;
      summary: string;
      icon: string;
      sunriseTime: number;
      sunsetTime: number;
      moonPhase: number;
      precipIntensity: number;
      precipIntensityMax: number;
      precipProbability: number;
      temperatureMin: number;
      temperatureMinTime: number;
      temperatureMax: number;
      temperatureMaxTime: number;
      apparentTemperatureMin: number;
      apparentTemperatureMinTime: number;
      apparentTemperatureMax: number;
      apparentTemperatureMaxTime: number;
      dewPoint: number;
      humidity: number;
      windSpeed: number;
      windBearing: number;
      visibility: number;
      cloudCover: number;
      pressure: number;
      ozone: number;
    }>;
  };
  flags: {
    sources: Array<string>;
    // darksky-stations: Array<string>;
    // lamp-stations: Array<string>;
    // isd-stations: Array<string>;
    // madis-stations: Array<string>;
    units: string;
  };
};

const geolocationSupport = (): boolean => ('geolocation' in navigator);
// {
  // if ('geolocation' in navigator) {
  //   /* geolocation is available */
  //
  // } else {
  //   /* geolocation IS NOT available */
  // }
// };

// function checkStatus(response: Response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//   const error = new Error(response.statusText);
//   // $FlowIssue
//   error.response = response;
//   throw error;
// }
//
// function parseJSON(response: Response) {
//   return response.json();
// }

const API_KEY = 'aeb5bdaa69ec5fe79a4e6a3d4a4d4ee7';
/* eslint-disable no-underscore-dangle */
const __DEV__ = process.env.NODE_ENV === 'development';
if (__DEV__) {
  global.__DEV__ = __DEV__;
  window.__DEV__ = __DEV__;
}
/* eslint-enable no-underscore-dangle */
console.log('dev', __DEV__);

const API_BASE_URL = 'https://crossorigin.me/https://api.darksky.net/forecast';

type State = {
  isFetching: boolean;
  canUseLocation: boolean;
  position: ?Position;
  weather: string;
  darkSky: ?DarkSky;
};

type Props = {};

class App extends Component {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      isFetching: false,
      canUseLocation: false,
      position: null,
      darkSky: null,
      weather: '',
    };
  }

  state: State;

  componentDidMount() {
    if (geolocationSupport()) {
      this.setState({ canUseLocation: true });
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ position });
      });
    } else {
      this.setState({ canUseLocation: false });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.position !== prevState.position) {
      if (this.state.position) {
        this.setState({ isFetching: true });
        setTimeout(() => {
          console.log('got fake data');
          const data: DarkSky = apiResponse;
          this.setState({
            isFetching: false,
            darkSky: data,
            weather: data.currently.summary,
          });
        }, 400);
        // fetch(`${API_BASE_URL}/${API_KEY}/${this.state.position.coords.latitude},${this.state.position.coords.longitude}`)
        //   .then(checkStatus)
        //   .then(parseJSON)
        //   .then((data: DarkSky) => {
        //     console.log('got data', data);
        //     this.setState({
        //       isFetching: false,
        //       weather: data.currently.summary,
        //     });
        //   })
        //   .catch((error) => {
        //     this.setState({ isFetching: false, error: Error });
        //     console.error('request failed', error);
        //     console.error(error.response.statusText);
        //     console.error(error.response.status);
        //   });
      }
    }
  }

  render() {
    const { weather, darkSky, canUseLocation, position, isFetching } = this.state;
    const chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          // label: 'My First dataset',
          // fill: false,
          // lineTension: 0.1,
          // backgroundColor: 'rgba(75,192,192,0.4)',
          // borderColor: 'rgba(75,192,192,1)',
          // borderCapStyle: 'butt',
          // borderDash: [],
          // borderDashOffset: 0.0,
          // borderJoinStyle: 'miter',
          // pointBorderColor: 'rgba(75,192,192,1)',
          // pointBackgroundColor: '#fff',
          // pointBorderWidth: 1,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          // pointHoverBorderColor: 'rgba(220,220,220,1)',
          // pointHoverBorderWidth: 2,
          // pointRadius: 1,
          // pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40],
          // spanGaps: false,
        },
      ],
    };

    const chartOptions = {
      title: {
        display: true,
        text: 'foo',
      },
    };

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const width = windowWidth - 42;
    const height = width * 2.5 / 6;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Reacter — React Weather</h2>
        </div>
        <p className="App-intro">
          Benis
        </p>
        <div>
          <table className="my-table">
            <tr>
              <th>position</th>
              <td>{!isFetching && !!position && `${round(position.coords.latitude, 3)}, ${round(position.coords.longitude, 3)}` || 'getting position'}</td>
            </tr>
            <tr>
              <th>weather</th>
              <td>{weather}</td>
            </tr>
            <tr>
              <th>canUseLocation</th>
              <td>{String(canUseLocation)}</td>
            </tr>
            <tr>
              <th>isFetching</th>
              <td>{String(isFetching)}</td>
            </tr>
          </table>
        </div>
        {!!darkSky &&
          <div>
            <h3>{darkSky.currently.summary}</h3>
            <span>{darkSky.currently.icon}</span>
            <p>temperature: {darkSky.currently.temperature}℃</p>
          </div>
        }
        {/* <LineChart data={chartData} options={chartOptions} width={width} height={height} /> */}
      </div>
    );
  }
}

export default App;
