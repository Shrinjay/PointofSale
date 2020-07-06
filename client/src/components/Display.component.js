import React from 'react';
import axios from 'axios';
import {Container, Row, Col} from 'reactstrap';
import App from "../App";


export default class Display extends React.Component{ //Exports Display as the default class from this file so it is accessed from other files
  constructor(props){ 
    super(props);
    
  }
  
  tableData() { //A function that maps the item data to a table
      return this.props.items.map(item =>  /*Return means this is what the function renders, map iterates over an array, item is the key, 
        referring to the item in the current index the function is looking at. SEARCH WHY THE BODY OF THE FUNCTION IS JSX*/
          <tr> {/*Creates a new table row*/}
              <td>{item.name}</td> {/*For each item, a new data cell containing item.name is created, same for rest */}
      <td>${item.price}.00</td>
      <td>{item.inventory} units</td>
          </tr>
      );
  }
  render(){
    return( 
        
        <div>
            
              <span style={{textAlign: 'center'}}><h1>Current Inventory</h1></span>
           
            <div style={{textAlign: 'center'}}>
                
                <table class="table">
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Inventory</th>
                    </tr>
                    {this.tableData()} {/**Calls the function tableData(), which is why empty brackets exist */}
                </table>
               
            </div>
        </div>
    )
  }
}
