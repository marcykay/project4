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
            inputSearchField : "",
            serviceNo : "",
            weather24HrData : "",
            data:"",
            busStops:[],
            busRoutes:[],
            busStopsCounter: 0,
            busRoutesCounter: 0,
            endOfArray: false,
            busStopCode: "",
            filteredBusStops: [],
            latitude: "",
            longitude: "",
            time: "",
            busPref: [],
            showSettings: false,
        };
    }

    componentDidMount() {
        this.getUserBusPreference();
        this.getCoordinates();
    }

    componentWillUnmount() {
    }

    inputSearchNamesHandler(event) {
        this.setState({inputSearchField: event.target.value});
        this.setState({data: ""});
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

    // helper for addUserBusPreference
    findBusInfo(code) {
        let tempStr = code.toString();
        console.log(tempStr);
        let arr = this.state.busStops.filter(function(busStop){
            return busStop.RoadName.toLowerCase().includes(tempStr) || busStop.Description.toLowerCase().includes(tempStr) || busStop.BusStopCode.includes(tempStr);
        })
        console.log(arr[0]);
        return arr[0];
    }

    selectorNamesHandler(event) {
        this.setState({busStopCode: event.target.value});
        this.ajaxBusServices(event.target.value);
    }

    clearSettingsInput() {
        this.setState({inputSearchField: ""});
        this.setState({filteredBusStops: []});
        this.setState({data: ""});
    }

    clickAddServiceNoHandler(event) {
        let value = event.target.innerText;
        console.log("value= ",value);
        console.log("serviceNo= ",this.state.serviceNo);
        if (this.state.serviceNo === value) {
            this.setState({serviceNo: ""});
        } else {
            this.setState({serviceNo: value});
        }
        console.log('-----');
        console.log('service no selected :::::> ',this.state.serviceNo);
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



// ---------------------  OK  ---------------------
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

    getDateYYYYMMDD() {
        let d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    addUserBusPreference() {
        const reactComponent = this;
        let busStopInfo = this.findBusInfo(reactComponent.state.busStopCode);
        let data = {username: this.fetchUserName(), busstopcode: reactComponent.state.busStopCode, serviceno: reactComponent.state.serviceNo, roadname: busStopInfo.RoadName, description: busStopInfo.Description, latitude: busStopInfo.Latitude, longitude:busStopInfo.Longitude};
        let responseHandler = function() {

            // retrieve the new bus preferences and update the client
            reactComponent.getUserBusPreference();

            //destroy the state in the settings
            reactComponent.clearSettingsInput();

            //close the setting component
            reactComponent.setState({showSettings : false});
        };
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", responseHandler);
        xmlhttp.open("POST", "./data/buspreference" );
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(data));
    }

    getUserBusPreference() {
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

    deleteUserBusPreference(e) {
        let id = e.target.dataset.id;
        const reactComponent = this;
        let data = {username: reactComponent.fetchUserName(), id: id};
        let responseHandler = function() {
            //const result = JSON.parse(this.responseText);

            // retrieve the new bus preferences and update the client
            reactComponent.getUserBusPreference();
            
            console.log("delete user bus preference")
        };
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", responseHandler);
        xmlhttp.open("DELETE", "./data/"+reactComponent.fetchUserName()+"/"+id );
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(data));
    }

    //used to get bus arrivals for the user requests
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
        console.log(api_url1);
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url1 );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();

    }

    ajaxBusServices(busCode) {
        const reactComponent = this;
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            result.Services.sort( (a,b) => (parseInt(a.ServiceNo) > parseInt(b.ServiceNo) ) ? 1: -1 );
            reactComponent.setState({ data:result });
            console.log("BUSES AVAILABLE: ", reactComponent.state.data);
        };
        let request = new XMLHttpRequest();
        let api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+busCode;
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }

    getBusStopsInfo() {
        const reactComponent = this;
        if ( window.localStorage.getItem('busStopCodes') === null ){
            let skip = "";
            if (!reactComponent.state.endOfArray) {
                if (this.state.busStopsCounter > 0) {
                    skip = "?$skip=" + this.state.busStopsCounter*500;
                }
                let responseHandler = function() {
                    const result = JSON.parse(this.responseText);
                    reactComponent.setState({busStops: reactComponent.state.busStops.concat(result.value) });
                    reactComponent.setState({busStopsCounter: reactComponent.state.busStopsCounter+1});
                    if (result.value.length===0) {
                        reactComponent.setState({endOfArray: true});
                    }
                    if (!reactComponent.state.endOfArray){
                        ajaxPumpData(result.value);
                        reactComponent.getBusStopsInfo();
                    } else {
                        console.log("All Bus Stops Fully Loaded")};
                        this.storeLocalData('busStopCodes', this.state.busStops);

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
            }
        } else {
            let data = this.retrieveLocalData('busStopCodes');
            reactComponent.setState({busStops : data});
            console.log("copied from local storage");
        }

    }

    storeLocalData(key, data){
        console.log("start storage");
        console.log(data);
        window.localStorage.setItem('busStopCodes', JSON.stringify(data));
        console.log("completed storage");
    }

    retrieveLocalData(key){
        console.log('retrieving local storage');
        let data = window.localStorage.getItem('busStopCodes');
        return JSON.parse(data);
    }

    settingsHandler(){
        this.setState({ showSettings: !this.state.showSettings });
    }

// ---------------------  OK  ---------------------


// ------------not in use ------------------------|
//                                                |
//                                                |
//                                                |
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

    ajaxBusRoutes(){
        console.log('click get bus routes info');
        const reactComponent = this;
        let skip = "";
        if (!reactComponent.state.endOfArray) {
            if (this.state.busRoutesCounter > 0) {
                skip = "?$skip=" + this.state.busRoutesCounter*500;
            }
            let responseHandler = function() {
                const result = JSON.parse(this.responseText);
                reactComponent.setState({busRoutes: reactComponent.state.busRoutes.concat(result.value) });
                reactComponent.setState({busRoutesCounter: reactComponent.state.busRoutesCounter+1});
                console.log(reactComponent.state.busRoutes);
                if (result.value.length===0) {
                    reactComponent.setState({endOfArray: true});
                }
                // if (!reactComponent.state.endOfArray){
                //     ajaxPumpData(result.value);
                //     reactComponent.getBusStopsInfo();
                // } else {
                //     console.log("All Bus Stops Fully Loaded")}
            };
            let request = new XMLHttpRequest();
            let api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusServices" + skip;
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

    //objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0));


//                                                |
//                                                |
//                                                |
// ------------not in use ------------------------|






    render() {

        let busInfo = "";
        if (this.state.busPref.length > 0) {
            busInfo = this.state.busPref.map((item,index)=>{
                return (<BusTile busPref={this.state.busPref[index]} latitude={this.state.latitude} longitude={this.state.longitude} deleteUserBusPreference={(id)=>this.deleteUserBusPreference(id)}/>)
            })
        }

        return (

            <div><div className={styles.settingsBar}><img className={styles.fixedright} src="https://res.cloudinary.com/djm7zwedb/image/upload/v1568084559/settingsblack_i6dlyw.svg" height="40" width="40" onClick={()=>this.settingsHandler()}/></div>

                {
                    this.state.showSettings ? (<SettingsPage inputSearchNamesHandler={(e)=>this.inputSearchNamesHandler(e)} inputSearchField={this.state.inputSearchField} selectorNamesHandler={(e)=>this.selectorNamesHandler(e)} filteredBusStops={this.state.filteredBusStops} data={this.state.data} clickAddServiceNoHandler={(e)=>this.clickAddServiceNoHandler(e)} addUserBusPreference={()=>this.addUserBusPreference()} getBusStopsInfo={()=>this.getBusStopsInfo()}/>)
                    : (null)
                }
                <TimeTile />
                <WeatherTile />
                {busInfo}


                <p><input type="text" value={this.state.serviceNo} />Bus Service Nos
                </p>
                    <input type="text" value={this.state.busStopCode} />bus stop code
                <button onClick={()=>this.ajaxBusServices('76209')}>
                Load Bus Arrival
                </button>
                <button onClick={()=>this.getBusStopsInfo()}>
                zzzBus Stops
                </button>

                <button onClick={()=>this.addUserBusPreference()}>
                Add Bus Preference
                </button>

                <button onClick={()=>this.getUserBusPreference()}>
                getUserBusPreference
                </button>

                <button onClick={()=>this.ajaxBusRoutes()}>
                Fetch Bus Routes
                </button>

                <button onClick={()=>this.storeLocalData('busStopCodes', this.state.busStops)}>
                Store Local
                </button>

                <button onClick={()=>this.retrieveLocalData('busStopCodes')}>
                Retrieve Local
                </button>

                <button onClick={()=>this.deleteUserBusPreference('588')}>
                delete record
                </button>

            </div>
        );
    }
}

export default MainPage;
