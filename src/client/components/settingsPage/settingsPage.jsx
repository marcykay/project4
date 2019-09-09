import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

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


        return (
            <div className={styles.settingsPage}>
                <h2>Settings</h2>
                <h3>Search By Location</h3>
                <button onClick={()=>this.props.getBusStopsInfo()}>Load Bus Stops</button>
                <p>Enter road names or bus stop names</p>
                <p><input type="text" onChange={ (event)=>this.props.inputSearchNamesHandler(event) } value={this.props.inputSearchField} /></p>
                <p>{selectorBusStops}</p>
            </div>
        );
    }
}


export default SettingsPage;
