import express from "express";

// importamos metodos

import{
    getClientes,
    crearCliente,
    buscarCliente,
    editarCliente,
    eliminarCliente,
    agendarCita,
    misCitas
} from "../controllers/clienteController.js"


const router = express.Router();

router.get("/", getClientes);
router.post("/", crearCliente);
router.get("/:cedula", buscarCliente);
router.put("/:cedula", editarCliente);
router.delete("/:cedula", eliminarCliente);
router.post("/agendar", agendarCita);
router.get('/citas/:cedula', misCitas);

export default router;