import React from 'react';

import styles from './style.scss';

class WeatherTile extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    ajaxWeather24HrForecast() {
        const reactComponent = this;
        let date = this.getDateYYYYMMDD();
        let responseHandler = function() {
          const result = JSON.parse(this.responseText);
          reactComponent.setState({ weather24HrData:result.items[result.items.length-1] });
        };
        let request = new XMLHttpRequest();
        request.addEventListener("load", responseHandler);
        request.open("GET", "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date="+date );
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }


    render() {
        return (
            <div className={styles.weatherTile}>
                <div className={styles.imgBg}>
                hello weather
                </div>
            </div>
        );
    }
}

export default WeatherTile;
