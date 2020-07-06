import React from 'react';
import axios from 'axios';
import {Table} from 'reactstrap';
export default class DisplayLog extends React.Component {
    constructor(){
        super();
        this.state={
            log:[]
        }
    }

    componentDidMount(){
        this.getLog()
    }

    async getLog(){
        let response = await axios.get('/api/log/')
        this.setState({log: response.data})
    }

    displayLog(){
           
            return this.state.log.map(element => 
                <tr>
                <td>
                    {element.date}
                </td>
                <td>
                    
                    {element.items.map(item=> <span>{item}, </span>)}
                </td>
                <td>
                    ${element.total}
                </td>
                </tr>
            )
        
        
    }

    render(){
        return(
            <div>
            <h1>Recent Transactions</h1>
            <Table>
                <thead>
                    <td><b>Date:Time</b></td>
                    <td><b>Items Sold</b></td>
                    <td><b>Total Transaction</b></td>
                </thead>
                {this.displayLog()}
            </Table>
        </div>
        )
    }
}