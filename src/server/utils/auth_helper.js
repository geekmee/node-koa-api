const passport          = require('passport');
const error_types       = require('./error_types');

let AuthHelper = {

    /*
    Este middleware va *antes* de las peticiones.
    passport.authenticate de jwt por defecto añade en req.user el objeto que devolvamos desde
    el callback de verificación de la estrategia jwt.
    En nuestro caso hemos personalizado el auth_callback de authenticate y
    aunque también inyectamos ese dato en req.user, aprovechamos y personalizaremos las respuestas
    para que sean tipo json.
    */
    ensureAuthenticated: (ctx,next)=>{
        passport.authenticate('jwt', {session: false}, (err, user, info)=>{
            console.log("***auth_helper.js: ensureAuthenticated callback auth***");
            //if(info){ return next(new error_types.Error401(info.message)); }

            //si hubo un error en la consulta a la base de datos
            if (err) { return next(err); }

            console.log("***auth_helper.js 1: user is "+user.id);

            //si el token está firmado correctamente pero no pertenece a un usuario existente
            if (!user) { return next(new error_types.Error403("You are not allowed to access.")); }
            console.log("***auth_helper.js 2: user is "+user.username);

            //inyectamos los datos de usuario en la request
            ctx.request.user = user;
            next();
        })(ctx, next);
    },

    /*
    Este middleware va al final de todos los middleware y rutas.
    middleware de manejo de errores.
    */
    errorHandler: (error, ctx, next) => {
        console.log("ejecutando middleware de control de errores");
        if(error instanceof error_types.InfoError)
            ctx.response.status(200).json({error: error.message});
        else if(error instanceof error_types.Error404)
            ctx.response.status(404).json({error: error.message});
        else if(error instanceof error_types.Error403)
            ctx.response.status(403).json({error: error.message});
        else if(error instanceof error_types.Error401)
            ctx.response.status(401).json({error: error.message});
        else if(error.name == "ValidationError") //de mongoose
            ctx.response.status(200).json({error: error.message});
        else if(error.message)
            ctx.response.status(500).json({error: error.message});
        else
            next();
    },

    /*
    Este middleware va al final de todos los middleware y rutas.
    middleware para manejar notFound
    */
    notFoundHandler: (ctx, next) => {
        console.log("ejecutando middleware para manejo de endpoints no encontrados");
        ctx.response.status(404).json({error: "endpoint not found"});
    }
}


module.exports = AuthHelper;