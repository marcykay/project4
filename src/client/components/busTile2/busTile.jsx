import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

class BusTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            time: new Date(),
        };
    }

    componentDidMount() {
        this.timerID = setInterval( () => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({ time: new Date() });
    }

    render() {
        return (
            <div className={styles.busTile}>
            <div className={styles.date}>{this.state.date.toLocaleDateString()}</div>
                <div className={styles.time}>{this.state.time.toLocaleTimeString()}</div>
            </div>
        );
    }
}


export default BusTile;
