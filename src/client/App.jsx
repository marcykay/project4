import React from 'react';
import { hot } from 'react-hot-loader';

// import Counter from './components/counter/counter';
// import Form from './components/form/form';
import MainPage from './components/mainPage/mainPage'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h3>Have A Good Day!</h3>
        <MainPage />
      </div>
    );
  }
}

export default hot(module)(App);
