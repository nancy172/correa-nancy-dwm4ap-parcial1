// Se importa cada ruta
import petsRouter from "./petsRouter.js";
import caretakersRouter from "./caretakersRouter.js";

function routerAPI(app){
    // Se define cada ruta
    app.use('/api/pets', petsRouter);
    app.use('/api/caretakers', caretakersRouter);
    
}

export default routerAPI;