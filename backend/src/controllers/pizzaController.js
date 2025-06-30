const { Pizza } = require('../models');

const getPizzas = async (req, res) => {
  let filter = {};
  if (typeof req.query.veg !== 'undefined') {
    if (req.query.veg === 'true') filter.veg = true;
    else if (req.query.veg === 'false') filter.veg = false;
  }
  const pizzas = await Pizza.find(filter);
  res.json(pizzas);
};

const createPizza = async (req, res) => {
  const pizza = new Pizza(req.body);
  await pizza.save();
  res.status(201).json(pizza);
};

module.exports = {
  getPizzas,
  createPizza
};
