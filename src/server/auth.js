const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy       = require('passport-jwt').Strategy;
const ExtractJwt        = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const knex = require('./db/connection');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

/** for session enabled
//put user.id to session and cookies, triggered by ctx.login(), see routes/auth.js
passport.serializeUser((user, done) => { done(null, user.id); });

//session "passport":{"user":"1"} triggers, this user.id is from cookie saved on client browser
passport.deserializeUser((id, done) => {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});
**/

//authentication strategy - check if username/password exists in database
passport.use(new LocalStrategy({}, (username, password, done) => {
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));


/** config up jwt strategy passport ******/
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.algorithms = [process.env.JWT_ALGORITHM];

passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
    console.log("*** jwt strategy passport verify***");

    knex('users').where({ id: jwt_payload.sub }).first()
      .then((user) => {
        if (!user) {
            return done(null, false);
        }
        else {
          return done(null, user);
        }
      })
      .catch(err=>done(err, null));

}));
