import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clienteRoutes from "./routes/clienteRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json())

//Rutas

app.get('/', (req, res) => {
    res.send('Backend de BarberEZ 💈 en Funcionamiento')
});


app.use('/api/clientes', clienteRoutes);
app.use('/api/auth', authRoutes);


app.listen(3000, () =>{
    console.log("Servidor corriendo en http://localhost:3000")
});