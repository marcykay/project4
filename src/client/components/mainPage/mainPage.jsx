import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

var moment() = require('moment');

class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {
            data:"",
        };
    }



    searchDatabase() {
        const reactComponent = this;
        var responseHandler = function() {
            const result = JSON.parse(this.responseText);
            reactComponent.setState({ data:result });
            console.log(reactComponent.state.data);
            console.log(reactComponent.state.data.Services);
        };
        var request = new XMLHttpRequest();
        request.addEventListener("load", responseHandler);
        request.open("GET", "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=76209&ServiceNo=21");
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.send();
    }

    render() {
        let returnData = "";
        if (this.state.data.Services) {
            returnData = this.state.data.Services.map((bus)=>{
                return (
                    <div>
                        <table>
                            <tr>
                                <th>Bus Service</th>
                                <th>Next Bus</th>
                                <th>Next 2nd Bus</th>
                                <th>Next 3rd Bus</th>
                            </tr>
                            <tr>
                                <td>{bus.ServiceNo}</td>
                                <td>{bus.NextBus.EstimatedArrival}</td>
                                <td>{bus.NextBus2.EstimatedArrival}</td>
                                <td>{bus.NextBus3.EstimatedArrival}</td>
                            </tr>
                        </table>
                    </div>
                );
            });
        }
        return (
            <div>
            <h2 className={styles.desc}>
                MainPage Reporting
            </h2>
            <button onClick={()=>this.searchDatabase()}>search
            </button>
                {returnData}
            </div>
        );
    }
}

export default MainPage;
