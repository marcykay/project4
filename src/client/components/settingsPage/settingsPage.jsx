import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

import styled from 'styled-components';

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
    margin-bottom:10px;
`;

class SettingsPage extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

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
                    <select size="8" onChange={(event)=>this.props.selectorNamesHandler(event)}>
                    {busStopOption}
                    </select>
                </label>
            );
        }

        let busServiceNos = "";

        if (this.props.data.Services) {
            busServiceNos = this.props.data.Services.map((bus, index)=>{
                return (
                        <ServiceNo key={index}>{bus.ServiceNo}</ServiceNo>
                );
            });
        }


        return (
            <div className={styles.settingsPage}>
                <h2>Add Preferences</h2>
                <h3>Search By Road Names or </h3>
                <button onClick={()=>this.props.getBusStopsInfo()}>Load Bus Stops</button>
                <p>Enter road names or bus stop names</p>
                <p><input type="text" placeholder="Address, bus stop number" onChange={ (event)=>this.props.inputSearchNamesHandler(event) } value={this.props.inputSearchField} /></p>
                <p>{selectorBusStops}</p>
                <div className={styles.services_container}> {busServiceNos} </div>
            </div>
        );
    }
}


export default SettingsPage;
