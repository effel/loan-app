import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import AppDispatcher from './AppDispatcher';
import MenuNav from './MenuNav';
import logo from './logo.svg';
import './App.css';

const AmountPlaceHolder = "Amount";
const DatePlaceHolder = "Days";
const amountMax = 401;
const daysMax = 31;
const amountPersent = 0.1;
let daysLeft;

const FormElemTemplate = ({inputFunction, textInfo, inputPlaceHolder}) => {
  return (
    <div className="InputItem">
      <input type="text" onBlur = {inputFunction} placeholder={inputPlaceHolder} />
    </div>  
  )
}

const WarningWindow = ({textMessage, CloseAction}) => {
  return (
  <div className="overlay">    
    <div className="window">
      <h2>Warning!!!</h2>
      <p>{textMessage}</p>
      <button onClick={CloseAction}>Close</button>
    </div> 
  </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Text: "",
      inputValChange:"",
      amountValue: "",
      daysValue: "",
      loanResult: "",
      showWarningRequest: false,
      windowOpen: false,
      isTooFast: true,
      isTooFastToProceed: false,
      requestIsDone: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateInputChange = this.handleDateInputChange.bind(this);   
    this.sendRequestToStorage = this.sendRequestToStorage.bind(this);  
    this.windowClose = this.windowClose.bind(this); 
  }  

  handleInputChange(event) {
    let inputVal = event.target.value;
    this.setActionToFiel(inputVal, amountMax, AmountPlaceHolder);
    this.changeAmountInputValue(inputVal);      
  }

  handleDateInputChange(event) {
    let inputVal = event.target.value;
    this.setActionToFiel(inputVal, daysMax-1, DatePlaceHolder);
    this.changeDaysInputValue(inputVal);  
  }

  setActionToFiel(inputValue,maxVal, fieldPlaceholder) {
    let inputValToNumber = parseFloat(inputValue);
    if (!inputValToNumber || inputValToNumber < 0) {
      daysLeft = "";
      this.setCommonFormCheck(inputValue, inputValToNumber); 
    } else {
      this.checkMinandMaxVal(inputValToNumber, maxVal, fieldPlaceholder); 
    }
  }

  setLoanValue(amounts, days) {
    if (Number.isInteger(amounts) && Number.isInteger(days) && (0 < amounts) && (amounts < amountMax) && (0 < days) && (days < daysMax)) {
      let result;
      daysLeft = days;
      if (days === (daysMax - 1)) {
        result = +(amounts*amountPersent) + +(amounts);
      } else {
        result = +(amounts) + (+(amounts)*amountPersent)*days/(daysMax - 1)
      }
      result = Math.ceil(result)
      this.setState({
        loanResult:  result
      });      
      this.setState({
        showWarningRequest: false
      });       
    } else {
      this.setState({
        loanResult:  ''
      });
    }   
  }

  setCommonFormCheck(defaultVal,param) {
    switch (true) {
      case (defaultVal == ""):
        this.changeInfoLAbelText("");
        break;      
      case (!Number.isInteger(param)):
        this.changeInfoLAbelText("You need to enter numbers only");
        break;
      case param < 0:
        this.changeInfoLAbelText("You could enter positive numbers only!");
        break;
      default:
        this.changeInfoLAbelText("");
        break;        
    }
  }  

  checkMinandMaxVal(inputVal, maxVal, fieldName) {
    var msgVariableParam = { msgNumValue: maxVal, fieldName: fieldName }
    let warningMsg = `You allows to input numbers till ${msgVariableParam.msgNumValue} in ${msgVariableParam.fieldName}!`;
    switch (true) {
      case inputVal > maxVal:
        this.changeInfoLAbelText(warningMsg);
        break;        
      case (0 < inputVal) && (inputVal < maxVal):
        this.changeInfoLAbelText("");
        break;
    }     
  }

  changeInfoLAbelText(text) {
      this.setState({
        Text:  text
      });
  }

  changeAmountInputValue(value) {
      this.setState({
         amountValue: value
      }, () => {this.setLoanValue(parseFloat(this.state.amountValue), parseFloat(this.state.daysValue))});
  }

  changeDaysInputValue(value) {
      this.setState({
         daysValue: value
      }, () => {this.setLoanValue(parseFloat(this.state.amountValue), parseFloat(this.state.daysValue))});
  }

  sendRequestToStorage() {
    if (!this.state.loanResult) {
      this.setState({
        showWarningRequest:  true
      });      
    } else {
      if (!this.state.isTooFast) {
        let id = Date.now();
        var item = {loanID: id, Amount: this.state.amountValue + ' $', Days: this.state.daysValue, AmountResult: this.state.loanResult + ' $'};
        AppDispatcher.dispatch({
          action: 'add-item',
          new_item: item
        });        
        this.setState({
          windowOpen:  false
        }); 
        this.setState({
          requestIsDone:  true
        });           
      } else {
        this.setState({
          isTooFastToProceed:  true
        });         
      }
    }
  }

  windowClose() {
      this.setState({
        windowOpen:  false
      });    
      this.setState({
        isTooFastToProceed:  false
      });         
  } 

  calculateSeconds() {
    setTimeout(() => { 
      this.setState({
        isTooFast:  false
      });  
    }, 30000);
  }

  componentDidMount() {
    let startDateLoad = new Date();
    this.calculateSeconds();
    setTimeout(() => { 
      this.setState({
        windowOpen:  true
      });  
    }, 60000);
  }

  render() {
    return (
      <div className="App top-padding">
         <MenuNav/>
         <form>
           <span className="InfoLabel">{this.state.Text}</span>
           { this.state.requestIsDone ? <span className="InfoLabelRequest">Your Loan was created, you could check on "Loan History" page</span> : null }             
           <FormElemTemplate inputFunction = {this.handleInputChange} textInfo = {this.state.Text} inputPlaceHolder={AmountPlaceHolder}/>
           <FormElemTemplate inputFunction = {this.handleDateInputChange} textInfo = {this.state.Text} inputPlaceHolder={DatePlaceHolder}/>  
           <p className="LabelResult"> You need to pay after {daysLeft} days:</p>
           { this.state.loanResult ? <p className="LoanResult">{this.state.loanResult}</p> : null }            
           { this.state.showWarningRequest ? <p className="SendResultError">Check if all values are valid!!!</p>  : null } 
           <button onClick={this.sendRequestToStorage}>Submit</button> 
           { this.state.windowOpen ? <WarningWindow textMessage = {"Do you need more time to proceed?"} CloseAction = {this.windowClose}/> : null }            
           { this.state.isTooFastToProceed ? <WarningWindow textMessage = {"Are you sure that you are ready?"} CloseAction = {this.windowClose}/> : null }             
         </form>

      </div>
    );
  }
}

export default App;
