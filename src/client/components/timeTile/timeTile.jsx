import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

class TimeTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            time: new Date(),
        };
    }

    componentDidMount() {
        const height = this.divElement.clientHeight;
        this.timerID = setInterval( () => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({ time: new Date() });
    }

    render() {
        let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return (
            <div className={styles.timeTile} ref={ (divElement) => this.divElement = divElement}>
                <div>
                    <div className={styles.date}>{this.state.date.toLocaleDateString('en-SG', options)}
                    </div>
                    <div className={styles.time}>{this.state.time.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        );
    }
}


export default TimeTile;
