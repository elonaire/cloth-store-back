const generateUUID = require('uuid/v4');

class Order {
    constructor(order_id, quantity, status, delivery_details) {
        this.order_id = order_id;
        this.quantity = quantity;
        this.status = status;
        this.delivery_details = delivery_details;
    }
}

let createOrder = (orderClass) => {
    const orderId = generateUUID();
    const delivery_details = {
        address: '221 Vihiga',
        county: 'Nairobi',
        subcounty: 'Kasarani',
        town: 'Kahawa West'
    }

    let order = new orderClass(orderId, 3, 'Pending payment', delivery_details);

    return order;
}

module.exports = {
    Order,
    createOrder
}