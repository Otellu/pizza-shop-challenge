const deliveryUpdate = async (req, res) => {
  // Simulate 5s delay
  setTimeout(() => {
    res.json({ status: 'delivered', orderId: req.body.orderId });
  }, 5000);
};

module.exports = {
  deliveryUpdate
};
