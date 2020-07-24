import React from 'react';
import {Container, Row, Col, Form, Button, Jumbotron, Table, Label, Input, Alert} from 'reactstrap';
import Axios from 'axios';

export default class Update extends React.Component{
    constructor(props){
    super(props);
    this.state={
        toAdd: {
            name: null,
            price: null,
            inventory: null,
            failedAdd: false
        },
    }
    this.handleChange = this.handleChange.bind(this)
    this.addItem = this.addItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    }
    renderButtons(){
        return this.props.items.map(element => 
            <tr>
                <td>{element.name}</td>
                <td><form ><input onChange={this.handleChange} type="number" id={element.name} name="inventory" value={element.inventory} /></form></td>
                <td><Button id={element.name} onClick={this.deleteItem}>Delete</Button></td>
            </tr>)
    }
   async handleChange(event){
       if (event.target.name=='inventory'){
        let id = event.target.id //Can I use documentGetElementByID here as well? 
        let updatedState = this.props.items
        let index = updatedState.findIndex(element => element.name==id)
        updatedState[index].inventory=document.getElementById(id).valueAsNumber
        this.props.updateState(updatedState);
        let response = await Axios.put('/api/items/update',{
            name: updatedState[index].name, 
            newInventory: updatedState[index].inventory
        }, {headers: {Authorization: this.props.token}})
        return response;
    }
    let updatedStateAdd=this.state.toAdd
    if (event.target.name=='inputName'){
        
        updatedStateAdd.name=event.target.value
        this.setState({toAdd: updatedStateAdd}, console.log(this.state.toAdd))
    }
    if (event.target.name=='inputPrice')
    {
        
        updatedStateAdd.price=event.target.value
        this.setState({toAdd: updatedStateAdd}, console.log(this.state.toAdd))
    }
    if(event.target.name=='inputInventory')
    {
        updatedStateAdd.inventory=event.target.value
        this.setState({toAdd: updatedStateAdd}, console.log(this.state.toAdd))
    }
    }

   

  async addItem(){
      this.setState({failedAdd: false})
      if (this.state.toAdd.name==null || this.state.toAdd.inventory==null || this.state.toAdd.inventory==null)
      {
            this.setState({failedAdd: true})
            return
      }
        let response = await Axios.post('/api/items/add', {
            name: this.state.toAdd.name,
            inventory: this.state.toAdd.inventory, 
            price: this.state.toAdd.price
        }, {headers: {
            Authorization: this.props.token
        }})
        this.props.getState();
        return response;
    }

    async deleteItem(event){
        let response = await Axios.delete('/api/items/delete', {
           data:{ name: event.target.id},
           headers: {Authorization: this.props.token}
        }).catch((error)=>console.log(error))
        this.props.getState();
        return response;

    }

    render(){
        return(
            <div>
                <Container fluid={true}>
                    <Row>
                    <Col md={{size: 10, offset: 1}}>
                <Table striped bordered>
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Inventory</th>
                        <th>Delete Items</th>
                    </tr>
                    </thead>
            {this.renderButtons()}
            </Table>
            </Col>
            </Row>
           

           
             <Form>
                 <Row>
                     <Col md={{size: 6, offset: 3}}>
                {this.state.failedAdd==true && <Alert color="danger">One or more fields are empty!</Alert>}
                <Label for="inputName">Item Name:</Label>
                <Input onChange={this.handleChange} type="text" name="inputName" id="inputName" />
                </Col>
                </Row>

                <Row>
                <Col md={{size: 3, offset: 3}}>
                <Label for="inputInventory">Current Inventory:</Label>
                <Input onChange={this.handleChange} type="number" name="inputInventory" id="inputInventory" />
                </Col>
                <Col md={{size: 3}}>
                <Label for="inputPrice">Item Price:</Label>
                <Input onChange={this.handleChange} type="number" name="inputPrice" id="inputPrice" />
                </Col>
                </Row>
                
                
                <br />
                <Row>
                    <Col md={{size: 4, offset: 4}}>
                <Button color="success" block onClick={this.addItem}>Add New Item</Button>
                </Col>
                </Row>
            </Form>
            </Container>
            
           
            </div>
            
        )
    }
}