import React from 'react';
import './App.css';
import TwitterLogin from './services/TwitterLogin';
import Home from './Home';


function App() {
  return (
    <div className="App">
      <div>
        {/* <TwitterLogin /> */}
        <Home/>
      </div>
    </div>
  );
}

export default App;