import React from 'react';

export default class MainInput extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            item: String,
            amountSold: Number,
        }
        this.stateUpdate = this.stateUpdate.bind(this);
        this.saleHandler = this.saleHandler.bind(this);
    }

    stateUpdate(event){
       
        if(event.target.id="itemName")
        { 
            this.setState({item: event.target.value})
            console.log(this.state.item);}
        else {console.log("Fuck");}
    }

    saleHandler(){
        console.log(this.state.item);
    }

    render(){
        return(
            <form id="getSale">
                <label for="itemName">
                    <input type="text" id="itemName" name="itemName" onChange={this.stateUpdate}></input>
                    </label> 
                    <input type="button" onClick={this.saleHandler} value="Submit" />
                </form>
        )
    }
}