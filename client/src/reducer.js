import action from './action';

const initialState = {
    inventory: [],
    price: [],
    name: []
}
export default function exp(state=initialState, action){
    switch(action.type){
        case 'UPDATE_DATA': 
        return Object.assign({}, state, {
            inventory: action.inventory,
            price: action.price,
            name: action.name
        })
        default: return state
    }
    
}