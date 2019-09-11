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
            data:"",
            busServicesAvailableAtBusCode: "",
            busStops:[],
            busRoutes:[],
            busServices:[],
            busStopsCounter: 0,
            busRoutesCounter: 0,
            busServicesCounter: 0,
            endOfArray: false,
            busStopCode: "",
            filteredBusStops: [],
            latitude: "",
            longitude: "",
            time: "",
            busPref: [],
            showSettings: false,
            loadingBusStopInfo: false,
        };
    }

    componentDidMount() {
        this.getBusStopsInfo();
        this.getCoordinates();
        this.getUserBusPreference();
    }

    componentWillUnmount() {
    }

    inputSearchNamesHandler(event) {
        this.setState({inputSearchField: event.target.value});
        this.setState({data: ""});
        let tempStr = event.target.value.toString();
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
        let arr = this.state.busStops.filter(function(busStop){
            return busStop.RoadName.toLowerCase().includes(tempStr) || busStop.Description.toLowerCase().includes(tempStr) || busStop.BusStopCode.includes(tempStr);
        })
        return arr[0];
    }

    selectorNamesHandler(busStopCode) {
        this.setState({busStopCode: busStopCode});
        // this.checkBusStopCodesForServiceNo(event.target.value);
        this.ajaxBusAvailable(busStopCode);
    }

    clearSettingsInput() {
        this.setState({inputSearchField: ""});
        this.setState({filteredBusStops: []});
        this.setState({data: ""});
    }

    clickAddServiceNoHandler(event) {
        let value = event.target.innerText;

        if (this.state.serviceNo === value) {
            this.setState({serviceNo: ""});
        } else {
            this.setState({serviceNo: value});
        }

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
            // console.log('Your current position is:');
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            // console.log(`More or less ${crd.accuracy} meters`);
            reactComponent.setState({latitude : crd.latitude})
            reactComponent.setState({longitude : crd.longitude})
        }

        function error(err) {
            // console.warn(`ERROR(${err.code}): ${err.message}`);
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
            // console.log("user bus prefs: ",reactComponent.state.busPref);

            if (reactComponent.state.busPref.length === 0) {
                reactComponent.setState({showSettings: true});
            }
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
            var obj = Object.assign({}, result.Services[0], reactComponent.state.busPref[index]);
            let arr = reactComponent.state.busPref;
            arr[index] = obj;
            reactComponent.setState({ busPref : arr});
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

    ajaxBusAvailable(busCode) {
        const reactComponent = this;
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            result.Services.sort( (a,b) => (parseInt(a.ServiceNo) > parseInt(b.ServiceNo) ) ? 1: -1 );
            reactComponent.setState({ data:result });
        };
        let request = new XMLHttpRequest();
        let api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+busCode;
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();
    }

    ajaxBusRoutes(){
        const reactComponent = this;

        if ( window.localStorage.getItem('busRoutes1') === null ){
            // console.log("no bus routes detected on localstorage, parsingAPI-counter=", reactComponent.state.busRoutesCounter );
            let skip = "";
            if (!reactComponent.state.endOfArray) {
                if (reactComponent.state.busRoutesCounter > 0) {
                    skip = "?$skip=" + reactComponent.state.busRoutesCounter*500;
                }
                let responseHandler = function() {
                    const result = JSON.parse(this.responseText);
                    reactComponent.setState({busRoutes: reactComponent.state.busRoutes.concat(result.value) });

                    reactComponent.setState({busRoutesCounter: reactComponent.state.busRoutesCounter+1});
                    if (result.value.length===0) {
                        reactComponent.setState({endOfArray: true});
                        // console.log("All Bus Routes Fully Loaded");
                        var array1 = reactComponent.state.busRoutes
                        var array2 = array1.splice(0, Math.ceil(array1.length / 2));
                        var array1a = array1.splice(0, Math.ceil(array1.length / 2));
                        var array2a = array2.splice(0, Math.ceil(array1.length / 2));

                        window.localStorage.setItem("busRoutes1", JSON.stringify(array1));
                        window.localStorage.setItem("busRoutes1a", JSON.stringify(array2));
                        window.localStorage.setItem("busRoutes2", JSON.stringify(array2));
                        window.localStorage.setItem("busRoutes2a", JSON.stringify(array2));
                    }
                    if (!reactComponent.state.endOfArray){
                        reactComponent.ajaxBusRoutes();
                    }
                };
                let request = new XMLHttpRequest();
                let api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusRoutes" + skip;
                request.addEventListener("load", responseHandler);
                request.open("GET", api_url);
                request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
                request.setRequestHeader('accept', 'application/json');
                request.send();
            } else {
                // console.log("end of array : unable to proceed");
            }
        } else {
            // console.log("retrieving records from local storage");
            let data1 = reactComponent.retrieveLocalData('busRoutes1');
            let data1a = reactComponent.retrieveLocalData('busRoutes1');
            let data2 = reactComponent.retrieveLocalData('busRoutes2');
            let data2a = reactComponent.retrieveLocalData('busRoutes2');

            reactComponent.setState({busRoutes : data1.concat(data1a, data2, data2a)});
            // console.log("copied from local storage");
            // console.log(reactComponent.state.busRoutes);
            // console.log("bus Routes records :",reactComponent.state.busRoutes.length);
        }
    }

    getBusStopsInfo() {
        const reactComponent = this;
        reactComponent.setState({loadingBusStopInfo: true});

        if ( window.localStorage.getItem('busStopCodes') === null ){
            console.log("no bus info detected on localstorage");
            let skip = "";
            if (!reactComponent.state.endOfArray) {
                if (reactComponent.state.busStopsCounter > 0) {
                    skip = "?$skip=" + reactComponent.state.busStopsCounter*500;
                }
                let responseHandler = function() {
                    const result = JSON.parse(this.responseText);
                    reactComponent.setState({busStops: reactComponent.state.busStops.concat(result.value) });
                    reactComponent.setState({busStopsCounter: reactComponent.state.busStopsCounter+1});
                    if (result.value.length===0) {
                        reactComponent.setState({endOfArray: true});
                        reactComponent.setState({loadingBusStopInfo: false});
                        reactComponent.storeLocalData('busStopCodes', reactComponent.state.busStops);
                    }
                    if (!reactComponent.state.endOfArray){
                        reactComponent.getBusStopsInfo();
                    }
                };
                let request = new XMLHttpRequest();
                let api_url = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusStops" + skip;
                request.addEventListener("load", responseHandler);
                request.open("GET", api_url);
                request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
                request.setRequestHeader('accept', 'application/json');
                request.send();
            } else {
                // console.log("end of array : unable to proceed");
                reactComponent.setState({loadingBusStopInfo: false});
            }
        } else {
            let data = reactComponent.retrieveLocalData('busStopCodes');
            reactComponent.setState({busStops : data});
            // console.log("copied from local storage");
            reactComponent.setState({loadingBusStopInfo: false});
        }

    }

    storeLocalData(key, data){
        window.localStorage.setItem(key, JSON.stringify(data));
        // console.log("completed storage");
    }

    retrieveLocalData(key){
        // console.log('retrieving local storage');
        let data = window.localStorage.getItem(key);
        return JSON.parse(data);
    }

    settingsHandler(){
        this.setState({ showSettings: !this.state.showSettings });
        // this.ajaxBusRoutes();
        window.scrollTo(0, 0);
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

    ajaxBusServices(){
        console.log("ajax bus services");
        const reactComponent = this;

        if ( window.localStorage.getItem('busServices') === null ){
            console.log("no bus Services detected on localstorage ", reactComponent.state.busServicesCounter );
            let skip = "";
            if (!reactComponent.state.endOfArray) {
                if (reactComponent.state.busServicesCounter > 0) {
                    skip = "?$skip=" + reactComponent.state.busServicesCounter*500;
                }
                let responseHandler = function() {s
                    const result = JSON.parse(this.responseText);
                    reactComponent.setState({busServices: reactComponent.state.busServices.concat(result.value) });
                    reactComponent.setState({busServicesCounter: reactComponent.state.busServicesCounter+1});
                    if (result.value.length===0) {
                        reactComponent.setState({endOfArray: true});
                        console.log("All Bus Services Fully Loaded");
                        reactComponent.storeLocalData('busServices', reactComponent.state.busServices);
                    }
                    if (!reactComponent.state.endOfArray){
                        reactComponent.ajaxBusServices();
                    }
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
            }
        } else {

            let data = reactComponent.retrieveLocalData('busServices');
            reactComponent.setState({busServices : data});
            console.log("copied from local storage");
        }
    }

    checkBusStopCodesForServiceNo(busCode) {

        // console.log(busCode);
        // console.log(this.state.busRoutes);
        let arr = this.state.busRoutes.filter(function(item){
            return item.BusStopCode == busCode;
        })
        // console.log(arr);
        this.setState({busServicesAvailableAtBusCode: arr});
        // console.log(this.state.busServicesAvailableAtBusCode);
    }

//                                                |
//                                                |
//                                                |
// ------------not in use ------------------------|



    render() {

        let busInfo = "";
        if (this.state.busPref!= null && this.state.busPref.length > 0) {
            busInfo = this.state.busPref.map((item,index)=>{
                return (<BusTile key={index} busPref={this.state.busPref[index]} latitude={this.state.latitude} longitude={this.state.longitude} deleteUserBusPreference={(id)=>this.deleteUserBusPreference(id)}/>)
            })
        }

        return (

            <div><div className={styles.settingsBar}><img className={styles.fixedright} src="https://res.cloudinary.com/djm7zwedb/image/upload/v1568084559/settingsblack_i6dlyw.svg" height="30" width="30" onClick={()=>this.settingsHandler()}/></div>

                {
                    this.state.showSettings ? (<SettingsPage inputSearchNamesHandler={(e)=>this.inputSearchNamesHandler(e)} inputSearchField={this.state.inputSearchField} selectorNamesHandler={(e)=>this.selectorNamesHandler(e)} filteredBusStops={this.state.filteredBusStops} data={this.state.data} clickAddServiceNoHandler={(e)=>this.clickAddServiceNoHandler(e)} addUserBusPreference={()=>this.addUserBusPreference()} getBusStopsInfo={()=>this.getBusStopsInfo()}/>)
                    : (null)
                }

                {
                    this.state.loadingBusStopInfo ? (<div style={{textAlign:'center'}}><h2 data-text="Loading...">Loading...</h2></div>)
                    : (null)
                }
                <TimeTile />
                <WeatherTile />
                {busInfo}

            </div>
        );
    }
}

export default MainPage;
