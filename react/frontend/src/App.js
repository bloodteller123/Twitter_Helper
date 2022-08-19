import React from 'react';
import './App.css';
import Home from './Home';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <div>
        <Home/>
      </div>
    </div>
  );
}

export default App;