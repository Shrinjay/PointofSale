import React from 'react';
import axios from 'axios';
import {Alert, Form, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter, Button} from 'reactstrap';
export default class LogIn extends React.Component{
    constructor(props)
    {
        super(props)
        this.state={
            orgName: null,
            password: null,
            failedAuth: false,
        }
        this.checkCreds = this.checkCreds.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        if(event.target.id=="orgName")
        {
            this.setState({orgName: event.target.value})
        }
        if (event.target.id=="orgPass")
        {
            this.setState({password: event.target.value})
        }
    }


    logIn() {
        return (
            <Modal isOpen={this.props.org==null ? true:false}>
                    <ModalHeader>
                    {this.state.failedAuth==true && <Alert color="danger">Invalid username/password</Alert>}
                <h2>Please log in with your organization's credentials:</h2>
                </ModalHeader>
                <Form>
                    <ModalBody>
                    <Label for="orgName">Organization Name:</Label>
                    <Input onChange={this.handleChange} type="text" id="orgName" />
                    <Label for="orgPass">Password:</Label>
                    <Input type="password" id="orgPass" onChange={this.handleChange} />
                    </ModalBody>
                    <ModalFooter>
                    <Button type="button" onClick={this.checkCreds}>Log In</Button>
                    <Button type="button" onClick={this.props.register}>Register</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }

   async checkCreds() {
        let response = await axios.post('/api/users/login/', {
            org: this.state.orgName,
            pass: this.state.password
        })
 
        if (response.data !=  "")
        {   console.log("bruh")
            this.setState({failedAuth: false})
            this.props.updateOrg(response.data)
        }
        else {
            this.setState({failedAuth: true})
        }
    }

    render() {
       return (
           this.logIn()
       )
        
        
    }
}