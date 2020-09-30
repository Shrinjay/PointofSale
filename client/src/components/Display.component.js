//Imports
import React from 'react';
import axios from 'axios';
import {Container, Row, Col, Table} from 'reactstrap';
import App from "../App";

//Display class displays the current inventory
export default class Display extends React.Component{ 
  
  //Get props from constructor
  constructor(props){ 
    super(props);
  }
  
  //Maps over inventory and creates table row for each one.
tableData() { 
  return this.props.items.map(item =>  
     <tr> 
      <td>{item.name}</td> 
      <td>${item.price}</td>
      <td>{item.inventory} units</td>
    </tr>
      )
  }

  render(){
    return( 
        <div>  
            <span style={{textAlign: 'center'}}><h1>Current Inventory</h1></span>
            <div style={{textAlign: 'center'}}>
                <Table>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Inventory</th>
                    </tr>
                    {this.tableData()} 
                </Table>
            </div>
        </div>
    )
  }
}
