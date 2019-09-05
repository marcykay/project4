import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

import Moment from 'react-moment';
import moment from 'moment';

class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {
            input1 : "",
            input2 : "",
            location : "Ang Mo Kio",
            locations : [],
            weather2HrData : "",
            weather24HrData : "",
            data:"",
            busStops:[],
            busStopsCounter: 0,
            endOfArray: false,
        };
    }

    updateInput1(event) {
        this.setState({input1: event.target.value});
    }

    updateInput2(event) {
        this.setState({input2: event.target.value});
    }

    updateInput3(event) {
        this.setState({location: event.target.value});
    }

    ajaxWeather24HrForecast() {
        const reactComponent = this;
        var responseHandler = function() {
            const result = JSON.parse(this.responseText);
            let arr = result.area_metadata;
            let locations = [];
            for (let i in arr) {
                locations.push(arr[i].name);
            }
            // reactComponent.setState({ locations:locations });
            reactComponent.setState({ weather24HrData:result.items[result.items.length-1] });
            console.log(reactComponent.state.weather24HrData);
        };
        var request = new XMLHttpRequest();
        request.addEventListener("load", responseHandler);
        request.open("GET", "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date=2019-09-05" );
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }


    ajaxWeather2HrForecast() {
        const reactComponent = this;
        var responseHandler = function() {
            const result = JSON.parse(this.responseText);
            let arr = result.area_metadata;
            let locations = [];
            for (let i in arr) {
                locations.push(arr[i].name);
            }
            reactComponent.setState({ locations:locations });
            reactComponent.setState({ weather2HrData:result.items[result.items.length-1] });
            console.log(reactComponent.state.weather2HrData.forecasts);
        };
        var request = new XMLHttpRequest();
        request.addEventListener("load", responseHandler);
        request.open("GET", "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date=2019-09-05" );
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }

    ajaxBusArrival() {
        const reactComponent = this;
        var responseHandler = function() {
            const result = JSON.parse(this.responseText);
            reactComponent.setState({ data:result });
            console.log(reactComponent.state.data.Services);
        };
        var request = new XMLHttpRequest();
        var api_url1 = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+this.state.input1;
        var api_url2 = "&ServiceNo="+this.state.input2;
        if (this.state.input2) {
            api_url1 = api_url1+api_url2;
        }
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url1 );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.send();
        //http://datamall2.mytransport.sg/ltaodataservice/BusStops
    }

    ajaxBusStops() {
        const reactComponent = this;
        let skip = "";
        if (!reactComponent.state.endOfArray) {

        if (this.state.busStopsCounter > 0) {
            skip = "?$skip=" + this.state.busStopsCounter*500;
        }

        var responseHandler = function() {
            const result = JSON.parse(this.responseText);
            reactComponent.setState({ busStops:reactComponent.state.busStops.concat(result.value) });
            console.log(reactComponent.state.busStops);
            reactComponent.setState({busStopsCounter: reactComponent.state.busStopsCounter+1});
            console.log(reactComponent.state.busStopsCounter);
            if (result.value.length===0) {
                console.log(result.value.length);
                reactComponent.setState({endOfArray: true});
            }
            if (!reactComponent.state.endOfArray){
                console.log("recursive call");
                reactComponent.ajaxBusStops();
            } else {console.log("hurray!")}

        };
        var request = new XMLHttpRequest();
        var api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusStops" + skip;
        console.log(api_url);
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url);

        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.send();
        } else {
            console.log("unable to proceed")
        }
    }

    render() {
        let returnBus = "";
        console.log('rendering mainPage.jsx');
        const date = new Date();
        if (this.state.data.Services) {

            returnBus = this.state.data.Services.map((bus, index)=>{
                return (
                    <div key={index}>
                        <p>BUS NO: {bus.ServiceNo}</p>
                        <span>NEXT BUS:  <Moment diff={date} unit="minutes">{bus.NextBus.EstimatedArrival}</Moment></span>
                        <span>,  <Moment diff={date} unit="minutes">{bus.NextBus2.EstimatedArrival}</Moment></span>
                        <span>,  <Moment diff={date} unit="minutes">{bus.NextBus3.EstimatedArrival}</Moment></span>
                    </div>
                );
            });
        }

        let selectorForm = "";
        let forecast2HrWeather = "";
        let forecast24HrWeather = ""

        if (this.state.locations.length > 0) {

            let locationSelector = "";
            locationSelector = this.state.locations.map( (loc, index)=>{
                return (
                    <option key={index} data-index={index} value={loc}>{loc}</option>
                );
            });

            selectorForm = (
                <label>Select your location
                <select value={this.state.location} onChange={(event)=>this.updateInput3(event)}>
                {locationSelector}
                </select>
                </label>
            );

        }

        if (this.state.weather2HrData) {
            for (let i = 0; i < this.state.weather2HrData.forecasts.length; i++){
                if (this.state.weather2HrData.forecasts[i].area === this.state.location){
                    forecast2HrWeather = this.state.weather2HrData.forecasts[i].forecast;
                    break;
                }
            }
            console.log(forecast2HrWeather);
        }

        if (this.state.weather24HrData) {


            forecast24HrWeather = (
                <div>
                    <p>Forecast: {this.state.weather24HrData.general.forecast}</p>
                    <p>Temperature: {this.state.weather24HrData.general.temperature.high} / {this.state.weather24HrData.general.temperature.low}</p>
                </div>
                );



            console.log(forecast24HrWeather);

        }



        return (
            <div>
            <h2 className={styles.desc}>
                MainPage Reporting
            </h2>
            <p>
                <input type="text" onChange={(event)=>this.updateInput1(event)} value={this.state.input1} />76209</p>
            <p>
                <input type="text" onChange={(event)=>this.updateInput2(event)} value={this.state.input2} />21</p>
            <button onClick={()=>this.ajaxBusArrival()}>Load Bus Arrival
            </button>
            <button onClick={()=>this.ajaxBusStops()}>Bus Stops
            </button>
            <button onClick={()=>this.ajaxWeather2HrForecast()}>Load 2hr Weather Forecast
            </button>
            <button onClick={()=>this.ajaxWeather24HrForecast()}>Load 24hr Weather Forecast
            </button>
            <p>
            <Moment toNow>{date}</Moment>
            </p>
                {returnBus}

                <div>
                    {selectorForm}
                </div>
                <div>
                    <h3>Forecast 2hr</h3>
                    <p>Location:{this.state.location}</p>
                    {forecast2HrWeather}
                    <h3>Forecast 24hr</h3>
                    {forecast24HrWeather}
                </div>
            </div>

        );
    }
}

export default MainPage;
