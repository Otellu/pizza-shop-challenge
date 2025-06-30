const deliveryUpdate = async (req, res) => {
  // TODO: handle incoming webhook event and update the order
  console.log('incoming hook', JSON.stringify(req.body))
  res.status(200).json({ message: 'Delivery update received' });
};

module.exports = {
  deliveryUpdate
};
