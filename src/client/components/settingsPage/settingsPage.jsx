import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

import styled from 'styled-components';

import 'boxicons';

const ServiceNo = styled.div`
    background-color: rgba(120,120,120,0.5);
    padding:0;
    font-size: 2em;
    display: flex;
    min-width: 60px;
    text-align: center;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    height: 60px;
    color:white;
    margin-right:10px;
    margin-top:10px;
`;

class SettingsPage extends React.Component {
    constructor() {
        super();
        this.state = {
            showButton: false,
        }
    }

    componentDidMount() {
        this.props.getBusStopsInfo();
    }

    componentWillUnmount() {

    }
    // bus stop selector
    selectHandler(event) {
        console.log("event target");
        console.log(event.target.value);
        let elements = document.querySelectorAll('.serviceTag');
        elements.forEach((ele)=>{
            ele.style.color="white"});
        this.setState({showButton: false});
        this.props.selectorNamesHandler(event);
    }

    //bus service nos
    clickHandler(event) {
        let elements = document.querySelectorAll('.serviceTag');
        if (event.target.style.color==="yellow") {
            event.target.style.color="white";
            this.setState({showButton: false});
        } else {
            elements.forEach((ele)=>{
                ele.style.color="white"});
            event.target.style.color="yellow";
            this.setState({showButton: true});
        }

        this.props.clickAddServiceNoHandler(event);
    }

    // click to add to database
    addPreferenceHandler() {
        let count= Math.floor(Math.random()*100);
        console.log("add preference : ", count);
        //this.props.addUserBusPreference();
    }


    render() {
        //selector for bus stops
        let selectorBusStops = "";
        if (this.props.filteredBusStops.length > 0) {
            let busStopOption = "";
            busStopOption = this.props.filteredBusStops.map( (busStop, index)=>{
                return (
                    <option key={index} value={busStop.BusStopCode}> {busStop.BusStopCode}, {busStop.Description}, {busStop.RoadName} </option>
                );
            });

            selectorBusStops = (
                <label><p>Select your location</p>
                    <select size="8" onChange={(event)=>this.selectHandler(event)}>
                    {busStopOption}
                    </select>
                </label>
            );
        }

        let busServiceNos = "";

        if (this.props.data.Services) {
            busServiceNos = this.props.data.Services.map((bus, index)=>{
                return (
                        <ServiceNo className="clickAdd serviceTag" key={index} onClick={(event)=>this.clickHandler(event)}>{bus.ServiceNo}</ServiceNo>
                );
            });
        }

        let addToPreference = "";

        return (
            <div className={styles.settingsPage}>

                <h2>Add Preferences</h2>
                <p>Enter road names or bus stop names</p>
                <p><input type="text" placeholder="Address, bus stop number" onChange={ (event)=>this.props.inputSearchNamesHandler(event) } value={this.props.inputSearchField} /></p>
                {selectorBusStops}

                <div className={styles.services_container}> {busServiceNos}
                    {
                        this.state.showButton ? (<button className="clickAddButton" onClick={this.props.addUserBusPreference()}> Click to Add >> </button>)
                        : (null)
                    }
                </div>

            </div>
        );
    }
}


export default SettingsPage;
