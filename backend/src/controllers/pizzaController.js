const { Pizza } = require('../models');

const getPizzas = async (req, res) => {
  // TODO: CANDIDATE TASK - Implement filtering, sorting, and pagination
  // 
  // Expected query parameters:
  // - filter: 'all', 'veg', 'non-veg' (filter by vegetarian status)
  // - search: string (search in pizza name and ingredients)
  // - sortBy: 'name', 'price', 'popularity' (sort criteria)
  // - sortOrder: 'asc', 'desc' (sort direction)
  // - page: number (page number for pagination, default: 1)
  // - limit: number (items per page, default: 10)
  //
  // Example API calls:
  // GET /api/pizzas?filter=veg&sortBy=price&sortOrder=asc&page=1&limit=10
  // GET /api/pizzas?search=margherita&sortBy=name&sortOrder=desc
  // GET /api/pizzas?filter=non-veg&page=2&limit=5
  //
  // Expected response format:
  // {
  //   pizzas: [...],
  //   totalCount: number,
  //   currentPage: number,
  //   totalPages: number,
  //   hasNextPage: boolean,
  //   hasPreviousPage: boolean
  // }
  //
  // Implementation hints:
  // - Use MongoDB queries with $regex for search
  // - Use mongoose populate if needed
  // - Implement proper error handling
  // - Consider performance with indexing
  //
  // FOR NOW: Return all pizzas without filtering/sorting/pagination
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
