import React from 'react';
import logo from './logo.svg';
import './App.css';
import TwitterLogin from './services/TwitterLogin';


function App() {
  return (
    <div className="App">
      <div>
        <TwitterLogin />
      </div>
    </div>
  );
}

export default App;
