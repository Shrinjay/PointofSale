import React from 'react'
import axios from 'axios'
import {Jumbotron} from 'reactstrap'

export default class Stats extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            totalSalesToday: 0,
            percentChange: 0,
        }
        this.getData = this.getData.bind(this)
    }

    async getData() {
        let responseSales = await axios.get('/api/statistics/sales/', {headers: {
            Authorization: this.props.token
        }})
        let responseChange = await  axios.get('/api/statistics/change/', {headers: {
            Authorization: this.props.token
        }})
        console.log(responseChange.data)
        this.setState({totalSalesToday: responseSales.data, percentChange: responseChange.data}, function() {console.log(this.state.totalSalesToday)})
    }

    componentDidMount(){
        this.getData()
       
    }

    render()
    {
        return (
            <Jumbotron>
                <span><h1>Your total sales today:  ${this.state.totalSalesToday}</h1></span>
                {this.state.percentChange>=0 && <span style={{color: 'green'}}><h1>Your sales grew by {Math.abs(this.state.percentChange)}% from yesterday</h1></span>}
                {this.state.percentChange<0 && <span style={{color: 'red'}}><h1>Your sales fell by {Math.abs(this.state.percentChange)}% from yesterday</h1></span>}
        </Jumbotron>
        )
    }
}