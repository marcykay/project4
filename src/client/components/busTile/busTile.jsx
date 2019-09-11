import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

import styled from 'styled-components';

const BusType_SD = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567933727/SD_ms8swe.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    width: 40px;
    height: 30px;
    margin:0;
`;

const BusType_DD = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567933727/DD_qu69xm.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    width: 40px;
    height: 30px;
    margin:0;
`;

const BusType_BD = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567933726/BD_ezpspd.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    margin-left: 5px;
    width: 40px;
    height: 30px;
    margin:0;
`;

const BusType_empty = styled.div`
    background-image: url('');
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 5px;
    width: 40px;
    height: 30px;
    margin:0;
`;

const WAB = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567933516/WABwhite_nyzc5d.svg');
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 5px;
    width: 25px;
    height: 25px;
`;

const WAB_empty = styled.div`
    background-image: url('');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-left: 5px;
    width: 25px;
    height: 25px;
`;

const RedBar = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567936243/redbar_wkdrnt.svg');
    background-size: contain;
    background-repeat: repeat-x;
    background-position: top;
    width: 40px;
    height: 10px;
    margin:0;
    margin-top:10px;
`;

const GreenBar = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567936773/greenbar_b12pjq.svg');
    background-size: contain;
    background-repeat: repeat-x;
    background-position: top;
    width: 40px;
    height: 10px;
    margin:0;
    margin-top:10px;
`;

const AmberBar = styled.div`
    background-image: url('https://res.cloudinary.com/djm7zwedb/image/upload/v1567936243/amberbar_elxpvy.svg');
    background-size: contain;
    background-repeat: repeat-x;
    background-position: top;
    width: 40px;
    height: 10px;
    margin:0;
    margin-top:10px;
`;

const NoBar = styled.div`
    background-image: url('');
    background-size: contain;
    background-repeat: repeat-x;
    background-position: top;
    width: 40px;
    height: 10px;
    margin:0;
    margin-top:10px;
`;



