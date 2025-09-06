import express from "express";

// importamos metodos

import{
    getClientes,
    crearCliente,
    buscarCliente,
    editarCliente
} from "../controllers/clienteController.js"

const router = express.Router();

router.get("/", getClientes);
router.post("/", crearCliente);
router.get("/:cedula", buscarCliente);
router.put("/:cedula", editarCliente);

export default router;