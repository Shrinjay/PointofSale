import React from 'react';
import logo from './logo.svg';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Display from "./components/Display.component"; //Imports the display component which displays the current inventory
import MainInput from "./components/MainInput2.component";
import MyNavbar from "./components/Navbar";
import Update from "./components/UpdateDB";
import DisplayLog from './components/TLog.component'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import LogIn from './components/logIn.component';
import Register from './components/Registration.component'
import StatsView from './components/Stats.component'
import {Container, Row, Col, Button, Alert} from 'reactstrap';



//Quick note: Passing items data as props to function doesn't work because API call is asynchronous -> Maybe this means async will make accessing global state difficult in general?



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      items: [],
      accessString: sessionStorage.getItem('JWT'),
      orgName: sessionStorage.getItem('orgName'),
      logs: []
    }
    this.updateDisplay = this.updateDisplay.bind(this)
    this.getState = this.getState.bind(this)
    this.updateItems = this.updateItems.bind(this)
    this.register = this.register.bind(this)
    this.updateOrg = this.updateOrg.bind(this)
    this.logOut = this.logOut.bind(this)
    this.getLog = this.getLog.bind(this)
  }

  updateDisplay(){
    const newKey = this.state.key + 1
  this.setState({key: newKey})
  }

  getState(){
    axios.get('/api/items/', {headers: {Authorization: this.state.accessString}}) 
    .then(res => {const response = res.data;  /*Response from API is called res, this is a JSON object where the data object is the actual response
        the constant items is assigned the value of res.data*/
      this.setState({items: response});
        }) //The state items is set to the same value as the constant items
  }

  logOut() {
    sessionStorage.clear()
    this.setState({accessString: null, orgName: null, items: [], logs: []})
  }

  updateItems(updatedState){
    this.setState({items: updatedState})
   
  }

  updateOrg(JWT, orgName){
    sessionStorage.setItem('JWT', JWT);
    sessionStorage.setItem('orgName', orgName)
    this.setState({accessString: sessionStorage.getItem('JWT'), orgName: orgName}, function() {
 
      this.getState();
      this.getLog();
    }) 
  }

  getLog(){
    axios.get('/api/log/', {headers: {
        Authorization: this.state.accessString
    }})
   .then(response => this.setState({logs: response.data}))
    
}


register() {
  
  this.setState({accessString: "register"}) 
} 


async componentDidMount(){
 
  this.getState()
  this.getLog()

 
  }



  
  render (){ 
  
    return (
    <div className="App">
      <MyNavbar token={this.state.accessString} updateOrg={this.logOut}/>
      
      {this.state.accessString==null && <LogIn updateOrg={this.updateOrg} token={this.state.accessString} register={this.register}/>}
      {this.state.accessString=="register" && <Register logOut={this.logOut} updateOrg={this.updateOrg} token={this.state.accessString}/>}
      {this.state.accessString!=null && this.state.accessString!="register" && <Alert>You're logged in as {this.state.orgName}</Alert>}
      <Router>
     <Switch>
       <Route exact path="/" component={App}>
         <Container fluid={true}>
           <Row>
             <Col md="6">
             <Display token={this.state.accessString} key={this.state.key} items={this.state.items}/> {/*Just renders the display component*/}
             </Col>
             <Col md='6'>
              <DisplayLog logs={this.state.logs} token={this.state.accessString} />
             </Col>
           </Row>
           <Row>
             <Col md={{offset: 3, size: 3}}> <Button color="primary" size="lg" href="/sell" block><br /><h2>Sell Items</h2><br /></Button></Col>
          <Col md={{ size: 3}}> <Button color="primary" size="lg" href="/modify" block><br /><h3>Add/Update Inventory</h3><br /></Button></Col>
          
           </Row>
         </Container>
       
       </Route>
       <Route exact path="/sell/" component={App}>
       <MainInput token={this.state.accessString} getState={this.getState} items={this.state.items}/>
        </Route>
        <Route exact path="/modify/" component={App}>
          <Update token={this.state.accessString} orgName={this.state.orgName } items={this.state.items} getState={this.getState} updateState={this.updateItems}/>
        </Route>
      </Switch>
      <Route exact path='/stats/' component={App}>
        <StatsView token={this.state.accessString} />
      </Route>
      </Router>
        
    </div>
  )
}
}

export default App;
