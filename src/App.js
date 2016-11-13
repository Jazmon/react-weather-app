// @flow
import React, { Component } from 'react';
import { Line as LineChart } from 'react-chartjs';
import moment from 'moment';
import 'whatwg-fetch';
import logo from './logo.svg';
import './App.css';
import apiResponse from '../response.json';
import Skycon from './components/Skycon';
import DarkSky from './DarkSky';

moment.locale('fi');
// const console.log = require('console.log')('weather');
function round(value: number, decimals: number): number {
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}

type DarkSkyResponse = {
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
  darkSky: ?DarkSkyResponse;
  error: ?Object;
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
      error: null,
    };
  }

  state: State;

  componentDidMount() {
    // TODO clear timeout when unmount
    setTimeout(() => {
      const canUseLocation = geolocationSupport();
      this.setState({ canUseLocation });
      if (canUseLocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({ position });
        });
      }
    }, 20);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.position !== prevState.position) {
      if (this.state.position) {
        this.setState({ isFetching: true });
        this.getData();
        // setTimeout(() => {
        //   console.log('got fake data');
        //   const data: DarkSkyResponse = apiResponse;
        //   this.setState({
        //     isFetching: false,
        //     darkSky: data,
        //     weather: data.currently.summary,
        //   });
        // }, 10);
      }
    }
  }

  getData = async () => {
    const forecast = new DarkSky(API_KEY);
    if (!this.state.position) {
      return;
    }
    const { latitude, longitude } = this.state.position.coords;

    forecast
      .latitude(latitude)
      .longitude(longitude)          // required: longitude, string.
      // .time('2016-01-28')             // optional: date, string 'YYYY-MM-DD'.
      .units('si')                    // optional: units, string, refer to API documentation.
      .language('en')                 // optional: language, string, refer to API documentation.
      // .exclude('minutely,daily')      // optional: exclude, string, refer to API documentation.
      // .extendHourly(true)             // optional: extend, boolean, refer to API documentation.
      .get()                          // execute your get request.
      .then((data: DarkSkyResponse) => {                  // handle your success response.
        this.setState({
          isFetching: false,
          weather: data.currently.summary,
          darkSky: data,
        });
      })
      .catch(error => {                 // handle your error response.
        this.setState({ isFetching: false, error: Error });
        console.error('request failed', error);
        console.error(error.response.statusText);
        console.error(error.response.status);
      });
  }

  renderLoading = () => (
    <div>
      <p>Loading...</p>
    </div>
  )

  renderData = () => {
    // $FlowIssue
    const darkSky: DarkSkyResponse = this.state.darkSky;
    return (
      <div>
        <h3>{darkSky.currently.summary}</h3>
        <Skycon
          // $FlowIssue
          icon={darkSky.currently.icon.toUpperCase().replace(/-/g, '_')}
          // $FlowIssue
          color="#000000"
          autoPlay={true}
        />
        <span>{darkSky.currently.icon}</span>
        <p>temperature: {darkSky.currently.temperature}℃</p>
        <table>
          <thead>
            <tr>
              <th>time</th>
              <th>summary</th>
              <th>icon</th>
              <th>temperature</th>
              <th>wind speed</th>
            </tr>
          </thead>
          <tbody>
            {darkSky.hourly.data.map(hourly => (
              <tr key={`hourly-${String(hourly.time)}`}>
                <td>{moment(hourly.time * 1000).format('LT')}</td>
                <td>{hourly.summary}</td>
                <td>
                  <Skycon
                    color="#000000"
                    icon={hourly.icon.toUpperCase().replace(/-/g, '_')}
                    autoPlay={true}
                  />
                </td>
                <td>{hourly.temperature}℃</td>
                <td>{String(hourly.windSpeed)} m/s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderGraph = () => {
    // $FlowIssue
    const darkSky: DarkSkyResponse = this.state.darkSky;
    const labels = darkSky.hourly.data.map(hourly => moment(hourly.time * 1000).format('LT'));
    const data = darkSky.hourly.data.map(hourly => hourly.temperature);
    const chartData = {
      labels,
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
          data,
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
    // const windowHeight = window.innerHeight;
    const width = windowWidth - 42;
    const height = width * 2.5 / 6;
    return (
      <LineChart data={chartData} options={chartOptions} width={width} height={height} />
    );
  }

  render() {
    const { weather, darkSky, canUseLocation, position, isFetching } = this.state;

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
        {!!isFetching && this.renderLoading()}
        {!isFetching && !!darkSky && this.renderData()}
        {!isFetching && !!darkSky && this.renderGraph()}
      </div>
    );
  }
}

export default App;
