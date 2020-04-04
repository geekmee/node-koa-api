const Router = require('koa-router');
const passport = require('koa-passport');
const fs = require('fs');
const queries = require('../db/queries/users');
const helpers = require('./_helpers');
const jwt       = require('jsonwebtoken');


const router = new Router();

router.get('/auth/register', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./src/server/views/register.html');
});

router.post('/auth/register', async (ctx) => {
  const user = await queries.addUser(ctx.request.body);
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.redirect('/auth/status');
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});

router.get('/auth/login', async (ctx) => {
  if (!helpers.ensureAuthenticated(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/login.html');
  } else {
    ctx.redirect('/auth/status');
  }
});

// use local to auth (session:false), then return jwt token
router.post('/auth/login', async (ctx) => {
  return passport.authenticate('local',{ session: false }, (err, user, info, status) => {
    if (user) {
      /** put to session
      ctx.login(user);
      ctx.redirect('/auth/status');
      **/

      console.log("***** create token *****");
      const payload = {
          sub: user.id,
          exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
          username: user.username
      };
      const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, {algorithm: process.env.JWT_ALGORITHM});
      ctx.body = {data: {token: token}};

    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});

router.get('/auth/logout', async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    ctx.logout();
    ctx.redirect('/auth/login');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

router.get('/auth/status', async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/status.html');
  } else {
    ctx.redirect('/auth/login');
  }
});

router.get('/auth/admin', async (ctx) => {
  if (await helpers.ensureAdmin(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/admin.html');
  } else {
    ctx.redirect('/auth/login');
  }
});

module.exports = router;
