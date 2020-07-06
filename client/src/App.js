import React from 'react';
import logo from './logo.svg';
import axios from 'axios';


import Display from "./components/Display.component"; //Imports the display component which displays the current inventory
import MainInput from "./components/MainInput2.component";
import MyNavbar from "./components/Navbar";
import Update from "./components/UpdateDB";
import DisplayLog from './components/TLog.component'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import {Container, Row, Col, Button} from 'reactstrap';
//Quick note: Passing items data as props to function doesn't work because API call is asynchronous -> Maybe this means async will make accessing global state difficult in general?

const api = axios.create({
  headers: {'Cache-Control': 'no-cache'}
})

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      items: [],
    }
    this.updateDisplay = this.updateDisplay.bind(this)
    this.getState = this.getState.bind(this)
    this.updateItems = this.updateItems.bind(this)
  }

  updateDisplay(){
    const newKey = this.state.key + 1
  this.setState({key: newKey})
  }

  getState(){
    axios.get('/api/items') 
    .then(res => {const response = res.data; /*Response from API is called res, this is a JSON object where the data object is the actual response
        the constant items is assigned the value of res.data*/
      this.setState({items: response});
        }) //The state items is set to the same value as the constant items
  }

  updateItems(updatedState){
    this.setState({items: updatedState}, this.updateDisplay())
   
  }


componentDidMount(){
  this.getState()
  
  }

  
  render (){ return (
    <div className="App">
      <MyNavbar />
      <Router>
     <Switch>
       <Route exact path="/">
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
          <Col md={{ size: 3}}> <Button color="primary" size="lg" href="/modify" block><br /><h2>Add/Update Inventory</h2><br /></Button></Col>
          
           </Row>
         </Container>
       
       </Route>
       <Route exact path="/sell">
       <MainInput getState={this.getState} items={this.state.items}/>
        </Route>
        <Route path="/modify">
          <Update items={this.state.items} getState={this.getState} updateState={this.updateItems}/>
        </Route>
      </Switch>
      </Router>
        
    </div>
  )
}
}

export default App;
