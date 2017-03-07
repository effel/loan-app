import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import DataStore from './DataStore';
import MenuNav from './MenuNav';

 
class LoansStory extends Component {
  constructor(props) {
    super(props);
    this.state = {data: DataStore.getData()};
  }  

  render() {
  const ElemArr = this.state.data ? this.state.data : [];  
  const listItems = ElemArr.map((li) =>
    <ul key={li.loanID}>
      <li><span>Loan Number : </span> {li.loanID}</li>
      <li><span>Loan Amount :</span> {li.Amount}</li>  
      <li><span>Days left :</span>{li.Days}</li> 
      <li><span>Money to pay :</span>{li.AmountResult}</li>               
    </ul>
  );    
    return (
      <div className="LoansStory top-padding">
         <MenuNav/>
         <h2>Loans History</h2>
         <div className="LoansStoryList">
            {listItems}
         </div>
      </div>
    );
  }
}

export default LoansStory;