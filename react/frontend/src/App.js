import React from 'react';
import './App.css';
import Home from './Home';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

function App() {
  return (
    <div className="App">
      {/* <Router>
        <div>
          <Link></Link>
        </div>
      </Router> */}

      <div>
        {/* <TwitterLogin /> */}
        <Home/>
      </div>
    </div>
  );
}

export default App;