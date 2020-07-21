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
            mismatch: false,
            failedUser: false,
            failedPass: false, 
        }
        this.handleChange = this.handleChange.bind(this)
        this.register = this.register.bind(this)
    }



    handleChange(event){
        if(event.target.id=="orgName")
        {
            if (event.target.value=="")
            {
                this.setState({failedUser: true})
                return;
            }
            else {
                this.setState({failedUser: false})
            }
            this.setState({org: event.target.value})
        }
        if (event.target.id=="orgPass")
        {   if (event.target.value=="" || event.target.value.length < 8)
            {
                this.setState({failedPass: true})
                return;
            }
            else {
                this.setState({failedPass: false})
            }

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
        if (this.state.org==null)
        {
            this.setState({failedUser: true})
            return
        }
        if (this.state.pass==null)
        {
            this.setState({failedPass: true})
            return
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
        <Modal isOpen={this.props.token=="register" ? true: false}>
        <ModalHeader>Create a new account for your organization {this.state.mismatch==true && <Alert color="danger">Passwords do not match</Alert>}</ModalHeader>
        <ModalBody>
            <Label for="orgName">Organization Username:</Label>
            <Input type="text" id="orgName" onChange={this.handleChange}/>
            {this.state.failedUser==true && <Alert>Username cannot be empty</Alert>}
            <Label for="orgPass">Password:</Label>
            <Input type="password" id="orgPass" onChange={this.handleChange}/>
            {this.state.failedPass==true && <Alert>Password must be at least 8 characters long</Alert>}
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