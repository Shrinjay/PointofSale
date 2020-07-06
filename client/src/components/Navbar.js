import React from 'react'; 
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import {Nav, NavItem, NavLink} from 'reactstrap';
export default class Navbar extends React.Component{
    render(){
        return(
        <Nav tabs>
            <NavItem>
                <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/modify">Add/Update Inventory</NavLink>
            </NavItem>
        </Nav>
        )
    }
}