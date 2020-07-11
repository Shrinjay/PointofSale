  import React from 'react';
  import axios from 'axios';
  import {Modal, ModalHeader, ModalBody, ModalFooter, Alert, Label, Input, Button} from 'reactstrap'

  export default class Registration extends React.Component {
    constructor(props){
        super(props)
        this.state={
            org: null,
            pass: null,
            passConfirm: null,
            mismatch: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.register = this.register.bind(this)
    }
    handleChange(event){
        if(event.target.id=="orgName")
        {
            this.setState({org: event.target.value})
        }
        if (event.target.id=="orgPass")
        {

            this.setState({pass: event.target.value})
        }
        if (event.target.id=="confirmPass")
        {
            this.setState({passConfirm: event.target.value})
        }
    }

    register(){
        if (this.state.pass!=this.state.passConfirm)
        {
            this.setState({mismatch: true})
        }
        else {
            let response = axios.post('/api/users/newUser', {
                org: this.state.org,
                pass: this.state.pass
            })
            this.props.updateOrg(response.data)
        }  
    }

    render(){
        return (
        <Modal isOpen={this.props.org=="register" ? true: false}>
        <ModalHeader>Create a new account for your organization {this.state.mismatch==true && <Alert color="danger">Passwords do not match</Alert>}</ModalHeader>
        <ModalBody>
            <Label for="orgName">Organization Username:</Label>
            <Input type="text" id="orgName" onChange={this.handleChange}/>
            <Label for="orgPass">Password:</Label>
            <Input type="password" id="orgPass" onChange={this.handleChange}/>
            <Label for="confirmPass">Confirm Password:</Label>
            <Input type="password" id="confirmPass" onChange={this.handleChange}/>
        </ModalBody>
        <ModalFooter>
            <Button type="button" onClick={this.register}>Register</Button>
        </ModalFooter>
    </Modal>
        )
    }

  }