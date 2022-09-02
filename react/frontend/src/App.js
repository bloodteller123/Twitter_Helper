import React from 'react';
import './App.css';
import Home from './Home';
import {
  // BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

import HeaderLayer from './routes/HeaderLayer';
import Followings from './routes/Followings'
import TwitterLogin from './services/TwitterLogin';
import SearchComp from './services/SearchComp';
import FavouritesComp from './routes/Favourites';

function App() {
  return (
    // <Router>
      <div className="App">
        <HeaderLayer SearchComp = {SearchComp} TwitterLogin = {TwitterLogin}/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/followings" element={<Followings />} />
          <Route path="/favourites" element={<FavouritesComp />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App;