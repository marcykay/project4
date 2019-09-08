import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

class BusTile extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
        }
    }

    getBusArrival(bus_stop_code, service_no) {
        const reactComponent = this;
        let responseHandler = function() {
            const result = JSON.parse(this.responseText);
            // result.Services.sort( (a,b) => (parseInt(a.ServiceNo) > parseInt(b.ServiceNo) ) ? 1: -1 );
            // reactComponent.setState({ data:result });
            console.log("arrival: ",result.Services[0]);
            console.log("------------------------------");

            // reactComponent.setState({ data: });
        };
        let request = new XMLHttpRequest();
        let api_url1 = "https://cors-anywhere.herokuapp.com/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+bus_stop_code;
        if (service_no) {
            let api_url2 = "&ServiceNo="+service_no;
            api_url1 = api_url1 + api_url2;
        }
        request.addEventListener("load", responseHandler);
        request.open("GET", api_url1 );
        request.setRequestHeader('AccountKey', 'o73n5Dg0SfWF32z1JpnyuQ==');
        request.setRequestHeader('accept', 'application/json');
        request.send();

    }

    render() {
        let busArticle = "";
        // busArticle =  if (this.props.busPref) : {
        //     console.log("running");
        //     let item = this.props.busPref;
        //     return (
        //         <div key={index}><p><span>{this.props.busPref.description} </span>|<span> {this.props.busPref.roadname}</span></p>
        //             <p><small> {this.props.busPref.busstopcode} </small></p>
        //             <span>{this.props.busPref.serviceno}</span><span></span>
        //         </div>
        //     )} : "";
        //         // let arr = this.state.data;
        //         // arr.push(index);
        //         // this.setState({data : arr});
        //         // console.log(this.state.data);
        //         //this.getBusArrival(item.busstopcode, item.serviceno);
        //
        //
        // }

        return (
            <div className={styles.busTile}>
                <p><span><b>{this.props.busPref.description}</b> </span>|<span> {this.props.busPref.roadname}</span></p>
                <p><small> {this.props.busPref.busstopcode} </small></p>
                <span>{this.props.busPref.serviceno}</span><span></span>
            </div>
        );
    }
}


export default BusTile;
