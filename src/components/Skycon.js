// @flow
import React, { Component, PropTypes } from 'react';
// import ReactDOM from 'react-dom';

const Skycons = require('skycons')(window);

type State = {
  skycons: Object;
};

type SkyconIcon =
    'CLEAR_DAY'
  | 'CLEAR_NIGHT'
  | 'PARTLY_CLOUDY_DAY'
  | 'PARTLY_CLOUDY_NIGHT'
  | 'CLOUDY'
  | 'RAIN'
  | 'SLEET'
  | 'SNOW'
  | 'WIND'
  | 'FOG';

type Props = {
  color: ?string;
  autoPlay: boolean;
  icon: SkyconIcon;
};

class ReactSkycons extends Component {
  props: Props;
  node: Object;

  // static propTypes = {
  //   color: PropTypes.string,
  //   autoPlay: PropTypes.bool,
  //   icon: PropTypes.oneOf([
  //     'CLEAR_DAY',
  //     'CLEAR_NIGHT',
  //     'PARTLY_CLOUDY_DAY',
  //     'PARTLY_CLOUDY_NIGHT',
  //     'CLOUDY',
  //     'RAIN',
  //     'SLEET',
  //     'SNOW',
  //     'WIND',
  //     'FOG',
  //   ]),
  // };

  static defaultProps = {
    color: null,
    autoPlay: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      skycons: new Skycons({ color: this.props.color }),
    };
  }

  state: State;

  componentDidMount() {
    this.state.skycons.add(this.node, Skycons[this.props.icon]);

    if (this.props.autoPlay) {
      this.state.skycons.play();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.state.skycons.set(this.node, Skycons[nextProps.icon]);
  }

  componentWillUnmount() {
    this.state.skycons.pause();
    this.state.skycons.remove(this.node);
  }

  play() {
    this.state.skycons.play();
  }

  pause() {
    this.state.skycons.pause();
  }

  render() {
    const props = {
      ...this.props,
      autoPlay: undefined,
      autoplay: undefined,
    };

    const defaultStyle = {
      width: '6rem',
      // height: '6rem',
    };

    return (
      <canvas
        ref={canvas => { this.node = canvas; }}
        style={defaultStyle}
        {...props}
      />
    );
  }
}

export default ReactSkycons;
