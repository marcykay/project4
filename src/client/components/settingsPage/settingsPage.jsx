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
    selectHandler(event, busStopCode) {
        let elements = document.querySelectorAll('.serviceTag');
        elements.forEach((ele)=>{
            ele.style.color="white"});
        this.setState({showButton: false});
        this.props.selectorNamesHandler(busStopCode);
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
        this.props.addUserBusPreference();
        this.setState = ({showButton: false});
    }


    render() {
        //selector for bus stops
        let selectorBusStops = "";
        if (this.props.filteredBusStops.length > 0) {
            let busStopOption = "";
            busStopOption = this.props.filteredBusStops.map( (busStop, index)=>{
                return (
                    <option key={index} value={busStop.BusStopCode} onClick={(e)=>this.selectHandler(e, busStop.BusStopCode)}> {busStop.BusStopCode}, {busStop.Description}, {busStop.RoadName} </option>
                );
            });

            selectorBusStops = (
                <label><p>Select your location</p>
                    <select size="5">
                    {busStopOption}
                    </select>
                </label>
            );
        }

        // display the buses available at the selected bus stop
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
                <h3>Add Preferences</h3>
                <p>Enter road names or bus stop names</p>
                <p><input type="text" placeholder="Address, bus stop number" onChange={ (event)=>this.props.inputSearchNamesHandler(event) } value={this.props.inputSearchField} /></p>
                {selectorBusStops}

                <div className={styles.services_container}> {busServiceNos}
                    {
                        this.state.showButton ? (<button className="clickAddButton" onClick={()=>this.addPreferenceHandler()}> Click to Add ➡️ </button>)
                        : (null)
                    }
                </div>
                <div className={styles.settingsBar}><a href="../login"><div className={styles.fixedRight}><img src="https://res.cloudinary.com/djm7zwedb/image/upload/v1568095026/logout_gn64mc.svg" height="30" width="30"/></div></a></div>

            </div>
        );
    }
}


export default SettingsPage;
