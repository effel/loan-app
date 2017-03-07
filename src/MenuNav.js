import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

class MenuNav extends Component {
  constructor(props) {
    super(props);
  }  
  render() {
    return (
      <div  className="MenuNav">
        <ul>
           <li><Link to="/" activeClassName="active">Home</Link></li>
           <li><Link to="loansStory" activeClassName="active">Loans Story</Link></li>        
        </ul>
      </div>
    );
  }
}

export default MenuNav;