import express from "express";

// importamos metodos

import{
    getClientes,
    crearCliente
} from "../controllers/clienteController.js"

const router = express.Router();

router.get("/", getClientes);
router.post("/", crearCliente);

export default router;