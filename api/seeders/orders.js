const generateUUID = require('uuid/v4');

class Order {
    constructor(order_id, quantity, product_id, status, delivery_details) {
        this.order_id = order_id;
        this.quantity = quantity;
        this.product_id = product_id;
        this.status = status;
        this.delivery_details = delivery_details;
    }
}

let createOrder = (orderClass, productId) => {
    const orderId = generateUUID();
    const delivery_details = {
        address: '221 Vihiga',
        county: 'Nairobi',
        subcounty: 'Kasarani',
        town: 'Kahawa West'
    }

    let order = new orderClass(orderId, 3, productId, 'Pending payment', delivery_details);

    return order;
}

module.exports = {
    Order,
    createOrder
}