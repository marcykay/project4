import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {
            input1 : "",
            input2 : "",
            input5 : "",
            location : "Ang Mo Kio",
            locations : [],
            weather2HrData : "",
            weather24HrData : "",
            data:"",
            busStops:[],
            busStopsCounter: 0,
            endOfArray: false,
            busStopCode: "",
            filteredBusStops: [],
            latitude: "",
            longitude: "",
        };
    }

    fetchUserName() {
        let stringArr = document.cookie.split('=');
        return stringArr[stringArr.length-1];
    }

    getCoordinates() {
        const reactComponent = this;
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            let crd = pos.coords;
            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            reactComponent.setState({latitude : crd.latitude})
            console.log(`Longitude: ${crd.longitude}`);
            reactComponent.setState({longitude : crd.longitude})

            console.log(`More or less ${crd.accuracy} meters.`);
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options)
    }

    updateInput1(event) {
        this.setState({input1: event.target.value});
        let tempStr = event.target.value.toString();
        console.log(tempStr);
        let arr = this.state.busStops.filter(function(busStop){
            return busStop.RoadName.toLowerCase().includes(tempStr) || busStop.Description.toLowerCase().includes(tempStr) || busStop.BusStopCode.includes(tempStr);
        })
        this.setState({filteredBusStops: arr});
        if (arr.length>0) {
            this.setState({busStopCode: arr[0].BusStopCode});
        }

    }


    updateInput2(event) {
        this.setState({input2: event.target.value});
    }

    updateInput3(event) {
        this.setState({location: event.target.value});
    }

    updateInput4(event) {
        this.setState({busStopCode: event.target.value});
    }

    updateInput5(event) {
        this.setState({input5: event.target.value});
    }

    consolePrint() {
        console.log(this.state.filteredBusStops);
    }

    parseTime(estimatedBusArrival) {
        let timeNow = new Date().getTime();
        let timeFromAPI = (new Date(estimatedBusArrival)).getTime();
        let timeDiff = Math.abs(timeFromAPI - timeNow )/1000/60;

        if (timeDiff < 1) {
            return "ARR";
        } else if (isNaN(timeDiff)){
            return "NA"
        } else {
            return Math.floor(timeDiff);
        }
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

    ajaxAddBusPreference() {
        const reactComponent = this;
        let data1 = {username: this.fetchUserName(), busstopcode: reactComponent.state.busStopCode, serviceno: reactComponent.state.input5};
        let data2 = JSON.stringify(data1);
        console.log(data2);
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            reactComponent.setState({ weather24HrData:result.items[result.items.length-1] });
            console.log("ajax response handler function");
        };
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", responseHandler);
        xmlhttp.open("POST", "./data/buspreference" );
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(data2);
    }

    ajaxPumpData(value) {
        const reactComponent = this;
        let data1 = {data: value};
        let data2 = JSON.stringify(data1);

        console.log(data2);
        let responseHandler = function() {
            //const result = JSON.parse(this.responseText);
            //reactComponent.setState({ weather24HrData:result.items[result.items.length-1] });
            console.log("ajax response handler function");
        };
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", responseHandler);
        xmlhttp.open("POST", "./secret" );
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(data2);
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


    ajaxWeather2HrForecast() {
        const reactComponent = this;
        let date = this.getDateYYYYMMDD();
        console.log(date);
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            let arr = result.area_metadata;
            let locations = [];
            for (let i in arr) {
                locations.push(arr[i].name);
            }
            reactComponent.setState({ locations:locations });
            reactComponent.setState({ weather2HrData:result.items[result.items.length-1] });

        };
        let request = new XMLHttpRequest();
        request.addEventListener("load", responseHandler);
        request.open("GET", "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date="+date );
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }

    ajaxBusArrival() {
        const reactComponent = this;
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            result.Services.sort( (a,b) => (parseInt(a.ServiceNo) > parseInt(b.ServiceNo) ) ? 1: -1 );
            reactComponent.setState({ data:result });
            console.log("BUSES AVAILABLE: ", reactComponent.state.data);
        };
        let request = new XMLHttpRequest();
        let api_url1 = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+reactComponent.state.busStopCode;
        if (this.state.input2) {
            let api_url2 = "&ServiceNo="+this.state.input2;
            api_url1 = api_url1+api_url2;
        }
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url1 );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();

    }
    //objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0));

    ajaxBusStops() {
        const reactComponent = this;
        let skip = "";
        if (!reactComponent.state.endOfArray) {
            if (this.state.busStopsCounter > 0) {
                skip = "?$skip=" + this.state.busStopsCounter*500;
            }
            let responseHandler = function() {
                const result = JSON.parse(this.responseText);
                reactComponent.setState({busStops: reactComponent.state.busStops.concat(result.value) });
                reactComponent.setState({busStopsCounter: reactComponent.state.busStopsCounter+1});
                console.log(reactComponent.state.busStops);
                if (result.value.length===0) {
                    reactComponent.setState({endOfArray: true});
                }
                // if (!reactComponent.state.endOfArray){
                //     ajaxPumpData(result.value);
                //     reactComponent.ajaxBusStops();
                // } else {
                //     console.log("All Bus Stops Fully Loaded")}
            };
            let request = new XMLHttpRequest();
            let api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusStops" + skip;
            request.addEventListener("load", responseHandler);
            request.open("GET", api_url);
            request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
            request.setRequestHeader('accept', 'application/json');
            request.send();
            } else {
                console.log("end of array : unable to proceed");
                console.log(reactComponent.state.busStops);
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
                        <span>NEXT BUS:  {this.parseTime(bus.NextBus.EstimatedArrival)}</span>
                        <span>,  {this.parseTime(bus.NextBus2.EstimatedArrival)}</span>
                        <span>,  {this.parseTime(bus.NextBus3.EstimatedArrival)}</span>
                    </div>
                );
            });
        }

        // selector for weather locations
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

        //selector for bus stops
        let selectorBusStops = "";
        if (this.state.filteredBusStops.length > 0) {

            let busStopOption = "";
            busStopOption = this.state.filteredBusStops.map( (busStop, index)=>{
                return (
                    <option key={index} value={busStop.BusStopCode}>{busStop.BusStopCode}, {busStop.Description}, {busStop.RoadName}</option>
                );
            });

            selectorBusStops = (
                <label>Select your location
                    <select  onChange={(event)=>this.updateInput4(event)}>
                    {busStopOption}
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
        }

        if (this.state.weather24HrData) {
            forecast24HrWeather = (
                <div>
                    <p>Forecast: {this.state.weather24HrData.general.forecast}</p>
                    <p>Temperature: {this.state.weather24HrData.general.temperature.high} / {this.state.weather24HrData.general.temperature.low}</p>
                </div>
                );
        }

        return (
            <div>
            <p>
            <input type="text" onChange={ (event)=>this.updateInput1(event) } value={this.state.input1} />Enter road names or bus stop names
            <input type="text" onChange={ (event)=>this.updateInput5(event) } value={this.state.input5} />Bus Service Nos
            </p>
            <p>
                <input type="text" onChange={ (event)=>this.updateInput2(event) } value={this.state.input2} />service no</p>
            <p>
                <input type="text" value={this.state.busStopCode} />bus stop code</p>

            <button onClick={()=>this.ajaxBusArrival()}>
            Load Bus Arrival
            </button>
            <button onClick={()=>this.ajaxBusStops()}>
            Bus Stops
            </button>
            <button onClick={()=>this.ajaxWeather2HrForecast()}>
            Load 2hr Weather Forecast
            </button>
            <button onClick={()=>this.ajaxWeather24HrForecast()}>
            Load 24hr Weather Forecast
            </button>
            <button onClick={()=>this.ajaxAddBusPreference()}>
            Add Bus Preference
            </button>
            <button onClick={()=>this.getCoordinates()}>
            Load Coordinates
            </button>

            <p>{selectorBusStops}</p>
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
                    <h2>GeoLocation</h2>
                    <h3>{this.state.latitude} : {this.state.longitude}</h3>

                </div>
            </div>
        );
    }
}

export default MainPage;
