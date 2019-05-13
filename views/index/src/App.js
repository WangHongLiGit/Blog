import React, { Component } from 'react';
import './App.css';

//react路由的引入
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

//semantic中css的引入
import 'semantic-ui-css/semantic.min.css';

//各种页面的引入
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div>
        <Route path="/" component={HomePage}></Route>
      </div>
    </Router>
  );
}

export default App;
