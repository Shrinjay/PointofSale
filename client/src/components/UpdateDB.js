//Imports
import React from 'react';
import { Container, Row, Col, Form, Button, Jumbotron, Table, Label, Input, Alert } from 'reactstrap';
import Axios from 'axios';

//Component allows user to update inventory.
export default class Update extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    //Render entries for each item in the inventory update table.
    renderButtons() {
        return this.props.items.map(element =>
            <tr>
                <td>{element.name}</td>
                <td><form ><input onChange={this.handleChange} type="number" id={element.name} name="inventory" value={element.inventory} /></form></td>
                <td><Button id={element.name} onClick={this.deleteItem}>Delete</Button></td>
            </tr>)
    }

    updateDB(event) {
        let id = event.target.id
        let updatedState = this.props.items
        let index = updatedState.findIndex(element => element.name == id)
        updatedState[index].inventory = document.getElementById(id).valueAsNumber
        this.props.updateState(updatedState);
        Axios.put('/api/items/update', {
            name: updatedState[index].name,
            newInventory: updatedState[index].inventory
        }, { headers: { Authorization: this.props.token } })
            .then((response) => { return response })
            .catch(err => console.log(err))
    }

    //Handle form input and update database.
    handleChange(event) {
        if (event.target.name == 'inventory') this.updateDB(event) //If change is in a form named inventory, inventory count in DB for that item is updated

        //Else, input is a new item to be added. 
        else {
            let updatedStateAdd = this.state.toAdd //Copy of toAdd object in state, have to update the whole object then set state because React.
            if (event.target.name == 'inputName') {

                updatedStateAdd.name = event.target.value
                this.setState({ toAdd: updatedStateAdd })
            }
            if (event.target.name == 'inputPrice') {

                updatedStateAdd.price = event.target.value
                this.setState({ toAdd: updatedStateAdd })
            }
            if (event.target.name == 'inputInventory') {
                updatedStateAdd.inventory = event.target.value
                this.setState({ toAdd: updatedStateAdd })
            }
        }
    }


    //Add a new item to the database
    addItem() {
        this.setState({ failedAdd: false })
        if (this.state.toAdd.name == null || this.state.toAdd.inventory == null || this.state.toAdd.inventory == null) {
            this.setState({ failedAdd: true })
            return
        }
        Axios.post('/api/items/add', {
            name: this.state.toAdd.name,
            inventory: this.state.toAdd.inventory,
            price: this.state.toAdd.price
        }, {
            headers: {
                Authorization: this.props.token
            }
        }).then((response) => {
            this.props.getState();
            return response;
        })
            .catch(err => console.log(err))

    }

    deleteItem(event) {
        Axios.delete('/api/items/delete', {
            data: { name: event.target.id },
            headers: { Authorization: this.props.token }
        })
            .then((response) => {
                this.props.getState();
                return response;
            })
            .catch((error) => console.log(error))


    }

    render() {
        return (
            <div>
                <Container fluid={true}>
                    <Row>
                        <Col md={{ size: 10, offset: 1 }}>
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
                            <Col md={{ size: 6, offset: 3 }}>
                                {this.state.failedAdd == true && <Alert color="danger">One or more fields are empty!</Alert>}
                                <Label for="inputName">Item Name:</Label>
                                <Input onChange={this.handleChange} type="text" name="inputName" id="inputName" />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={{ size: 3, offset: 3 }}>
                                <Label for="inputInventory">Current Inventory:</Label>
                                <Input onChange={this.handleChange} type="number" name="inputInventory" id="inputInventory" />
                            </Col>
                            <Col md={{ size: 3 }}>
                                <Label for="inputPrice">Item Price:</Label>
                                <Input onChange={this.handleChange} type="number" name="inputPrice" id="inputPrice" />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={{ size: 4, offset: 4 }}>
                                <Button color="success" block onClick={this.addItem}>Add New Item</Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>


            </div>

        )
    }
}