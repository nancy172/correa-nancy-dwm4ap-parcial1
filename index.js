import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port = process.env.PORT;
const dburi = process.env.MONGODB_URI;

const app = express();
import routerApi from "./routes/index.js";

// Conexión con la base de datos
mongoose.connect(dburi);
const db = mongoose.connection;

db.on( 'error', () => {console.error({error})});

db.once( 'open', () => {console.log("Conexión con la base de datos.")});


// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Home
app.get('/', (request, response) =>{
    response.sendFile('Home');
    // res.sendFile('index.html', { root: './public' });
})

// Se llaman a las rutas
routerApi(app);


app.listen( port, () => {
    console.log(   chalk.green(`Servidor Web corriendo en http://localhost:${port}`)  );    
})