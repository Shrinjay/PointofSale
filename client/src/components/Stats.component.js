//Imports
import React from 'react'
import axios from 'axios'
import { Jumbotron, Spinner, Row, Col } from 'reactstrap'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
} from 'recharts';
import CanvasJSReact from '../canvasjs.react'

//Setup CanvasJS according to website example
var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart

//Component displays statistics related to transactions and store performance. Currently: Sales volume and % change in sales volume. Future: Top items
export default class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Sales: [],
            options: null,
            percentChange: 0,
        }
        this.getData = this.getData.bind(this)
    }

    //Gets data from API
    getData() {
        let responseSales = axios.get('/api/statistics/sales/', {
            headers: {
                Authorization: this.props.token
            }
        })
            .catch(err => {
                console.log(err)
                return
            })
        let responseChange = axios.get('/api/statistics/change/', {
            headers: {
                Authorization: this.props.token
            }
        })
            .catch(err => {
                console.log(err)
                return
            })
        
        //Once all promises resolve, the sales volume data is passed into the graph settings as data
        Promise.all([responseChange, responseSales]).then((values) => {
            this.setState({ Sales: values[1].data, percentChange: values[0].data }, () => {
                this.setState({
                    options: {
                        backgroundColor: null,

                        data: [{
                            type: "column",
                            dataPoints: this.state.Sales
                        }]
                    }
                })

            })
        })


    }

    //Get data on mount, will refactor to check if data has changed then either update state or keep same.
    componentDidMount() {
        this.getData()

    }

    //Graph is only renders if option state is not null.
    render() {
        return (

            <Jumbotron>
                <Row>
                    <Col sm={{ size: 6 }}>
                        <h2 style={{ textAlign: "center" }}>Sales Volume Over Last 5 Days ($)</h2>
                        {this.state.options != null ?
                            <CanvasJSChart options={this.state.options} /> : <div style={{ textAlign: "center" }}><Spinner color="primary" /></div>}
                    </Col>
                    <Col sm={{ size: 6 }}>
                        <div style={{ textAlign: "center" }}>
                            <h3>Change in Sales Volume: </h3>{this.state.percentChange >= 0 && <span style={{ color: 'green' }}><h1><b>+{this.state.percentChange}%</b></h1></span>}
                            {this.state.percentChange < 0 && <span style={{ color: 'red' }}><h1><b>{this.state.percentChange}%</b></h1></span>}
                        </div>
                    </Col>
                </Row>
            </Jumbotron>
        )
    }
}