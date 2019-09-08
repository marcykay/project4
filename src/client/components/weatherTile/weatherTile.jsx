import React from 'react';

import styles from './style.scss';

import styled from 'styled-components';

const Fair = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567946279/weather_icons/day_bsku0t.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    display: inline-block;
    width:120px;
    height: 120px;
    margin:0;
    padding:0;
`;

const Cloudy = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567945524/weather_icons/cloudy_jodffe.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    display: inline-block;
    width:120px;
    height: 120px;
    margin:0;
    padding:0;
`;

const Rainy = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567945536/weather_icons/rainy-6_upmz1y.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    display: inline-block;
    width:120px;
    height: 120px;
    margin:0;
    padding:0;
`;

const Showers = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567945544/weather_icons/rainy-7_wykft4.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    display: inline-block;
    width:120px;
    height: 120px;
    margin:0;
    padding:0;
`;

// <p>Forecast: {this.state.weather24HrData.general.forecast}</p>

class WeatherTile extends React.Component {
    constructor() {
        super();
        this.state = {
            weather24HrData: "",
        };
    }

    componentDidMount() {
        this.get24HrWeatherForecast();
    }

    componentWillUnmount() {
    }

    getDateYYYYMMDD() {
        let d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    get24HrWeatherForecast() {
        const reactComponent = this;
        let date = this.getDateYYYYMMDD();
        let responseHandler = function() {
          const result = JSON.parse(this.responseText);
          reactComponent.setState({ weather24HrData:result.items[result.items.length-1] });
          console.log(reactComponent.state.weather24HrData);
        };
        let request = new XMLHttpRequest();
        request.addEventListener("load", responseHandler);
        request.open("GET", "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date="+date );
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }

    render() {
        let forecast = "";
        let temperature = "";
        let weatherIcon = "";
        if (this.state.weather24HrData) {
            temperature = (
                <div>
                    {this.state.weather24HrData.general.temperature.high}°C / {this.state.weather24HrData.general.temperature.low}°C
                </div>
            );
            forecast = (
                <div> {this.state.weather24HrData.general.forecast} </div>
            );
            switch (this.state.weather24HrData.general.forecast) {
                case 'Fair & Warm' :
                    weatherIcon = (<Fair></Fair>);
                    break;
                case 'Fair' :
                    weatherIcon = (<Fair></Fair>);
                    break;
                case 'Partly Cloudy' :
                    weatherIcon = (<Cloudy></Cloudy>);
                    break;
                case 'Light Rain' :
                    weatherIcon = (<Rainy></Rainy>);
                    break;
                case 'Moderate Rain' :
                    weatherIcon = (<Rainy></Rainy>);
                    break;
                case 'Heavy Rain' :
                    weatherIcon = (<Rainy></Rainy>);
                    break;
                case 'Passing Showers' :
                    weatherIcon = (<Rainy></Rainy>);
                    break;
                case 'Light Showers' :
                    weatherIcon = (<Rainy></Rainy>);
                    break;
                case 'Showers' :
                    weatherIcon = (<Showers></Showers>);
                    break;
                case 'Heavy Showers' :
                    weatherIcon = (<Showers></Showers>);
                    break;
                case 'Thundery Showers' :
                    weatherIcon = (<Showers></Showers>);
                    break;
                case 'Heavy Thundery Showers' :
                    weatherIcon = (<Showers></Showers>);
                    break;
                default:
                    weatherIcon = (<Fair></Fair>);
            }
        }
        return (
            <div className={styles.weatherTile}>
                    <div className={styles.one_third}><div>{forecast}</div></div>
                    {weatherIcon}
                    <div className={styles.one_third}><div>{temperature}</div></div>
            </div>
        );
    }
}

export default WeatherTile;
