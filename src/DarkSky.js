// @flow
import 'whatwg-fetch';
import moment from 'moment';
import queryString from 'query-string';

type DSUnit = 'auto' | 'ca' | 'uk2' | 'us' | 'si';
type DSBlock = 'currently' | 'minutely' | 'hourly' | 'daily' | 'alerts' | 'flags';

function checkStatus(response: Response): Response {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  // $FlowIssue
  error.response = response;
  throw error;
}

function parseJSON(response: Response): any {
  return response.json();
}

class DarkSky {
  apiKey: string;
  long: ?number;
  lat: ?number;
  t: ?string;
  query: {
    units?: DSUnit;
    lang?: string;
    exclude?: Array<DSBlock>;
    extend?: string;
  };
  url: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.long = null;
    this.lat = null;
    this.t = null;
    this.query = {};
  }

  longitude(long: number) {
    if (long) this.long = long;
    return this;
  }

  latitude(lat: number) {
    if (lat) this.lat = lat;
    return this;
  }

  time(time: number) {
    if (time) this.t = moment(time).format('YYYY-MM-DDTHH:mm:ss');
    return this;
  }

  units(unit: DSUnit) {
    if (unit) this.query.units = unit;
    return this;
  }

  language(lang: string) {
    if (lang) this.query.lang = lang;
    return this;
  }

  exclude(blocks: Array<DSBlock>) {
    if (blocks) this.query.exclude = blocks;
    return this;
  }

  extendHourly(param: boolean = false) {
    if (param) this.query.extend = 'hourly';
    return this;
  }

  generateReqUrl() {
    if (!this.lat || !this.long) {
      throw new Error('Please provide latitude and longitude');
    }
    const DEV = process.env.NODE_ENV === 'development';

    let url = `${DEV ? 'https://crossorigin.me/' : ''}https://api.darksky.net/forecast/${this.apiKey}/${this.lat},${this.long}`;
    if (this.t) url += `,${this.t}`;
    if (this.query) url += `?${queryString.stringify(this.query)}`;
    this.url = url;
  }

  get() {
    return new Promise((resolve, reject) => {
      if (!this.lat || !this.long) reject('Request not sent. ERROR: Longitute or Latitude is missing.');
      this.generateReqUrl();
      fetch(this.url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
          resolve(data);
        })
        .catch(err => reject(`Forecast cannot be retrieved. ERROR: ${err}`));
    });
  }
}

module.exports = DarkSky;
