const axios = require('axios');
const cron = require('node-cron');

let lastOrderIds = [];

fetchNewOrders();

cron.schedule('0 * * * *', () => {
  fetchNewOrders();
});

async function fetchNewOrders() {
  const endpoint = 'https://app.orderdesk.me/api/v2/orders';
  const storeId = '52098';
  const apiKey = '8fcNEtddnVip6zRLsVEBsfUAoGHMMokcf95S9he4JoL7fUgMrX';
  const headers = {
    'ORDERDESK-STORE-ID': storeId,
    'ORDERDESK-API-KEY': apiKey,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(endpoint, { headers });
    const orders = response.data.orders;
    const newOrders = orders.filter(order => !lastOrderIds.includes(order.id));

    if (newOrders.length > 0) {
      console.log(`${newOrders.length} new order(s) fetched at ${new Date().toISOString()}`);
      newOrders.forEach(order => {
        console.log(`Order ID: ${order.id}`);
        console.log(`Shipping Address: ${order.shipping.address1}`);
      });
      lastOrderIds = orders.map(order => order.id);
    } else {
      console.log(`No new orders fetched at ${new Date().toISOString()}`);
    }
  } catch (error) {
    console.error(`Error fetching orders: ${error}`);
  }
};