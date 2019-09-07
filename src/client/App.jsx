import React from 'react';
import {hot} from 'react-hot-loader';

// import Counter from './components/counter/counter';
// import Form from './components/form/form';
import MainPage from './components/mainPage/mainPage'
import styles from './style.scss';

class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className={styles.main_container}>
                <div className={styles.app_container}>
                    <MainPage />
                </div>
            </div>
        );
    }
}

export default hot(module)(App);
