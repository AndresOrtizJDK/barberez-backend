import express from "express";

import{
    getBarberos,
    crearBarbero,
    buscarBarbero,
    editarBarbero,
    eliminarBarbero
} from "../controllers/barberoController.js"

const router = express.Router();

router.get("/", getBarberos);
router.post("/", crearBarbero);
router.get("/:cedula", buscarBarbero);
router.put("/:cedula", editarBarbero);
router.delete("/:cedula", eliminarBarbero);

export default router;