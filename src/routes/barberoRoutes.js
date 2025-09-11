import express from "express";

import{
    getBarberos,
    crearBarbero,
    buscarBarbero,
    editarBarbero,
    eliminarBarbero,
    confirmarCita,
    barberoCitas
} from "../controllers/barberoController.js"

const router = express.Router();

router.get("/", getBarberos);
router.post("/", crearBarbero);
router.get("/:cedula", buscarBarbero);
router.put("/:cedula", editarBarbero);
router.delete("/:cedula", eliminarBarbero);
router.post("/confirmar", confirmarCita);
router.get("/citas/:cedula", barberoCitas);

export default router;