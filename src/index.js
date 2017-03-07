import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import App from './App';
import LoansStory from './LoansStory';
import './index.css';


let routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
        </Route>
        <Route path="loansStory" component={LoansStory}></Route>
    </Router>
);
ReactDOM.render((routes), document.getElementById("root"))