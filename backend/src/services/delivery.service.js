const axios = require('axios');

/**
 * Simulates a delivery update with a random delay between 5-10 seconds
 * @param {string} orderId - The ID of the order to update
 * @returns {Promise<void>}
 */
const simulateDeliveryUpdate = async (orderId) => {
  // Generate random delay between 5-10 seconds
  const delay = Math.floor(Math.random() * 6000) + 5000; // 5000-11000ms (5-11 seconds)

  console.log(`Scheduling delivery update for order ${orderId} in ${delay / 1000} seconds...`);

  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const payload = {
          event: 'delivery.status_update',
          data: {
            orderId,
            status: 'delivered',
            timestamp: new Date().toISOString()
          }
        };

        // Make the webhook call
        const port = process.env.PORT || 5000
        axios.post(`http://localhost:${port}/api/webhook/delivery-update`, payload);

        console.log(`Delivery update sent for order ${orderId}. Status: delivered.`);
        resolve();
      } catch (error) {
        console.error(`Error sending delivery update for order ${orderId}:`, error.message);
        resolve(); // Still resolve to prevent unhandled promise rejection
      }
    }, delay);
  });
};

module.exports = {
  simulateDeliveryUpdate
};