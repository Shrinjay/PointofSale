//Imports
import React from 'react';
import logo from './logo.svg';
import axios from 'axios';

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

//Class-based app component
class App extends React.Component {

  //Constructor, state and bindings
  //Inventory, auth token, orgname and logs are stored in the App component as they are used by multiple components
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      accessString: sessionStorage.getItem('JWT'),
      orgName: sessionStorage.getItem('orgName'),
      logs: []
    }
  
    this.getState = this.getState.bind(this)
    this.updateItems = this.updateItems.bind(this)
    this.register = this.register.bind(this)
    this.updateOrg = this.updateOrg.bind(this)
    this.logOut = this.logOut.bind(this)
    this.getLog = this.getLog.bind(this)
  }

  //Get inventory data and save to state
  getState(){
    axios.get('/api/items/', {headers: {Authorization: this.state.accessString}}) 
    .then(res => {const response = res.data; 
      this.setState({items: response});
        }) 
  }

  //Handle user logout
  logOut() {
    sessionStorage.clear()
    this.setState({accessString: null, orgName: null, items: [], logs: []})
  }

  //Update Inventory
  updateItems(updatedState){this.setState({items: updatedState})
  }

  //Update Organization on Login/Registration
  //JWT and Organization name are kept seperately to avoid having to decrypt the signed jwt client side, so private key isn't introduced into client.
  updateOrg(JWT, orgName){
    sessionStorage.setItem('JWT', JWT);
    sessionStorage.setItem('orgName', orgName)
    this.setState({accessString: sessionStorage.getItem('JWT'), orgName: orgName}, function() {
      this.getState();
      this.getLog();
    }) 
  }

  //Get transaction logs
  getLog(){
    axios.get('/api/log/', {headers: {
        Authorization: this.state.accessString
    }})
   .then(response => this.setState({logs: response.data}))
}

//Set state to register to trigger registration system
register() {this.setState({accessString: "register"})}

//Get inventory and transaction logs when component mounts
componentDidMount(){
  this.getState()
  this.getLog()
  }

  render (){ 
  
    return (
    //Main Div
    <div className="App">
      {/*Navbar Component*/}
      <MyNavbar token={this.state.accessString} updateOrg={this.logOut}/>
      
      {/*Displays login, registration, or current organization depending on state*/}
      {this.state.accessString==null && <LogIn updateOrg={this.updateOrg} token={this.state.accessString} register={this.register}/>}
      {this.state.accessString=="register" && <Register logOut={this.logOut} updateOrg={this.updateOrg} token={this.state.accessString}/>}
      {this.state.accessString!=null && this.state.accessString!="register" && <Alert>You're logged in as {this.state.orgName}</Alert>}

  {/*Router to manage all routes for the application*/}
  <Router>
    {/*Home page route*/}
    <Route exact path="/" component={App}>
         <Container fluid={true}>
           <Row>
             <Col sm="6">
             <Display token={this.state.accessString} items={this.state.items}/> {/*Just renders the display component*/}
             </Col>
             <Col sm='6'>
              <DisplayLog logs={this.state.logs} token={this.state.accessString} />
             </Col>
           </Row>
           <Row>
            <Col sm={{offset: 3, size: 3}}> <Button color="primary" size="lg" href="/sell" block><br /><h2>Sell Items</h2><br /></Button></Col>
            <Col sm={{ size: 3}}> <Button color="primary" size="lg" href="/modify" block><br /><h3>Add/Update Inventory</h3><br /></Button></Col>
           </Row>
         </Container>
    </Route>

        {/*Sell Items Route*/}
       <Route exact path="/sell/" component={App}>
       <MainInput token={this.state.accessString} getState={this.getState} items={this.state.items}/>
        </Route>

        {/*Modify Inventory Route*/}
        <Route exact path="/modify/" component={App}>
          <Update token={this.state.accessString} items={this.state.items} getState={this.getState} updateState={this.updateItems}/>
        </Route>
      
      {/*View Statistics Route*/}
      <Route exact path='/stats/' component={App}>
        <StatsView token={this.state.accessString} />
      </Route>
       
  </Router>
    </div>
  )
}
}

export default App;
