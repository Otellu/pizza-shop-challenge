const { Pizza } = require('../models');

const getPizzas = async (req, res) => {
  // TODO: Add multi-filtering logic
  const pizzas = await Pizza.find();
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