class BusTile extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            updated: false,
        }
    }

    componentDidMount() {
        //this.getBusArrival();
        //this.interval = setInterval(() => this.getBusArrival(), 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    distance(lon1, lat1, lon2, lat2) {
        let R = 6371; // Radius of the earth in km
        let dLat = (lat2-lat1)* Math.PI / 180;  // Javascript functions in radians
        let dLon = (lon2-lon1)* Math.PI / 180;
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1* Math.PI / 180) * Math.cos(lat2* Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c ; // Distance in km
        let time = d*1000/1.25/60;
        if (time < 1) {
            time = "< 2mins walk";
        } else if (time < 8) {
            time = Math.ceil(time*1.1);
            time = "~"+time+"mins walk";
        } else if (time < 12){
            time = Math.ceil(time*1.2);
            time = "~"+time+"mins walk";
        } else {
            time = Math.ceil(time*1.3);
            time = "~"+time+"mins walk";
        }
        if (d < 1) {
            d = (Math.round(d*1000));
            return d+"m, "+time;
        } else if (d < 2) {
            d = (Math.round(d*100))/100;
            return d+"km, "+time;
        }  else if (d < 10) {
            d = (Math.round(d*100))/100;
            return d+"km";
        } else {
            d = (Math.round(d*10))/10;
            return d+"km";
        }
        return d;
    }

    getBusArrival() {
        const reactComponent = this;
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            console.log("arrival: ",result);
            if (result.Services.length > 0) {
                reactComponent.setState({ data: result.Services[0]});
                reactComponent.setState({ updated: true});
                console.log(reactComponent.state.data);
            } else{
                console.log("undefined, probably bus no longer in service");
            }
        };
        let request = new XMLHttpRequest();
        let api_url1 = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+this.props.busPref.busstopcode;
        if (this.props.busPref.serviceno) {
            let api_url2 = "&ServiceNo="+this.props.busPref.serviceno;
            api_url1 = api_url1 + api_url2;
        }
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url1 );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();

    }

    parseTime(estimatedBusArrival) {
        let timeNow = new Date().getTime();
        let timeFromAPI = (new Date(estimatedBusArrival)).getTime();
        let timeDiff = Math.abs(timeFromAPI - timeNow )/1000/60;

        if (timeDiff < 1) {
            return  (<div className={styles.arrivalARR}> ARR </div>);
        } else if (isNaN(timeDiff)){
            return  (<div className={styles.arrivalARR}> No Est </div>);
        } else {
            // return Math.floor(timeDiff);
            return (<div><div className={styles.arrivalText}> {Math.floor(timeDiff)} </div><div className={styles.minute}>min</div></div>);
        }
    }

    loadBusTypeIcon(type) {
        if (type === "SD") {
            return (<BusType_SD></BusType_SD>)
        } else if (type === "DD") {
            return (<BusType_DD></BusType_DD>)
        } else if (type === "BD"){
            return (<BusType_BD></BusType_BD>)
        } else {
            return (<BusType_empty></BusType_empty>)
        }
    }

    loadBusWABIcon(wab) {
        if (wab === "WAB") {
            return (<WAB></WAB>)
        } else {
            return (<WAB_empty></WAB_empty>)
        }
    }

    loadBusLoad(loading) {
        if (loading === "SEA") {
            return (<GreenBar></GreenBar>)
        } else if (loading === "SDA") {
            return (<AmberBar></AmberBar>)
        } else if (loading === "LSD"){
            return (<RedBar></RedBar>)
        } else {
            return (<NoBar></NoBar>)
        }
    }


    render() {
        let d = this.distance(this.props.longitude, this.props.latitude,  this.props.busPref.longitude, this.props.busPref.latitude);
        console.log(this.props.busPref.id);

        let nextBus = "";
        let nextBus2 = "";
        let nextBus3 = "";
        let busType = "";
        let busType2 = "";
        let busType3 = "";
        let busWAB = "";
        let busWAB2 = "";
        let busWAB3 = "";
        let busLoad = "";
        let busLoad2 = "";
        let busLoad3 = "";
        let closeComponentId ="";

        if (this.state.updated) {
            nextBus = this.parseTime(this.state.data.NextBus.EstimatedArrival);
            nextBus2 = this.parseTime(this.state.data.NextBus2.EstimatedArrival);
            nextBus3 = this.parseTime(this.state.data.NextBus3.EstimatedArrival);
            busType = this.loadBusTypeIcon(this.state.data.NextBus.Type);
            busType2 = this.loadBusTypeIcon(this.state.data.NextBus2.Type);
            busType3 = this.loadBusTypeIcon(this.state.data.NextBus3.Type);
            busWAB = this.loadBusWABIcon(this.state.data.NextBus.Feature);
            busWAB2 = this.loadBusWABIcon(this.state.data.NextBus2.Feature);
            busWAB3 = this.loadBusWABIcon(this.state.data.NextBus3.Feature);
            busLoad = this.loadBusLoad(this.state.data.NextBus.Load);
            busLoad2 = this.loadBusLoad(this.state.data.NextBus2.Load);
            busLoad3 = this.loadBusLoad(this.state.data.NextBus3.Load);


        };

        return (
            <div className={styles.busTile}>

            <div className={styles.settingsBar}><div className={styles.fixedRight} onClick={(e)=>{this.props.deleteUserBusPreference(e)}} ><img data-id={this.props.busPref.id}  src="https://res.cloudinary.com/djm7zwedb/image/upload/v1568095868/closeXgrey_ruhlwz.svg" height="15" width="15"/></div></div>

                <p><span><b>{this.props.busPref.description}</b> </span>|<span> {this.props.busPref.roadname} </span>|<small> {this.props.busPref.busstopcode}, {d} </small> </p>
                <div className={styles.arrival_container}>
                    <div className={styles.serviceNo} onClick={()=>this.getBusArrival()}><div>{this.props.busPref.serviceno}</div></div>
                    <div className={styles.arrivalTag}>{nextBus}</div>
                    <div className={styles.busTag}>
                        {busType}
                        {busLoad}
                    </div>

                    {busWAB}

                    <div className={styles.arrivalTag}>{nextBus2}</div>
                    <div className={styles.busTag}>
                        {busType2}
                        {busLoad2}
                    </div>
                    {busWAB2}

                    <div className={styles.arrivalTag}>{nextBus3}</div>
                    <div className={styles.busTag}>
                        {busType3}
                        {busLoad3}
                    </div>
                    {busWAB3}

                </div>
            </div>
        );
    }
}


export default BusTile;
