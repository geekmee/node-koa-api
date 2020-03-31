exports.seed = (knex, Promise) => {
  return knex('products').del()
  .then(() => {
    return knex('products').insert({
      name: 'laptop',
      desc: 'descripton....',
      age: 2,
      available: true
    });
  })
  .then(() => {
    return knex('products').insert({
      name: 'iphone',
      desc: 'descripton....',
      age: 3,
      available: true
    });
  })
  .then(() => {
    return knex('products').insert({
      name: 'ipad',
      desc: 'descripton....',
      age: 5,
      available: true
    });
  });
};
