const Router = require('koa-router');
const queries = require('../db/queries/products');
const helpers = require('./_helpers');
const AuthHelper = require('../utils/auth_helper');

const router = new Router();
const BASE_URL = `/api/v1/products`;

router.get(BASE_URL,AuthHelper.ensureAuthenticated, async (ctx) => {
  //if (ctx.isAuthenticated()){
  console.log("***routes/products: /api/v1/products***");
  try {
    const products = await queries.getAllProducts();
    console.log("***/api/v1/products "+products.length);
    ctx.body = {
      status: 'success',
      data: products
    };
  } catch (err) {
    console.log(err)
  }

})

router.get(`${BASE_URL}/:id`, AuthHelper.ensureAuthenticated, async (ctx) => {
  try {
    const product = await queries.getSingleProduct(ctx.params.id);
    if (product.length) {
      ctx.body = {
        status: 'success',
        data: product
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const product = await queries.addProduct(ctx.request.body);
    if (product.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: product
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const product = await queries.updateProduct(ctx.params.id, ctx.request.body);
    if (product.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: product
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const product = await queries.deleteProduct(ctx.params.id);
    if (product.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: product
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

module.exports = router;
