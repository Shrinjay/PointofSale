//Imports
import React from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

//Displays transaction log, logs are passed in as a prop.
export default class DisplayLog extends React.Component {
    constructor() {
        super();
    }

    //Displays 4 most recent entries in the transaction log.
    displayLog() {

        let size = this.props.logs.length;

        return this.props.logs.slice(size - 4).map(element =>
            <tr>
                <td>
                    {element.date}
                </td>
                <td>

                    {element.items.map(item => <span>{item}, </span>)}
                </td>
                <td>
                    ${element.total}
                </td>
            </tr>
        )


    }

    render() {
        return (
            <div>
                <h1>Recent Transactions</h1>
                <Table>
                    <thead>
                        <th><b>Date:Time</b></th>
                        <th><b>Items Sold</b></th>
                        <th><b>Total Transaction</b></th>
                    </thead>
                    {this.displayLog()}
                </Table>
            </div>
        )
    }
}