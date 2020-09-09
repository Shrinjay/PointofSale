import React from 'react';
import axios from 'axios';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import {Button, Jumbotron, Container, Row, Col, Alert, Form, Input, Spinner} from 'reactstrap';


export default class MainInput extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            toSell: [],
            totalPrice: 0, 
            transactionNo: 0,
            transactions: [{
                key: Number,
                date: String,
                items: [],
                total: [],
                failure: false,
              
            }], 
            invalidTrans: false,
            processing: false
        }
        this.clickItem = this.clickItem.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.cancelTrans = this.cancelTrans.bind(this)
        this.removeItem = this.removeItem.bind(this)
    }

    

    handleChange(event){
        let sellCopy = this.state.toSell
        let index = this.state.toSell.findIndex(element=> element.name==event.target.id)
        let oldQuant = sellCopy[index].amountSold
        sellCopy[index].amountSold=event.target.value
        let newTotal = this.state.totalPrice + (sellCopy[index].price * (event.target.value-oldQuant))
        this.setState({toSell: sellCopy, totalPrice: newTotal})
    }

        removeItem(event) {
            let sellCopy = this.state.toSell
            let index = sellCopy.findIndex(element => element.name==event.target.id)
            let newTotal = this.state.totalPrice - (sellCopy[index].price * sellCopy[index].amountSold)
            this.setState({toSell: sellCopy.filter(element => element.name!=event.target.id), totalPrice: newTotal})
        }

        cancelTrans() {
            this.setState({toSell: [], totalPrice: 0})
        }

          renderButtons(){
              return this.props.items.map(item => 
                <span>
             <Button  onClick={this.clickItem} id={item.name} style={{margin: "1px"}}>{item.name}</Button>
             </span>
              )
          }

          updateTLog(transactionNo){
            var updatedTransactions=[]
            var itemNames=[]
            for (var i=0; i<this.state.toSell.length; i++)
            {
                itemNames[i]=this.state.toSell[i].name
            }
            updatedTransactions.items=itemNames; 

            updatedTransactions.key=transactionNo;

            updatedTransactions.total=this.state.totalPrice;

            let transDate = new Date()
            transDate = transDate.toString()
            
            updatedTransactions.date=transDate;

            this.setState(prevState=>({transactions: [...prevState.transactions, updatedTransactions]}))

            axios.post('/api/log/update',{
                items: updatedTransactions.items,
                key: updatedTransactions.key,
                totalPrice: updatedTransactions.total,
                date: updatedTransactions.date
            }, {
                headers: {Authorization: this.props.token}
            })
            
          }

          async clickItem(event){
                let id = event.target.id;
                
                if (event.target.id=="sell"){
                  
                    if (this.state.toSell.length==0 )
                    {
                        this.setState({failure: true})
                        return;
                    } 
                    else {
                        this.setState({failure: false, invalidTrans: false, processing: true})
                        ++this.state.transactionNo                    

                        for(var i=0; i<this.state.toSell.length; i++)
                        {   
                            if (this.state.toSell[i].amountSold==0)
                            {
                                continue
                            }

                            let response = await axios.put('/api/items/sell', {
                                item: this.state.toSell[i].name, 
                                amountSold: this.state.toSell[i].amountSold,
                    
                            }, {headers: {Authorization: this.props.token}})
                            
                            if (response.data=="Excess sold")
                            {
                                this.setState({invalidTrans: this.state.toSell[i].name, processing: false})
                                return
                            }
                        }
                       if (this.state.invalidTrans==false)
                       {
                        this.updateTLog(this.state.transactionNo)
                        this.props.getState()
                        this.setState({toSell: [], totalPrice: 0, processing: false})
                       }
                       
                    
                    }
                }
                else {
                let found = this.props.items.find(element => element.name==id);
                if (this.state.toSell.some(element => element.name==found.name)) {
               
                    let index = this.state.toSell.findIndex(element => element.name==found.name)
                    let soldItems = this.state.toSell
                    ++soldItems[index].amountSold
                   this.setState(prevState => ({toSell: soldItems, totalPrice: prevState.totalPrice+found.price}))
                }
                else{
                   
                    var soldItem = {
                       
                        name: found.name,
                        price: found.price,
                        amountSold: 1
                    }
                    this.setState(prevState => ({toSell: [...prevState.toSell, soldItem], totalPrice: prevState.totalPrice+soldItem.price})); //Reminder on setState behaviour, it is somewhat async, React processes many updates at once, after it is called. Use didUpdate to see if it worked. 
                }
            }
          }
          renderSell(){
            return(
                
                this.state.toSell.map(element => 
                    <span>
                        <Row>
                            <Col>
                        {element.name}
                        </Col>
                        <Col>
                        <Form>
                            <Input type="number" id={element.name} value={element.amountSold} onChange={this.handleChange}/>
                        </Form>
                        </Col>
                        <Col>
                           ${element.price}
                        </Col>
                        <Col>
                            <Button color="danger" id={element.name} onClick={this.removeItem}>Delete</Button>
                        </Col>
                        <br />
                        </Row>
                    </span>
                )
            )
        }
          

    render(){
        
        return(
            <div style={{textAlign: 'center'}}>
               
       <Container fluid={true}>
       <Col md={{size: 10, offset: 1}}>
        <Jumbotron>
        {this.state.failure==true && <Alert color="danger">No items selected for sale.</Alert>}
        
        {this.state.invalidTrans!=false && <Alert color="danger">Amount of {this.state.invalidTrans} sold exceeds amount in inventory!</Alert>}
            <Container fluid={true}>
            
                <Row>
                    <Col>
                    <b>Item</b>
                    </Col>
                    <Col>
                   <b> Quantity Sold</b>
                    </Col>
                    <Col>
                    <b>Unit Price</b>
                    </Col>
                    <Col></Col>
                </Row>
            {this.renderSell()}
            <br />
            <Row>
                <Col>
                <b>Total:</b>
                </Col>
                <Col></Col>
                <Col>
                ${this.state.totalPrice}
                </Col>
                <Col></Col>
            </Row>
            </Container>
        </Jumbotron>
        </Col>
        </Container>
        {this.renderButtons()}
        <br /><br />
        <Button color="success" id="sell" style={{margin: "1px"}} onClick={this.clickItem}>Complete Transaction</Button>
        <Button color="danger" id="cancel" style={{margin: "1px"}} onClick={this.cancelTrans}>Cancel</Button>
        <div><br />
        {this.state.processing ? <Spinner color="primary"></Spinner>: null}
        </div>
        </div>
        )
    }
}