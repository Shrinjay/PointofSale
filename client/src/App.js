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

import {Container, Row, Col, Button, Alert} from 'reactstrap';
//Quick note: Passing items data as props to function doesn't work because API call is asynchronous -> Maybe this means async will make accessing global state difficult in general?



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      items: [],
      org: sessionStorage.getItem('org')
    }
    this.updateDisplay = this.updateDisplay.bind(this)
    this.getState = this.getState.bind(this)
    this.updateItems = this.updateItems.bind(this)
    this.register = this.register.bind(this)
    this.updateOrg = this.updateOrg.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  updateDisplay(){
    const newKey = this.state.key + 1
  this.setState({key: newKey})
  }

  getState(){
    console.log(this.state.org)
    axios.get('/api/items/', {params:  {org: this.state.org}}) 
    .then(res => {const response = res.data; console.log(response) /*Response from API is called res, this is a JSON object where the data object is the actual response
        the constant items is assigned the value of res.data*/
      this.setState({items: response});
        }) //The state items is set to the same value as the constant items
  }

  logOut() {
    this.setState({org: null})
  }

  updateItems(updatedState){
    this.setState({items: updatedState})
   
  }

  updateOrg(user){
    sessionStorage.setItem('org', user);
    this.setState({org: sessionStorage.getItem('org')}, function() {
    
      this.getState();
    }) 
  }


register() {
  this.setState({org: "register"})
} 


componentDidMount(){
  if (this.state.org!=null || this.state.org!="register")
  { 
    console.log("pok")
  this.getState()
  }
  }



  
  render (){ return (
    <div className="App">
      <MyNavbar org={this.state.org} updateOrg={this.logOut}/>
      {this.state.org==null && <LogIn updateOrg={this.updateOrg} register={this.register}/>}
      {this.state.org=="register" && <Register updateOrg={this.updateOrg} org={this.state.org}/>}
      {this.state.org!=null && <Alert>You're logged in as {this.state.org}</Alert>}
      <Router>
     <Switch>
       <Route exact path="/" component={App}>
         <Container fluid={true}>
           <Row>
             <Col md="6">
             <Display key={this.state.key} items={this.state.items}/> {/*Just renders the display component*/}
             </Col>
             <Col md='6'>
              <DisplayLog />
             </Col>
           </Row>
           <Row>
             <Col md={{offset: 3, size: 3}}> <Button color="primary" size="lg" href="/sell" block><br /><h2>Sell Items</h2><br /></Button></Col>
          <Col md={{ size: 3}}> <Button color="primary" size="lg" href="/modify" block><br /><h3>Add/Update Inventory</h3><br /></Button></Col>
          
           </Row>
         </Container>
       
       </Route>
       <Route exact path="/sell/" component={App}>
       <MainInput currentOrg={this.state.org} getState={this.getState} items={this.state.items}/>
        </Route>
        <Route exact path="/modify/" component={App}>
          <Update currentOrg={this.state.org} items={this.state.items} getState={this.getState} updateState={this.updateItems}/>
        </Route>
      </Switch>
      </Router>
        
    </div>
  )
}
}

export default App;
