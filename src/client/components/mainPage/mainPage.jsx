import React from 'react';

import PropTypes from 'prop-types';

import SettingsPage from '../settingsPage/settingsPage';
import WeatherTile from '../weatherTile/weatherTile';
import TimeTile from '../timeTile/timeTile';
import BusTile from '../busTile/busTile';
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
            time: "",
            busPref: [],
        };
    }

    componentDidMount() {
        this.ajaxGetBusPreference();
        // this.interval = setInterval(() => this.getBusArrival(), 30000);
        this.getCoordinates();
    }

    componentWillUnmount() {
        //clearInterval(this.interval);
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
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters`);
            reactComponent.setState({latitude : crd.latitude})
            reactComponent.setState({longitude : crd.longitude})
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

    findBusInfo(code) {
        let tempStr = code.toString();
        console.log(tempStr);
        let arr = this.state.busStops.filter(function(busStop){
            return busStop.RoadName.toLowerCase().includes(tempStr) || busStop.Description.toLowerCase().includes(tempStr) || busStop.BusStopCode.includes(tempStr);
        })
        console.log(arr[0]);
        return arr[0];
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

    calcTime(result) {

        var d = new Date();
        var n = d.getTimezoneOffset()/60;


        // create Date object for current location
        var d = new Date();

        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        var nd = new Date(utc + (3600000*offset));

        // return time as a string
        return "The local time in " + city + " is " + nd.toLocaleString();
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

//https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=today

    ajaxSunriseSunset() {
        const reactComponent = this;
        if (reactComponent.state.latitude !== "") {
            let api_url = "https://api.sunrise-sunset.org/json?lat=" + reactComponent.state.latitude + "&lng=" + reactComponent.state.longitude + "&date=today";
            console.log(api_url);
            let responseHandler = function() {
                const result = JSON.parse(this.responseText);
                console.log(result);
                this.calcTime(result);
                //reactComponent.setState({ weather24HrData:result.items[result.items.length-1] });
            };
            let request = new XMLHttpRequest();
            request.addEventListener("load", responseHandler);
            request.open("GET", api_url);
            request.setRequestHeader('accept', 'application/json');
            request.send();
        } else {
            console.log("NO Coordinates data detected");
        }

    }

// ---------------------  OK  ---------------------
    ajaxAddBusPreference() {
        const reactComponent = this;
        let busStopInfo = this.findBusInfo(reactComponent.state.busStopCode);
        let data = {username: this.fetchUserName(), busstopcode: reactComponent.state.busStopCode, serviceno: reactComponent.state.input5, roadname: busStopInfo.RoadName, description: busStopInfo.Description, latitude: busStopInfo.Latitude, longitude:busStopInfo.Longitude};
        let responseHandler = function() {
            // const result = JSON.parse(this.responseText);
            ajaxGetBusPreference();
        };
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", responseHandler);
        xmlhttp.open("POST", "./data/buspreference" );
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(data));
    }

    ajaxGetBusPreference() {
        const reactComponent = this;
        let data = {username: reactComponent.fetchUserName()};
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            reactComponent.setState({ busPref: result.results });
            console.log(reactComponent.state.busPref);
        };
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", responseHandler);
        xmlhttp.open("GET", "./data/"+reactComponent.fetchUserName() );
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(data));
    }

    getBusArrival(index, bus_stop_code, service_no) {
        const reactComponent = this;
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            // result.Services.sort( (a,b) => (parseInt(a.ServiceNo) > parseInt(b.ServiceNo) ) ? 1: -1 );
            // reactComponent.setState({ data:result });
            console.log("return bus arrival info: ", result.Services[0]);
            console.log("state: ", reactComponent.state.busPref[index]);
            console.log("------------------------------")
            var obj = Object.assign({}, result.Services[0], reactComponent.state.busPref[index]);
            let arr = reactComponent.state.busPref;
            arr[index] = obj;
            console.log(arr);
            reactComponent.setState({ busPref : arr})
            console.log("result state: ", reactComponent.state.busPref);
        };
        let request = new XMLHttpRequest();
        let api_url1 = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+bus_stop_code;
        if (service_no) {
            let api_url2 = "&ServiceNo="+service_no;
            api_url1 = api_url1+api_url2;
        }
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url1 );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();

    }
// ---------------------  OK  ---------------------

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
        // const date = new Date();
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

        //selector for bus stops
        let selectorBusStops = "";
        if (this.state.filteredBusStops.length > 0) {

            let busStopOption = "";
            busStopOption = this.state.filteredBusStops.map( (busStop, index)=>{
                return (
                    <option key={index} value={busStop.BusStopCode}> {busStop.BusStopCode}, {busStop.Description}, {busStop.RoadName} </option>
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

        let busInfo = "";
        // busInfo = (this.state.busPref.length > 0) ? (
        //            <BusTile busPref={this.state.busPref[0]} />
        //        ) : "";
        if (this.state.busPref.length > 0) {
            busInfo = this.state.busPref.map((item,index)=>{
                console.log(item);
                return (<BusTile busPref={this.state.busPref[index]} latitude={this.state.latitude} longitude={this.state.longitude}/>)
            })
        }




        return (
//
// <p>
//     <input type="text" onChange={ (event)=>this.updateInput2(event) } value={this.state.input2} />service no
// </p>

            <div>

                <TimeTile />
                <WeatherTile />
                {busInfo}


                <p>
                    <input type="text" onChange={ (event)=>this.updateInput1(event) } value={this.state.input1} />Enter road names or bus stop names
                    <input type="text" onChange={ (event)=>this.updateInput5(event) } value={this.state.input5} />Bus Service Nos
                </p>

                <p>
                    <input type="text" value={this.state.busStopCode} />bus stop code
                </p>

                <button onClick={()=>this.ajaxBusArrival()}>
                Load Bus Arrival
                </button>
                <button onClick={()=>this.ajaxBusStops()}>
                Bus Stops
                </button>

                <button onClick={()=>this.ajaxAddBusPreference()}>
                Add Bus Preference
                </button>
                <button onClick={()=>this.ajaxSunriseSunset()}>
                Sunrise Sunset
                </button>
                <button onClick={()=>this.ajaxGetBusPreference()}>
                ajaxGetBusPreference
                </button>



                <p>{selectorBusStops}</p>
                    {returnBus}




            </div>
        );
    }
}

export default MainPage;
