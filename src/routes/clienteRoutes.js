import express from "express";

// importamos metodos

import{
    getClientes,
    crearCliente,
    buscarCliente,
    editarCliente,
    eliminarCliente
} from "../controllers/clienteController.js"


const router = express.Router();

router.get("/", getClientes);
router.post("/", crearCliente);
router.get("/:cedula", buscarCliente);
router.put("/:cedula", editarCliente);
router.delete("/:cedula", eliminarCliente);

export default router;