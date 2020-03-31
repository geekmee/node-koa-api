const knex = require('../connection');

function getAllProducts() {
  return knex('products')
  .select('*');
}

function getSingleProduct(id) {
  return knex('products')
  .select('*')
  .where({ id: parseInt(id) });
}

function addProduct(product) {
  return knex('products')
  .insert(product)
  .returning('*');
}

function updateProduct(id, product) {
  return knex('products')
  .update(product)
  .where({ id: parseInt(id) })
  .returning('*');
}

function deleteProduct(id) {
  return knex('products')
  .del()
  .where({ id: parseInt(id) })
  .returning('*');
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct
};
