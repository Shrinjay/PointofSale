import React from 'react'; 
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import {Nav, NavItem, NavLink} from 'reactstrap';
export default class Navbar extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
        <Nav tabs>
            <NavItem>
                <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/modify">Add/Update Inventory</NavLink>
            </NavItem>
            <NavItem>
            <NavLink href="/stats">Statistics</NavLink>
        </NavItem>
            {this.props.token!=null && <NavItem><NavLink href="#" onClick={this.props.updateOrg}> Log Out </NavLink></NavItem>}
           
        </Nav>
       
        )
    }
}