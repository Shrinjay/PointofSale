
export const updateData = function(inventory, price, name) { //This is the ACTION
    return{
        type: 'UPDATE_DATA',
        inventory,
        price,
        name
    }
}