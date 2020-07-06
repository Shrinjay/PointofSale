import React from 'react';
import axios from 'axios';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import {Button, Jumbotron, Container, Row, Col} from 'reactstrap';

class sellDisplay extends React.Component{
    constructor(props){
        super(props);
        this.state={
            toSell: this.props.toSell
        }
    }

    

    render(){
        return (
            <Jumbotron>
                {this.renderSell()}
            </Jumbotron>
        )
    }
}

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
                total: []
            }]
        }
        this.clickItem = this.clickItem.bind(this);
    }

          renderButtons(){
              return this.props.items.map(item => 
                <span>
             <Button color="primary" onClick={this.clickItem} id={item.name}>{item.name}</Button>
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
            transDate = transDate.toString();
            updatedTransactions.date=transDate;

            this.setState(prevState=>({transactions: [...prevState.transactions, updatedTransactions]}))

            axios.post('http://localhost:3000/log/update',{
                items: updatedTransactions.items,
                key: updatedTransactions.key,
                totalPrice: updatedTransactions.total,
                date: updatedTransactions.date
            })
            .then((res)=>console.log(res))
          }

          async clickItem(event){
                let id = event.target.id;
              
                if (event.target.id=="sell"){
                    ++this.state.transactionNo
                        for(var i=0; i<this.state.toSell.length; i++)
                        {   console.log(this.state.toSell[i].name)
                            let response = await axios.put('http://localhost:3000/items/sell', {
                                item: this.state.toSell[i].name, 
                                amountSold: this.state.toSell[i].amountSold
                            }) 
                           
                           /*NEXT STEP: Find how to reconcile a change in state with updating the database*/
                        }
                        this.updateTLog(this.state.transactionNo)
                        this.props.getState()
                        this.setState({toSell: [], totalPrice: 0})
                     
                }
                else {
                let found = this.props.items.find(element => element.name==id);
                if (this.state.toSell.some(element => element.name==found.name)) {
                    console.log("Already got it, adding on")
                    let index = this.state.toSell.findIndex(element => element.name==found.name)
                    let soldItems = this.state.toSell
                    ++soldItems[index].amountSold
                   this.setState(prevState => ({toSell: soldItems, totalPrice: prevState.totalPrice+found.price}))
                }
                else{
                    console.log("Adding new item")
                    var soldItem = {
                        id: found._id,
                        name: found.name,
                        price: found.price,
                        amountSold: 1
                    }
                    this.setState(prevState => ({toSell: [...prevState.toSell, soldItem], totalPrice: prevState.totalPrice+soldItem.price})); //Reminder on setState behaviour, it is somewhat async, React processes many updates at once, after it is called. Use didUpdate to see if it worked. 
                }
            }
          }
          renderSell(){
            return this.state.toSell.map(element => 
                <span>
                    <Row>
                        <Col>
                    {element.name}
                    </Col>
                    <Col>
                    {element.amountSold}
                    </Col>
                    <Col>
                       ${element.price}
                    </Col>
                    <br />
                    </Row>
                </span>
            )
        }
          

    render(){
        return(
            <div style={{textAlign: 'center'}}>
               
       
       
        <Jumbotron>
            <Container fluid={true}>
                <Row>
                    <Col>
                    <b>Item</b>
                    </Col>
                    <Col>
                    
                    </Col>
                    <Col>
                    <b>Price</b>
                    </Col>
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
            </Row>
            </Container>
        </Jumbotron>
        {this.renderButtons()}
        <br /><br />
        <Button color="success" id="sell" onClick={this.clickItem}>Sell</Button>
        </div>
        )
    }
}